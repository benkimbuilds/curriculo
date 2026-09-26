import { and, eq, inArray } from "drizzle-orm";

import { db, type Database } from "@/db";
import {
  cohortMemberships,
  cohorts,
  enrollments,
  mentoringAssignments,
  roleAssignments,
  user,
} from "@/db/schema";
import { recordAuditEvent } from "@/modules/audit/service";
import { requirePermission, loadAuthorizationContext } from "@/modules/authorization/service";
import { ResourceNotFoundError } from "@/shared/errors";

export type DirectMentorAssignment = typeof mentoringAssignments.$inferSelect;
export type UnmentoredSelfPacedStudent = {
  id: string;
  name: string;
  email: string;
};

async function requireOrganizationUser(
  organizationId: string,
  userId: string,
  role: "student" | "instructor",
  database: Database,
) {
  const [account] = await database
    .select({ id: user.id, name: user.name, email: user.email })
    .from(user)
    .innerJoin(roleAssignments, and(
      eq(roleAssignments.userId, user.id),
      eq(roleAssignments.organizationId, organizationId),
      eq(roleAssignments.role, role),
    ))
    .where(and(eq(user.id, userId), eq(user.isActive, true), eq(user.emailVerified, true)))
    .limit(1);
  if (!account) throw new ResourceNotFoundError(role === "student" ? "Student" : "Mentor");
  return account;
}

export async function assignCohortDirectMentor(
  cohortId: string,
  studentUserId: string,
  mentorUserId: string,
  actorUserId: string,
  database: Database = db,
): Promise<DirectMentorAssignment> {
  const [cohort] = await database.select({ organizationId: cohorts.organizationId }).from(cohorts).where(eq(cohorts.id, cohortId)).limit(1);
  if (!cohort) throw new ResourceNotFoundError("Cohort");
  await requirePermission(actorUserId, cohort.organizationId, "mentoring:manage", database);
  if (studentUserId === mentorUserId) throw new Error("MENTOR_STUDENT_SAME_USER");
  await requireOrganizationUser(cohort.organizationId, studentUserId, "student", database);
  await requireOrganizationUser(cohort.organizationId, mentorUserId, "instructor", database);

  return database.transaction(async (transaction) => {
    const [membership] = await transaction
      .select({ enrollmentId: cohortMemberships.enrollmentId })
      .from(cohortMemberships)
      .where(and(
        eq(cohortMemberships.cohortId, cohortId),
        eq(cohortMemberships.userId, studentUserId),
        eq(cohortMemberships.status, "active"),
      ))
      .limit(1);
    if (!membership) throw new ResourceNotFoundError("Cohort membership");

    const activeAssignments = await transaction.select().from(mentoringAssignments).where(and(
      eq(mentoringAssignments.organizationId, cohort.organizationId),
      eq(mentoringAssignments.cohortId, cohortId),
      eq(mentoringAssignments.studentUserId, studentUserId),
      eq(mentoringAssignments.status, "active"),
    ));
    const current = activeAssignments.find(({ mentorUserId: currentMentor }) => currentMentor === mentorUserId);
    if (current && activeAssignments.length === 1) return current;

    for (const assignment of activeAssignments) {
      await transaction.update(mentoringAssignments).set({ status: "ended", endedAt: new Date(), updatedAt: new Date() }).where(eq(mentoringAssignments.id, assignment.id));
    }
    const [assignment] = await transaction.insert(mentoringAssignments).values({
      organizationId: cohort.organizationId,
      mentorUserId,
      studentUserId,
      cohortId,
      enrollmentId: membership.enrollmentId,
      assignedByUserId: actorUserId,
      status: "active",
    }).returning();
    if (!assignment) throw new Error("MENTOR_ASSIGNMENT_CREATE_FAILED");
    await recordAuditEvent(transaction, {
      actorUserId,
      organizationId: cohort.organizationId,
      eventType: "mentoring.cohort_direct_assigned",
      subjectType: "mentoring_assignment",
      subjectId: assignment.id,
      metadata: { cohortId, studentUserId, mentorUserId, replacedAssignmentIds: activeAssignments.map(({ id }) => id) },
    });
    return assignment;
  });
}

export async function assignDirectMentor(
  organizationId: string,
  studentUserId: string,
  mentorUserId: string,
  actorUserId: string,
  database: Database = db,
): Promise<DirectMentorAssignment> {
  await requirePermission(actorUserId, organizationId, "mentoring:manage", database);
  if (studentUserId === mentorUserId) throw new Error("MENTOR_STUDENT_SAME_USER");
  await requireOrganizationUser(organizationId, studentUserId, "student", database);
  await requireOrganizationUser(organizationId, mentorUserId, "instructor", database);

  return database.transaction(async (transaction) => {
    const [selfPacedEnrollment] = await transaction
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(and(
        eq(enrollments.userId, studentUserId),
        eq(enrollments.mode, "self_paced"),
        eq(enrollments.status, "active"),
      ))
      .limit(1);
    if (!selfPacedEnrollment) throw new Error("SELF_PACED_ENROLLMENT_REQUIRED");

    const [existing] = await transaction
      .select()
      .from(mentoringAssignments)
      .where(and(
        eq(mentoringAssignments.organizationId, organizationId),
        eq(mentoringAssignments.studentUserId, studentUserId),
        eq(mentoringAssignments.mentorUserId, mentorUserId),
        eq(mentoringAssignments.status, "active"),
      ))
      .limit(1);
    if (existing) return existing;

    const [assignment] = await transaction.insert(mentoringAssignments).values({
      organizationId,
      mentorUserId,
      studentUserId,
      enrollmentId: selfPacedEnrollment.id,
      assignedByUserId: actorUserId,
      status: "active",
    }).returning();
    if (!assignment) throw new Error("MENTOR_ASSIGNMENT_CREATE_FAILED");
    await recordAuditEvent(transaction, {
      actorUserId,
      organizationId,
      eventType: "mentoring.direct_assigned",
      subjectType: "mentoring_assignment",
      subjectId: assignment.id,
      metadata: { studentUserId, mentorUserId, enrollmentId: selfPacedEnrollment.id },
    });
    return assignment;
  });
}

