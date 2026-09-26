import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "@/db";
import { mentoringAssignments, enrollments, organizations, programVersions, roleAssignments, user } from "@/db/schema";
import { assignDirectMentor, endDirectMentorAssignment, listUnmentoredSelfPacedStudents } from "./service";

const integrationTest = process.env.TEST_DATABASE_URL ? it : it.skip;

describe("direct mentoring service", () => {
  integrationTest("assigns an instructor to a self-paced student", async () => {
    const [organization] = await db.select().from(organizations).limit(1);
    if (!organization) throw new Error("Seeded organization is required");
    const [administrator, mentor, student] = await db.insert(user).values([
      { name: "Admin mentoría", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
      { name: "Mentor directo", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
      { name: "Estudiante autodidacta", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
    ]).returning();
    if (!administrator || !mentor || !student) throw new Error("Test users were not created");
    await db.insert(roleAssignments).values([
      { userId: administrator.id, organizationId: organization.id, role: "administrator" },
      { userId: mentor.id, organizationId: organization.id, role: "instructor" },
      { userId: student.id, organizationId: organization.id, role: "student" },
    ]);
    const [version] = await db.select({ id: programVersions.id }).from(programVersions).limit(1);
    if (!version) throw new Error("Seeded program version is required");
    await db.insert(enrollments).values({ userId: student.id, programVersionId: version.id, mode: "self_paced", status: "active" });

    const assignment = await assignDirectMentor(organization.id, student.id, mentor.id, administrator.id);
    expect(assignment.studentUserId).toBe(student.id);
    expect(assignment.mentorUserId).toBe(mentor.id);

    const assignments = await db.select().from(mentoringAssignments).where(
      and(eq(mentoringAssignments.studentUserId, student.id), eq(mentoringAssignments.status, "active")),
    );
    expect(assignments).toHaveLength(1);
    expect((await listUnmentoredSelfPacedStudents(organization.id)).some(({ id }) => id === student.id)).toBe(false);
    await endDirectMentorAssignment(organization.id, assignment.id, administrator.id);
    expect((await db.select().from(mentoringAssignments).where(eq(mentoringAssignments.id, assignment.id)))[0]?.status).toBe("ended");
    expect((await listUnmentoredSelfPacedStudents(organization.id)).some(({ id }) => id === student.id)).toBe(true);
  });
});
