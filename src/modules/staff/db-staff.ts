import { and, desc, eq, inArray } from "drizzle-orm";

import { db, type Database } from "@/db";
import {
  cohortMemberships,
  cohorts,
  cohortSchedules,
  enrollments,
  evaluationOverrides,
  evaluationResults,
  evaluationRuns,
  interventionNotes,
  lessonProgress,
  profiles,
  submissions,
  user,
} from "@/db/schema";
import { canManageCohort } from "@/modules/authorization/policy";
import { loadAuthorizationContext, requirePermission } from "@/modules/authorization/service";
import { getCurriculumWeekById, getRequiredLessonIds } from "@/modules/curriculum";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { AuthorizationDeniedError, ResourceNotFoundError } from "@/shared/errors";
import { recordAuditEvent } from "@/modules/audit/service";
import { syncStudentCompletion } from "@/app/programa/student-service";

import { InterventionService } from "./intervention-service";
import type {
  InterventionNoteRepository,
  RosterRepository,
  StaffClock,
  StaffIdGenerator,
} from "./repositories";
import { RosterService } from "./roster-service";
import type {
  EvaluationStatus,
  InterventionCategory,
  InterventionNote,
  LearnerRosterEvidence,
  RosterFilters,
  RosterResult,
  StaffActor,
  SubmissionStatus,
} from "./types";

export interface StaffCohortSummary {
  id: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
  active: boolean;
  students: number;
  needingAttention: number;
  onPace: number;
  submitted: number;
}

export interface CohortDashboard {
  cohort: {
    id: string;
    name: string;
    startsAt: Date;
    endsAt: Date;
    timezone: string;
  };
  roster: RosterResult;
}

export interface StudentTimelineEvent {
  id: string;
  type: "lesson" | "submission" | "evaluation" | "intervention";
  occurredAt: Date;
  title: string;
  detail: string;
}

export interface StudentTimeline {
  learner: { id: string; name: string; email: string };
  cohort: { id: string; name: string };
  events: readonly StudentTimelineEvent[];
  notes: readonly InterventionNote[];
}

function toStaffActor(
  userId: string,
  context: Awaited<ReturnType<typeof loadAuthorizationContext>>,
): StaffActor {
  const administrator =
    context.organizationRoles.includes("administrator") ||
    context.organizationRoles.includes("developer_administrator");
  return {
    userId,
    roles: administrator ? ["administrator"] : ["facilitator"],
    assignedCohortIds: context.staffedCohortIds ?? [],
  };
}

export async function requireStaffActor(
  userId: string,
  permission: "roster:read" | "intervention:manage",
  cohortId?: string,
  database: Database = db,
): Promise<StaffActor> {
  const organizationId = await resolveDefaultOrganizationId(database);
  const context = await requirePermission(userId, organizationId, permission, database);
  if (cohortId && !canManageCohort(context, cohortId)) {
    throw new AuthorizationDeniedError(permission);
  }
  return toStaffActor(userId, context);
}

function latestBy<T>(
  rows: readonly T[],
  key: (value: T) => string,
  date: (value: T) => Date,
): Map<string, T> {
  const result = new Map<string, T>();
  for (const row of rows) {
    const current = result.get(key(row));
    if (!current || date(row) > date(current)) result.set(key(row), row);
  }
  return result;
}

function newestDate(dates: readonly (Date | null | undefined)[]): Date | null {
  const timestamps = dates.flatMap((date) => (date ? [date.getTime()] : []));
  return timestamps.length ? new Date(Math.max(...timestamps)) : null;
}

function mapSubmissionStatus(
  row: { status: typeof submissions.$inferSelect.status; attempt: number } | undefined,
): SubmissionStatus {
  if (!row) return "not_started";
  if (row.status === "draft") return "draft";
  if (row.status === "passed") return "accepted";
  if (row.attempt > 1 || row.status === "needs_revision") return "resubmitted";
  return "submitted";
}

function mapEvaluationStatus(
  row: { status: typeof evaluationRuns.$inferSelect.status } | undefined,
  overridden: boolean,
): EvaluationStatus {
  if (overridden) return "overridden";
  if (!row) return "not_applicable";
  if (row.status === "queued") return "pending";
  return row.status;
}