export async function endDirectMentorAssignment(
  organizationId: string,
  assignmentId: string,
  actorUserId: string,
  database: Database = db,
): Promise<void> {
  await requirePermission(actorUserId, organizationId, "mentoring:manage", database);
  const [assignment] = await database
    .select()
    .from(mentoringAssignments)
    .where(and(
      eq(mentoringAssignments.id, assignmentId),
      eq(mentoringAssignments.organizationId, organizationId),
      eq(mentoringAssignments.status, "active"),
    ))
    .limit(1);
  if (!assignment) throw new ResourceNotFoundError("Mentoring assignment");
  const actor = await loadAuthorizationContext(actorUserId, organizationId, database);
  const canManageAny = actor.organizationRoles.includes("administrator") || actor.organizationRoles.includes("developer_administrator");
  if (!canManageAny && assignment.mentorUserId !== actorUserId) throw new Error("MENTOR_ASSIGNMENT_NOT_OWNED");

  await database.transaction(async (transaction) => {
    await transaction.update(mentoringAssignments).set({
      status: "ended",
      endedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(mentoringAssignments.id, assignmentId));
    await recordAuditEvent(transaction, {
      actorUserId,
      organizationId,
      eventType: "mentoring.direct_ended",
      subjectType: "mentoring_assignment",
      subjectId: assignmentId,
      metadata: { studentUserId: assignment.studentUserId, mentorUserId: assignment.mentorUserId },
    });
  });
}

export type DirectMentor = {
  id: string;
  name: string;
  email: string;
};

export async function listDirectMentors(
  organizationId: string,
  studentUserId: string,
  database: Database = db,
): Promise<DirectMentor[]> {
  const rows = await database
    .select({ id: user.id, name: user.name, email: user.email })
    .from(mentoringAssignments)
    .innerJoin(user, eq(user.id, mentoringAssignments.mentorUserId))
    .where(and(
      eq(mentoringAssignments.organizationId, organizationId),
      eq(mentoringAssignments.studentUserId, studentUserId),
      eq(mentoringAssignments.status, "active"),
      eq(user.isActive, true),
    ));
  return rows;
}

export type DirectMentorStudent = {
  assignmentId: string;
  id: string;
  name: string;
  email: string;
  cohortId: string | null;
  cohortName: string | null;
  assignedAt: Date;
};

export async function listDirectStudentsForMentor(
  organizationId: string,
  mentorUserId: string,
  database: Database = db,
): Promise<DirectMentorStudent[]> {
  return database
    .select({
      assignmentId: mentoringAssignments.id,
      id: user.id,
      name: user.name,
      email: user.email,
      cohortId: mentoringAssignments.cohortId,
      cohortName: cohorts.name,
      assignedAt: mentoringAssignments.assignedAt,
    })
    .from(mentoringAssignments)
    .innerJoin(user, eq(user.id, mentoringAssignments.studentUserId))
    .leftJoin(cohorts, eq(cohorts.id, mentoringAssignments.cohortId))
    .where(and(
      eq(mentoringAssignments.organizationId, organizationId),
      eq(mentoringAssignments.mentorUserId, mentorUserId),
      eq(mentoringAssignments.status, "active"),
      eq(user.isActive, true),
    ));
}

export async function listUnmentoredSelfPacedStudents(
  organizationId: string,
  database: Database = db,
): Promise<UnmentoredSelfPacedStudent[]> {
  const students = await database
    .select({ id: user.id, name: user.name, email: user.email })
    .from(user)
    .innerJoin(roleAssignments, and(
      eq(roleAssignments.userId, user.id),
      eq(roleAssignments.organizationId, organizationId),
      eq(roleAssignments.role, "student"),
    ))
    .innerJoin(enrollments, and(
      eq(enrollments.userId, user.id),
      eq(enrollments.mode, "self_paced"),
      eq(enrollments.status, "active"),
    ))
    .where(and(eq(user.isActive, true), eq(user.emailVerified, true)));
  if (!students.length) return [];

  const assignments = await database
    .select({ studentUserId: mentoringAssignments.studentUserId })
    .from(mentoringAssignments)
    .where(and(
      eq(mentoringAssignments.organizationId, organizationId),
      eq(mentoringAssignments.status, "active"),
      inArray(mentoringAssignments.studentUserId, students.map(({ id }) => id)),
    ));
  const mentoredStudentIds = new Set(assignments.map(({ studentUserId }) => studentUserId));
  return students.filter(({ id }) => !mentoredStudentIds.has(id));
}
