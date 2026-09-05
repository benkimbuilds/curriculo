import { and, eq, gte, sql } from "drizzle-orm";

import { db, type Database } from "@/db";
import { enrollments, evaluationRuns, programVersions, submissions } from "@/db/schema";
import { listCurriculumWeeks } from "@/modules/curriculum";
import { WEEK_ONE_EVALUATOR_VERSION } from "@/modules/evaluation";
import { createSubmissionSnapshot, SubmissionValidationError } from "@/modules/projects";
import { ResourceNotFoundError } from "@/shared/errors";
import { syncStudentCompletion } from "@/app/programa/student-service";

export interface CreateStudentSubmissionInput {
  userId: string;
  enrollmentId: string;
  week: number;
  repositoryUrl: string;
  commitSha: string;
  deploymentUrl: string;
  reflection: string;
}

export async function createStudentSubmission(
  input: CreateStudentSubmissionInput,
  database: Database = db,
) {
  const reflection = input.reflection.trim();
  if (reflection.length < 20 || reflection.length > 1_000) {
    throw new SubmissionValidationError(["reflection must contain between 20 and 1000 characters"]);
  }

  const submission = await database.transaction(async (transaction) => {
    const [ownedEnrollment] = await transaction
      .select({ id: enrollments.id, contentVersion: programVersions.version })
      .from(enrollments)
      .innerJoin(programVersions, eq(programVersions.id, enrollments.programVersionId))
      .where(and(eq(enrollments.id, input.enrollmentId), eq(enrollments.userId, input.userId), eq(enrollments.status, "active")))
      .limit(1);
    if (!ownedEnrollment) throw new ResourceNotFoundError("Inscripción activa");
    const curriculumWeek = listCurriculumWeeks().find((week) =>
      week.week === input.week && week.contentVersion === ownedEnrollment.contentVersion);
    if (!curriculumWeek) throw new ResourceNotFoundError("Proyecto publicado");

    await transaction.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`${ownedEnrollment.id}:${curriculumWeek.project.id}`}, 0))`);
    const recentWindow = new Date(Date.now() - 5 * 60_000);
    const [recent] = await transaction
      .select({ count: sql<number>`count(*)::int` })
      .from(submissions)
      .where(and(
        eq(submissions.enrollmentId, ownedEnrollment.id),
        eq(submissions.projectId, curriculumWeek.project.id),
        gte(submissions.createdAt, recentWindow),
      ));
    if ((recent?.count ?? 0) >= 5) {
      throw new SubmissionValidationError(["wait before submitting this project again"]);
    }
    const [duplicate] = await transaction
      .select({ id: submissions.id })
      .from(submissions)
      .where(and(
        eq(submissions.enrollmentId, ownedEnrollment.id),
        eq(submissions.projectId, curriculumWeek.project.id),
        eq(submissions.commitSha, input.commitSha.toLowerCase()),
      ))
      .limit(1);
    if (duplicate) {
      throw new SubmissionValidationError(["this commit was already submitted for this project"]);
    }
    if (input.week === 1) {
      const [pending] = await transaction
        .select({ count: sql<number>`count(*)::int` })
        .from(submissions)
        .where(and(
          eq(submissions.enrollmentId, ownedEnrollment.id),
          eq(submissions.projectId, curriculumWeek.project.id),
          eq(submissions.status, "evaluating"),
        ));
      if ((pending?.count ?? 0) >= 2) {
        throw new SubmissionValidationError(["wait for a pending evaluation before resubmitting"]);
      }
    }
    const [attemptRow] = await transaction
      .select({ nextAttempt: sql<number>`coalesce(max(${submissions.attempt}), 0)::int + 1` })
      .from(submissions)
      .where(and(eq(submissions.enrollmentId, ownedEnrollment.id), eq(submissions.projectId, curriculumWeek.project.id)));
    const attempt = attemptRow?.nextAttempt ?? 1;
    const id = crypto.randomUUID();
    const submittedAt = new Date().toISOString();
    const snapshot = createSubmissionSnapshot({
      id,
      studentId: input.userId,
      projectId: curriculumWeek.project.id,
      projectVersion: curriculumWeek.contentVersion,
      rubricVersion: String(curriculumWeek.project.rubric.version),
      attemptNumber: attempt,
      submittedAt,
      repositoryUrl: input.repositoryUrl,
      commitSha: input.commitSha,
      deploymentUrl: input.deploymentUrl,
    });
    const queuesEvaluation = input.week === 1;
    const storedSnapshot: Record<string, unknown> = {
      id: snapshot.id,
      studentId: snapshot.studentId,
      projectId: snapshot.projectId,
      projectVersion: snapshot.projectVersion,
      rubricVersion: snapshot.rubricVersion,
      attemptNumber: snapshot.attemptNumber,
      submittedAt: snapshot.submittedAt,
      artifact: { ...snapshot.artifact },
      reflection,
    };
    const [submission] = await transaction
      .insert(submissions)
      .values({
        id,
        enrollmentId: ownedEnrollment.id,
        projectId: snapshot.projectId,
        projectVersion: snapshot.projectVersion,
        attempt,
        status: queuesEvaluation ? "evaluating" : "submitted",
        repositoryUrl: snapshot.artifact.repositoryUrl,
        commitSha: snapshot.artifact.commitSha,
        deploymentUrl: snapshot.artifact.deploymentUrl,
        submittedAt: new Date(snapshot.submittedAt),
        snapshot: storedSnapshot,
      })
      .returning();
    if (!submission) throw new Error("No se pudo guardar la entrega.");

    const evaluatorVersion = queuesEvaluation ? WEEK_ONE_EVALUATOR_VERSION : "human-review@1";
    await transaction.insert(evaluationRuns).values({
      submissionId: submission.id,
      rubricId: curriculumWeek.project.rubric.id,
      rubricVersion: String(curriculumWeek.project.rubric.version),
      evaluatorVersion,
      idempotencyKey: `${submission.id}:${evaluatorVersion}`,
      status: queuesEvaluation ? "queued" : "needs_review",
      finishedAt: queuesEvaluation ? null : new Date(),
    });
    return submission;
  });
  await syncStudentCompletion({
    userId: input.userId,
    enrollmentId: input.enrollmentId,
    contentVersion: submission.projectVersion,
  }, database);
  return submission;
}