export class DrizzleRosterRepository implements RosterRepository {
  constructor(private readonly database: Database = db, private readonly now = new Date()) {}

  async listEvidenceByCohort(cohortId: string): Promise<readonly LearnerRosterEvidence[]> {
    const members = await this.database
      .select({
        userId: cohortMemberships.userId,
        enrollmentId: cohortMemberships.enrollmentId,
        displayName: profiles.chosenName,
        accountName: user.name,
        email: user.email,
      })
      .from(cohortMemberships)
      .innerJoin(user, eq(user.id, cohortMemberships.userId))
      .leftJoin(profiles, eq(profiles.userId, cohortMemberships.userId))
      .where(
        and(
          eq(cohortMemberships.cohortId, cohortId),
          eq(cohortMemberships.status, "active"),
        ),
      );
    const enrollmentIds = members.map(({ enrollmentId }) => enrollmentId);
    if (!enrollmentIds.length) return [];
    const [lessons, attempts, schedules] = await Promise.all([
      this.database
        .select()
        .from(lessonProgress)
        .where(inArray(lessonProgress.enrollmentId, enrollmentIds)),
      this.database
        .select()
        .from(submissions)
        .where(inArray(submissions.enrollmentId, enrollmentIds)),
      this.database
        .select()
        .from(cohortSchedules)
        .where(eq(cohortSchedules.cohortId, cohortId)),
    ]);
    const submissionIds = attempts.map(({ id }) => id);
    const runs = submissionIds.length
      ? await this.database
          .select()
          .from(evaluationRuns)
          .where(inArray(evaluationRuns.submissionId, submissionIds))
      : [];
    const runIds = runs.map(({ id }) => id);
    const overrides = runIds.length
      ? await this.database
          .select({ evaluationRunId: evaluationOverrides.evaluationRunId })
          .from(evaluationOverrides)
          .where(inArray(evaluationOverrides.evaluationRunId, runIds))
      : [];
    const overrideIds = new Set(overrides.map(({ evaluationRunId }) => evaluationRunId));
    const expectedLessonIds = new Set(
      schedules
        .filter(({ dueAt }) => dueAt && dueAt <= this.now)
        .flatMap(({ weekId }) =>
          getCurriculumWeekById(weekId, { locale: "es-MX" })?.modules.flatMap((module) =>
            module.lessons.filter(({ required }) => required).map(({ id }) => id),
          ) ?? [],
        ),
    );
    const totalRequiredItems = getRequiredLessonIds("es-MX").length;
    const latestSubmissions = latestBy(
      attempts,
      ({ enrollmentId }) => enrollmentId,
      ({ submittedAt }) => submittedAt,
    );
    const latestRuns = latestBy(
      runs,
      ({ submissionId }) => submissionId,
      ({ createdAt }) => createdAt,
    );
    return members.map((member) => {
      const memberLessons = lessons.filter(({ enrollmentId }) => enrollmentId === member.enrollmentId);
      const completedRequiredItems = new Set(
        memberLessons
          .filter(({ state }) => state === "completed" || state === "passed")
          .map(({ lessonId }) => lessonId),
      ).size;
      const latestSubmission = latestSubmissions.get(member.enrollmentId);
      const latestRun = latestSubmission ? latestRuns.get(latestSubmission.id) : undefined;
      return {
        userId: member.userId,
        cohortId,
        displayName: member.displayName || member.accountName,
        email: member.email,
        completedRequiredItems,
        expectedCompletedItems: expectedLessonIds.size,
        totalRequiredItems,
        lastActivityAt: newestDate([
          ...memberLessons.map(({ updatedAt }) => updatedAt),
          ...attempts
            .filter(({ enrollmentId }) => enrollmentId === member.enrollmentId)
            .map(({ updatedAt }) => updatedAt),
        ]),
        lastSubmissionAt: latestSubmission?.submittedAt ?? null,
        submissionStatus: mapSubmissionStatus(latestSubmission),
        evaluationStatus: mapEvaluationStatus(
          latestRun,
          latestRun ? overrideIds.has(latestRun.id) : false,
        ),
        hasOverdueRequiredWork: completedRequiredItems < expectedLessonIds.size,
      };
    });
  }

