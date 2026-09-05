import { createHash, randomBytes } from "node:crypto";

import { and, count, eq, sql } from "drizzle-orm";

import { db, type Database } from "@/db";
import {
  cohortMemberships,
  cohortInvitations,
  cohortSchedules,
  cohorts,
  cohortStaffAssignments,
  enrollments,
  announcements,
  mailOutbox,
  roleAssignments,
  user,
  type Cohort,
} from "@/db/schema";
import { recordAuditEvent } from "@/modules/audit/service";
import { loadAuthorizationContext, requirePermission } from "@/modules/authorization/service";
import { AuthorizationDeniedError, ResourceNotFoundError } from "@/shared/errors";
import { getEnvironment } from "@/shared/env";

export type CreateCohortInput = Pick<
  Cohort,
  | "organizationId"
  | "programVersionId"
  | "slug"
  | "name"
  | "startsAt"
  | "endsAt"
  | "timezone"
  | "capacity"
>;

export async function createCohort(
  input: CreateCohortInput,
  actorUserId: string,
  database: Database = db,
): Promise<Cohort> {
  await requirePermission(actorUserId, input.organizationId, "cohort:manage", database);
  return database.transaction(async (transaction) => {
    const [cohort] = await transaction.insert(cohorts).values(input).returning();
    if (!cohort) throw new Error("Cohort insert did not return a record");
    await recordAuditEvent(transaction, {
      actorUserId,
      organizationId: input.organizationId,
      eventType: "cohort.created",
      subjectType: "cohort",
      subjectId: cohort.id,
    });
    return cohort;
  });
}

export async function addLearnerToCohort(
  cohortId: string,
  userId: string,
  actorUserId: string,
  database: Database = db,
): Promise<string> {
  const [cohortScope] = await database
    .select({ organizationId: cohorts.organizationId })
    .from(cohorts)
    .where(eq(cohorts.id, cohortId))
    .limit(1);
  if (!cohortScope) throw new ResourceNotFoundError("Cohort");
  await requirePermission(actorUserId, cohortScope.organizationId, "cohort:manage", database);

  return database.transaction(async (transaction) => {
    const [learner] = await transaction
      .select({ emailVerified: user.emailVerified })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!learner?.emailVerified) throw new Error("LEARNER_EMAIL_NOT_VERIFIED");
    const [cohort] = await transaction
      .select()
      .from(cohorts)
      .where(eq(cohorts.id, cohortId))
      .for("update")
      .limit(1);
    if (!cohort) throw new ResourceNotFoundError("Cohort");

    const [existingMembership] = await transaction
      .select({ enrollmentId: cohortMemberships.enrollmentId, status: cohortMemberships.status })
      .from(cohortMemberships)
      .where(
        and(eq(cohortMemberships.cohortId, cohortId), eq(cohortMemberships.userId, userId)),
      )
      .limit(1);
    if (existingMembership?.status === "active") return existingMembership.enrollmentId;

    const [membershipCount] = await transaction
      .select({ value: count() })
      .from(cohortMemberships)
      .where(
        and(
          eq(cohortMemberships.cohortId, cohortId),
          eq(cohortMemberships.status, "active"),
        ),
      );
    if ((membershipCount?.value ?? 0) >= cohort.capacity) {
      throw new Error("COHORT_CAPACITY_REACHED");
    }

    const [enrollment] = await transaction
      .insert(enrollments)
      .values({
        userId,
        programVersionId: cohort.programVersionId,
        cohortId,
        mode: "facilitated",
        status: "active",
      })
      .onConflictDoUpdate({
        target: [enrollments.userId, enrollments.cohortId],
        targetWhere: eq(enrollments.mode, "facilitated"),
        set: { status: "active", updatedAt: new Date() },
      })
      .returning({ id: enrollments.id });
    if (!enrollment) throw new Error("Failed to create cohort enrollment");

    await transaction
      .insert(cohortMemberships)
      .values({ cohortId, userId, enrollmentId: enrollment.id, status: "active" })
      .onConflictDoUpdate({
        target: [cohortMemberships.cohortId, cohortMemberships.userId],
        set: { status: "active", enrollmentId: enrollment.id, updatedAt: new Date() },
      });

    await recordAuditEvent(transaction, {
      actorUserId,
      organizationId: cohort.organizationId,
      eventType: "cohort.learner_added",
      subjectType: "cohort_membership",
      subjectId: `${cohortId}:${userId}`,
      metadata: { cohortId, userId, enrollmentId: enrollment.id },
    });
    return enrollment.id;
  });
}

