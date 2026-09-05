import { and, count, eq, gt, sql } from "drizzle-orm";

import { db, type Database } from "@/db";
import {
  cohortInvitations,
  cohortMemberships,
  cohorts,
  enrollments,
  organizations,
  profiles,
  programs,
  programVersions,
  roleAssignments,
  user,
} from "@/db/schema";
import { recordAuditEvent } from "@/modules/audit/service";
import { getEnvironment } from "@/shared/env";
import { ResourceNotFoundError } from "@/shared/errors";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export type SelfPacedProvisioningResult = {
  organizationId: string;
  programVersionId: string;
  enrollmentId: string;
};

async function findDefaultProgramVersion(transaction: Transaction) {
  const environment = getEnvironment();
  const [record] = await transaction
    .select({
      organizationId: organizations.id,
      programVersionId: programVersions.id,
    })
    .from(organizations)
    .innerJoin(
      programs,
      and(
        eq(programs.organizationId, organizations.id),
        eq(programs.slug, environment.DEFAULT_PROGRAM_SLUG),
      ),
    )
    .innerJoin(
      programVersions,
      and(eq(programVersions.programId, programs.id), eq(programVersions.isDefault, true)),
    )
    .where(eq(organizations.slug, environment.DEFAULT_ORGANIZATION_SLUG))
    .limit(1);

  if (!record) {
    throw new ResourceNotFoundError("Default published program version");
  }

  return record;
}

export async function provisionVerifiedLearner(
  userId: string,
  database: Database = db,
): Promise<SelfPacedProvisioningResult> {
  return database.transaction(async (transaction) => {
    const defaults = await findDefaultProgramVersion(transaction);

    await transaction
      .insert(profiles)
      .values({ userId, isMinor: true, profileVisible: false, locale: "es-MX" })
      .onConflictDoNothing({ target: profiles.userId });

    await transaction
      .insert(roleAssignments)
      .values({
        userId,
        organizationId: defaults.organizationId,
        role: "student",
      })
      .onConflictDoNothing();

    const [enrollment] = await transaction
      .insert(enrollments)
      .values({
        userId,
        programVersionId: defaults.programVersionId,
        mode: "self_paced",
        status: "active",
      })
      .onConflictDoUpdate({
        target: [enrollments.userId, enrollments.programVersionId],
        targetWhere: eq(enrollments.mode, "self_paced"),
        set: { status: "active", updatedAt: new Date() },
      })
      .returning({ id: enrollments.id });

    if (!enrollment) {
      throw new Error("Failed to provision self-paced enrollment");
    }

    await recordAuditEvent(transaction, {
      actorUserId: userId,
      eventType: "learner.self_paced_access_granted",
      subjectType: "enrollment",
      subjectId: enrollment.id,
      organizationId: defaults.organizationId,
      metadata: { programVersionId: defaults.programVersionId },
    });

    const [account] = await transaction.select({ email: user.email }).from(user).where(eq(user.id, userId)).limit(1);
    if (account) {
      const pendingInvitations = await transaction
        .select({ invitationId: cohortInvitations.id, cohortId: cohorts.id, capacity: cohorts.capacity, programVersionId: cohorts.programVersionId })
        .from(cohortInvitations)
        .innerJoin(cohorts, eq(cohorts.id, cohortInvitations.cohortId))
        .where(and(
          sql`lower(${cohortInvitations.email}) = ${account.email.toLowerCase()}`,
          eq(cohortInvitations.status, "pending"),
          gt(cohortInvitations.expiresAt, new Date()),
          eq(cohorts.active, true),
        ));
      for (const invitation of pendingInvitations) {
        await transaction.select({ id: cohorts.id }).from(cohorts).where(eq(cohorts.id, invitation.cohortId)).for("update");
        const [membershipCount] = await transaction.select({ value: count() }).from(cohortMemberships).where(and(eq(cohortMemberships.cohortId, invitation.cohortId), eq(cohortMemberships.status, "active")));
        if ((membershipCount?.value ?? 0) >= invitation.capacity) continue;
        const [facilitated] = await transaction.insert(enrollments).values({ userId, programVersionId: invitation.programVersionId, cohortId: invitation.cohortId, mode: "facilitated", status: "active" }).onConflictDoUpdate({ target: [enrollments.userId, enrollments.cohortId], targetWhere: eq(enrollments.mode, "facilitated"), set: { status: "active", updatedAt: new Date() } }).returning({ id: enrollments.id });
        if (!facilitated) continue;
        await transaction.insert(cohortMemberships).values({ cohortId: invitation.cohortId, userId, enrollmentId: facilitated.id, status: "active" }).onConflictDoUpdate({ target: [cohortMemberships.cohortId, cohortMemberships.userId], set: { enrollmentId: facilitated.id, status: "active", updatedAt: new Date() } });
        await transaction.update(cohortInvitations).set({ status: "accepted", acceptedByUserId: userId, acceptedAt: new Date(), updatedAt: new Date() }).where(eq(cohortInvitations.id, invitation.invitationId));
        await recordAuditEvent(transaction, { actorUserId: userId, organizationId: defaults.organizationId, eventType: "cohort.invitation_accepted", subjectType: "cohort_invitation", subjectId: invitation.invitationId, metadata: { cohortId: invitation.cohortId } });
      }
    }

    return { ...defaults, enrollmentId: enrollment.id };
  });
}