  async isLearnerInCohort(learnerId: string, cohortId: string): Promise<boolean> {
    const [member] = await this.database
      .select({ id: cohortMemberships.id })
      .from(cohortMemberships)
      .where(
        and(
          eq(cohortMemberships.userId, learnerId),
          eq(cohortMemberships.cohortId, cohortId),
          eq(cohortMemberships.status, "active"),
        ),
      )
      .limit(1);
    return Boolean(member);
  }
}

function decodeNote(note: string): { category: InterventionCategory; text: string } {
  const match = note.match(/^\[([a-z_]+)]\s([\s\S]*)$/);
  const categories = new Set<InterventionCategory>([
    "academic_support",
    "attendance_follow_up",
    "technical_support",
    "wellbeing_check_in",
    "accommodation",
    "other",
  ]);
  return match && categories.has(match[1] as InterventionCategory)
    ? { category: match[1] as InterventionCategory, text: match[2] }
    : { category: "other", text: note };
}

export class DrizzleInterventionNoteRepository implements InterventionNoteRepository {
  constructor(private readonly database: Database = db) {}

  async append(note: InterventionNote): Promise<void> {
    await this.database.insert(interventionNotes).values({
      id: note.id,
      cohortId: note.cohortId,
      studentUserId: note.learnerId,
      authorUserId: note.authorId,
      note: `[${note.category}] ${note.note}`,
      followUpAt: note.followUpAt,
      createdAt: note.createdAt,
      updatedAt: note.createdAt,
    });
  }

  async listForLearner(
    cohortId: string,
    learnerId: string,
  ): Promise<readonly InterventionNote[]> {
    const rows = await this.database
      .select()
      .from(interventionNotes)
      .where(
        and(
          eq(interventionNotes.cohortId, cohortId),
          eq(interventionNotes.studentUserId, learnerId),
        ),
      )
      .orderBy(desc(interventionNotes.createdAt));
    return rows.map((row) => {
      const decoded = decodeNote(row.note);
      return {
        id: row.id,
        cohortId: row.cohortId,
        learnerId: row.studentUserId,
        authorId: row.authorUserId,
        category: decoded.category,
        note: decoded.text,
        followUpAt: row.followUpAt,
        createdAt: row.createdAt,
      };
    });
  }
}

export const systemStaffClock: StaffClock = { now: () => new Date() };
export const cryptoStaffIds: StaffIdGenerator = { nextId: () => crypto.randomUUID() };

export async function listStaffCohorts(
  actorUserId: string,
  database: Database = db,
): Promise<StaffCohortSummary[]> {
  const actor = await requireStaffActor(actorUserId, "roster:read", undefined, database);
  const available = await database
    .select({
      id: cohorts.id,
      name: cohorts.name,
      startsAt: cohorts.startsAt,
      endsAt: cohorts.endsAt,
      active: cohorts.active,
    })
    .from(cohorts)
    .where(
      actor.roles.includes("administrator")
        ? undefined
        : inArray(cohorts.id, [...actor.assignedCohortIds]),
    )
    .orderBy(desc(cohorts.startsAt));
  const rosterRepository = new DrizzleRosterRepository(database);
  const rosterService = new RosterService(rosterRepository, systemStaffClock);
  return Promise.all(
    available.map(async (cohort) => {
      const roster = await rosterService.list(actor, cohort.id);
      return {
        ...cohort,
        students: roster.aggregates.total,
        needingAttention: roster.aggregates.needingAttention,
        onPace:
          roster.aggregates.pace.ahead +
          roster.aggregates.pace.on_track +
          roster.aggregates.pace.complete,
        submitted:
          roster.aggregates.submission.submitted +
          roster.aggregates.submission.resubmitted +
          roster.aggregates.submission.accepted,
      };
    }),
  );
}

export async function getCohortDashboard(
  actorUserId: string,
  cohortId: string,
  filters: RosterFilters = {},
  database: Database = db,
): Promise<CohortDashboard> {
  const actor = await requireStaffActor(actorUserId, "roster:read", cohortId, database);
  const [cohort] = await database
    .select({
      id: cohorts.id,
      name: cohorts.name,
      startsAt: cohorts.startsAt,
      endsAt: cohorts.endsAt,
      timezone: cohorts.timezone,
    })
    .from(cohorts)
    .where(eq(cohorts.id, cohortId))
    .limit(1);
  if (!cohort) throw new ResourceNotFoundError("Cohort");
  const roster = await new RosterService(
    new DrizzleRosterRepository(database),
    systemStaffClock,
  ).list(actor, cohortId, filters);
  return { cohort, roster };
}