export async function assignCohortStaff(
  cohortId: string,
  userId: string,
  role: "instructor" | "administrator" | "curriculum_editor" | "developer_administrator",
  actorUserId: string,
  database: Database = db,
): Promise<void> {
  const [cohortScope] = await database
    .select({ organizationId: cohorts.organizationId })
    .from(cohorts)
    .where(eq(cohorts.id, cohortId))
    .limit(1);
  if (!cohortScope) throw new ResourceNotFoundError("Cohort");
  await requirePermission(actorUserId, cohortScope.organizationId, "cohort:manage", database);

  await database.transaction(async (transaction) => {
    const [cohort] = await transaction
      .select({ organizationId: cohorts.organizationId })
      .from(cohorts)
      .where(eq(cohorts.id, cohortId))
      .limit(1);
    if (!cohort) throw new ResourceNotFoundError("Cohort");
    const [organizationRole] = await transaction
      .select({ id: roleAssignments.id })
      .from(roleAssignments)
      .where(
        and(
          eq(roleAssignments.userId, userId),
          eq(roleAssignments.organizationId, cohort.organizationId),
          eq(roleAssignments.role, role),
        ),
      )
      .limit(1);
    if (!organizationRole) {
      throw new Error("COHORT_STAFF_ROLE_NOT_ASSIGNED");
    }
    await transaction
      .insert(cohortStaffAssignments)
      .values({ cohortId, userId, role })
      .onConflictDoNothing();
    await recordAuditEvent(transaction, {
      actorUserId,
      organizationId: cohort.organizationId,
      eventType: "cohort.staff_assigned",
      subjectType: "cohort_staff_assignment",
      subjectId: `${cohortId}:${userId}:${role}`,
    });
  });
}

async function requireCohortManager(
  cohortId: string,
  actorUserId: string,
  database: Database,
) {
  const [cohort] = await database.select().from(cohorts).where(eq(cohorts.id, cohortId)).limit(1);
  if (!cohort) throw new ResourceNotFoundError("Cohort");
  await requirePermission(actorUserId, cohort.organizationId, "cohort:manage", database);
  return cohort;
}

export async function updateCohort(
  cohortId: string,
  input: Partial<Pick<Cohort, "name" | "startsAt" | "endsAt" | "timezone" | "capacity">>,
  actorUserId: string,
  database: Database = db,
): Promise<Cohort> {
  const current = await requireCohortManager(cohortId, actorUserId, database);
  const startsAt = input.startsAt ?? current.startsAt;
  const endsAt = input.endsAt ?? current.endsAt;
  if (endsAt <= startsAt || (input.capacity ?? current.capacity) < 1) throw new Error("COHORT_INPUT_INVALID");
  return database.transaction(async (transaction) => {
    const [updated] = await transaction.update(cohorts).set({ ...input, updatedAt: new Date() }).where(eq(cohorts.id, cohortId)).returning();
    if (!updated) throw new ResourceNotFoundError("Cohort");
    await recordAuditEvent(transaction, { actorUserId, organizationId: current.organizationId, eventType: "cohort.updated", subjectType: "cohort", subjectId: cohortId });
    return updated;
  });
}

export async function archiveCohort(cohortId: string, actorUserId: string, database: Database = db): Promise<void> {
  const cohort = await requireCohortManager(cohortId, actorUserId, database);
  await database.transaction(async (transaction) => {
    await transaction.update(cohorts).set({ active: false, updatedAt: new Date() }).where(eq(cohorts.id, cohortId));
    await recordAuditEvent(transaction, { actorUserId, organizationId: cohort.organizationId, eventType: "cohort.archived", subjectType: "cohort", subjectId: cohortId });
  });
}

export async function setCohortWeekSchedule(
  cohortId: string,
  weekId: string,
  input: { opensAt?: Date | null; dueAt?: Date | null },
  actorUserId: string,
  database: Database = db,
): Promise<void> {
  const cohort = await requireCohortManager(cohortId, actorUserId, database);
  if (!/^week-(?:0[1-9]|1[0-2])$/.test(weekId) || (input.opensAt && input.dueAt && input.dueAt <= input.opensAt)) throw new Error("COHORT_SCHEDULE_INVALID");
  await database.transaction(async (transaction) => {
    await transaction.insert(cohortSchedules).values({ cohortId, weekId, ...input }).onConflictDoUpdate({
      target: [cohortSchedules.cohortId, cohortSchedules.weekId],
      set: { ...input, updatedAt: new Date() },
    });
    await recordAuditEvent(transaction, { actorUserId, organizationId: cohort.organizationId, eventType: "cohort.schedule_updated", subjectType: "cohort", subjectId: cohortId, metadata: { weekId } });
  });
}

export async function removeLearnerFromCohort(cohortId: string, learnerId: string, actorUserId: string, database: Database = db): Promise<void> {
  const cohort = await requireCohortManager(cohortId, actorUserId, database);
  await database.transaction(async (transaction) => {
    const memberships = await transaction.select({ enrollmentId: cohortMemberships.enrollmentId }).from(cohortMemberships).where(and(eq(cohortMemberships.cohortId, cohortId), eq(cohortMemberships.userId, learnerId)));
    await transaction.update(cohortMemberships).set({ status: "withdrawn", updatedAt: new Date() }).where(and(eq(cohortMemberships.cohortId, cohortId), eq(cohortMemberships.userId, learnerId)));
    for (const membership of memberships) await transaction.update(enrollments).set({ status: "withdrawn", updatedAt: new Date() }).where(eq(enrollments.id, membership.enrollmentId));
    await recordAuditEvent(transaction, { actorUserId, organizationId: cohort.organizationId, eventType: "cohort.learner_removed", subjectType: "cohort_membership", subjectId: `${cohortId}:${learnerId}` });
  });
}

export async function removeCohortStaff(cohortId: string, staffUserId: string, actorUserId: string, database: Database = db): Promise<void> {
  const cohort = await requireCohortManager(cohortId, actorUserId, database);
  await database.transaction(async (transaction) => {
    await transaction.delete(cohortStaffAssignments).where(and(eq(cohortStaffAssignments.cohortId, cohortId), eq(cohortStaffAssignments.userId, staffUserId)));
    await recordAuditEvent(transaction, { actorUserId, organizationId: cohort.organizationId, eventType: "cohort.staff_removed", subjectType: "cohort_staff_assignment", subjectId: `${cohortId}:${staffUserId}` });
  });
}

export async function grantOrganizationRole(
  organizationId: string,
  targetUserId: string,
  role: "student" | "instructor" | "administrator" | "curriculum_editor" | "developer_administrator",
  actorUserId: string,
  database: Database = db,
): Promise<void> {
  await requirePermission(actorUserId, organizationId, "role:manage", database);
  if (role === "developer_administrator") {
    const actor = await loadAuthorizationContext(actorUserId, organizationId, database);
    if (!actor.organizationRoles.includes("developer_administrator")) {
      throw new AuthorizationDeniedError("role:manage:developer_administrator");
    }
  }
  await database.transaction(async (transaction) => {
    await transaction.insert(roleAssignments).values({ organizationId, userId: targetUserId, role }).onConflictDoNothing();
    await recordAuditEvent(transaction, { actorUserId, organizationId, eventType: "organization.role_granted", subjectType: "role_assignment", subjectId: `${targetUserId}:${role}` });
  });
}

export async function publishAnnouncement(
  cohortId: string,
  input: { title: string; body: string; publishedAt?: Date; expiresAt?: Date | null },
  actorUserId: string,
  database: Database = db,
): Promise<string> {
  const cohort = await requireCohortManager(cohortId, actorUserId, database);
  if (input.title.trim().length < 3 || input.body.trim().length < 3) throw new Error("ANNOUNCEMENT_INVALID");
  return database.transaction(async (transaction) => {
    const [announcement] = await transaction.insert(announcements).values({ organizationId: cohort.organizationId, cohortId, authorUserId: actorUserId, title: input.title.trim(), body: input.body.trim(), publishedAt: input.publishedAt ?? new Date(), expiresAt: input.expiresAt ?? null }).returning({ id: announcements.id });
    if (!announcement) throw new Error("ANNOUNCEMENT_CREATE_FAILED");
    await recordAuditEvent(transaction, { actorUserId, organizationId: cohort.organizationId, eventType: "cohort.announcement_published", subjectType: "announcement", subjectId: announcement.id });
    return announcement.id;
  });
}

export async function inviteLearnerToCohort(
  cohortId: string,
  emailAddress: string,
  actorUserId: string,
  database: Database = db,
): Promise<{ added: boolean }> {
  const cohort = await requireCohortManager(cohortId, actorUserId, database);
  const email = emailAddress.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("INVITATION_EMAIL_INVALID");
  const [existing] = await database.select({ id: user.id, emailVerified: user.emailVerified }).from(user).where(sql`lower(${user.email}) = ${email}`).limit(1);
  if (existing?.emailVerified) {
    await addLearnerToCohort(cohortId, existing.id, actorUserId, database);
    return { added: true };
  }
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const environment = getEnvironment();
  await database.transaction(async (transaction) => {
    await transaction.insert(cohortInvitations).values({ cohortId, email, tokenHash, invitedByUserId: actorUserId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60_000) });
    await transaction.insert(mailOutbox).values({
      kind: "cohort_invitation",
      recipient: email,
      subject: `Invitación a ${cohort.name}`,
      textBody: `Crea o verifica tu cuenta con este mismo correo. Al verificarla, te agregaremos automáticamente a ${cohort.name}. Acceso: ${environment.BETTER_AUTH_URL}/registro`,
    });
    await recordAuditEvent(transaction, { actorUserId, organizationId: cohort.organizationId, eventType: "cohort.invitation_created", subjectType: "cohort", subjectId: cohortId, metadata: { email } });
  });
  return { added: false };
}