export async function getStudentTimeline(
  actorUserId: string,
  cohortId: string,
  learnerId: string,
  database: Database = db,
): Promise<StudentTimeline> {
  await requireStaffActor(actorUserId, "roster:read", cohortId, database);
  const [learner] = await database
    .select({
      id: user.id,
      name: profiles.chosenName,
      accountName: user.name,
      email: user.email,
      enrollmentId: cohortMemberships.enrollmentId,
      cohortName: cohorts.name,
    })
    .from(cohortMemberships)
    .innerJoin(user, eq(user.id, cohortMemberships.userId))
    .innerJoin(cohorts, eq(cohorts.id, cohortMemberships.cohortId))
    .leftJoin(profiles, eq(profiles.userId, user.id))
    .where(
      and(
        eq(cohortMemberships.cohortId, cohortId),
        eq(cohortMemberships.userId, learnerId),
        eq(cohortMemberships.status, "active"),
      ),
    )
    .limit(1);
  if (!learner) throw new ResourceNotFoundError("Learner");
  const [lessons, attempts, notes] = await Promise.all([
    database
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.enrollmentId, learner.enrollmentId)),
    database
      .select()
      .from(submissions)
      .where(eq(submissions.enrollmentId, learner.enrollmentId)),
    new DrizzleInterventionNoteRepository(database).listForLearner(cohortId, learnerId),
  ]);
  const attemptIds = attempts.map(({ id }) => id);
  const runs = attemptIds.length
    ? await database
        .select()
        .from(evaluationRuns)
        .where(inArray(evaluationRuns.submissionId, attemptIds))
    : [];
  const events: StudentTimelineEvent[] = [
    ...lessons.map((row) => ({
      id: row.id,
      type: "lesson" as const,
      occurredAt: row.updatedAt,
      title: row.lessonId,
      detail: `Estado: ${row.state}`,
    })),
    ...attempts.map((row) => ({
      id: row.id,
      type: "submission" as const,
      occurredAt: row.submittedAt,
      title: `${row.projectId} · intento ${row.attempt}`,
      detail: `Entrega: ${row.status}`,
    })),
    ...runs.map((row) => ({
      id: row.id,
      type: "evaluation" as const,
      occurredAt: row.updatedAt,
      title: "Evaluación de proyecto",
      detail: `Estado: ${row.status}`,
    })),
    ...notes.map((row) => ({
      id: row.id,
      type: "intervention" as const,
      occurredAt: row.createdAt,
      title: "Nota de intervención",
      detail: row.note,
    })),
  ].sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime());
  return {
    learner: { id: learner.id, name: learner.name || learner.accountName, email: learner.email },
    cohort: { id: cohortId, name: learner.cohortName },
    events,
    notes,
  };
}

export async function addInterventionNote(
  actorUserId: string,
  input: {
    cohortId: string;
    learnerId: string;
    category: InterventionCategory;
    note: string;
    followUpAt?: Date | null;
  },
  database: Database = db,
): Promise<InterventionNote> {
  const actor = await requireStaffActor(
    actorUserId,
    "intervention:manage",
    input.cohortId,
    database,
  );
  return new InterventionService(
    new DrizzleRosterRepository(database),
    new DrizzleInterventionNoteRepository(database),
    systemStaffClock,
    cryptoStaffIds,
  ).add(actor, input);
}

export interface ReviewableSubmission {
  submissionId: string;
  evaluationRunId: string;
  projectId: string;
  attempt: number;
  submissionStatus: typeof submissions.$inferSelect.status;
  evaluationStatus: typeof evaluationRuns.$inferSelect.status;
  repositoryUrl: string;
  deploymentUrl: string | null;
  evidence: Array<{ criterionId: string; passed: boolean | null; message: string }>;
}

export async function listReviewableSubmissions(
  actorUserId: string,
  cohortId: string,
  learnerId: string,
  database: Database = db,
): Promise<ReviewableSubmission[]> {
  await requireStaffActor(actorUserId, "intervention:manage", cohortId, database);
  const rows = await database
    .select({
      submission: submissions,
      run: evaluationRuns,
    })
    .from(cohortMemberships)
    .innerJoin(submissions, eq(submissions.enrollmentId, cohortMemberships.enrollmentId))
    .innerJoin(evaluationRuns, eq(evaluationRuns.submissionId, submissions.id))
    .where(and(
      eq(cohortMemberships.cohortId, cohortId),
      eq(cohortMemberships.userId, learnerId),
      eq(cohortMemberships.status, "active"),
    ))
    .orderBy(desc(submissions.submittedAt));
  const runIds = rows.map(({ run }) => run.id);
  const evidenceRows = runIds.length
    ? await database.select().from(evaluationResults).where(inArray(evaluationResults.evaluationRunId, runIds))
    : [];
  return rows.map(({ submission, run }) => ({
    submissionId: submission.id,
    evaluationRunId: run.id,
    projectId: submission.projectId,
    attempt: submission.attempt,
    submissionStatus: submission.status,
    evaluationStatus: run.status,
    repositoryUrl: submission.repositoryUrl,
    deploymentUrl: submission.deploymentUrl,
    evidence: evidenceRows.filter(({ evaluationRunId }) => evaluationRunId === run.id).map((item) => ({
      criterionId: item.criterionId,
      passed: item.passed,
      message: typeof item.evidence.message === "string" ? item.evidence.message : item.criterionId,
    })),
  }));
}

export async function reviewSubmission(
  actorUserId: string,
  input: {
    cohortId: string;
    learnerId: string;
    evaluationRunId: string;
    outcome: "passed" | "failed";
    reason: string;
  },
  database: Database = db,
): Promise<void> {
  await requireStaffActor(actorUserId, "intervention:manage", input.cohortId, database);
  const reason = input.reason.trim();
  if (reason.length < 10 || reason.length > 1_000) throw new Error("REVIEW_REASON_INVALID");
  const [target] = await database
    .select({
      runId: evaluationRuns.id,
      previousStatus: evaluationRuns.status,
      submissionId: submissions.id,
      enrollmentId: enrollments.id,
      contentVersion: submissions.projectVersion,
      organizationId: cohorts.organizationId,
    })
    .from(evaluationRuns)
    .innerJoin(submissions, eq(submissions.id, evaluationRuns.submissionId))
    .innerJoin(enrollments, eq(enrollments.id, submissions.enrollmentId))
    .innerJoin(cohortMemberships, eq(cohortMemberships.enrollmentId, enrollments.id))
    .innerJoin(cohorts, eq(cohorts.id, cohortMemberships.cohortId))
    .where(and(
      eq(evaluationRuns.id, input.evaluationRunId),
      eq(cohortMemberships.cohortId, input.cohortId),
      eq(cohortMemberships.userId, input.learnerId),
      eq(cohortMemberships.status, "active"),
    ))
    .limit(1);
  if (!target) throw new ResourceNotFoundError("Evaluación");
  await database.transaction(async (transaction) => {
    await transaction.insert(evaluationOverrides).values({
      evaluationRunId: target.runId,
      reviewerUserId: actorUserId,
      status: input.outcome,
      reason,
    });
    await transaction.update(evaluationRuns).set({
      status: input.outcome,
      finishedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(evaluationRuns.id, target.runId));
    await transaction.update(submissions).set({
      status: input.outcome === "passed" ? "passed" : "needs_revision",
      updatedAt: new Date(),
    }).where(eq(submissions.id, target.submissionId));
    await recordAuditEvent(transaction, {
      actorUserId,
      organizationId: target.organizationId,
      eventType: "evaluation.staff_override",
      subjectType: "evaluation_run",
      subjectId: target.runId,
      metadata: { from: target.previousStatus, to: input.outcome },
    });
  });
  if (input.outcome === "passed") {
    await syncStudentCompletion({
      userId: input.learnerId,
      enrollmentId: target.enrollmentId,
      contentVersion: target.contentVersion,
    }, database);
  }
}
