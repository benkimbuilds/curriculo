import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "@/db";
import {
  cohortMemberships,
  cohorts,
  cohortStaffAssignments,
  enrollments,
  lessonProgress,
  organizations,
  programVersions,
  programs,
  roleAssignments,
  user,
} from "@/db/schema";

import { addInterventionNote, getCohortDashboard, getStudentTimeline } from "./db-staff";

const integrationTest = process.env.TEST_DATABASE_URL ? it : it.skip;

describe("database-backed staff operations", () => {
  integrationTest("enforces staff cohort scope and records a learner intervention", async () => {
    const [organization] = await db.select().from(organizations).limit(1);
    const [program] = organization
      ? await db.select().from(programs).where(eq(programs.organizationId, organization.id)).limit(1)
      : [];
    const [version] = program
      ? await db.select().from(programVersions).where(eq(programVersions.programId, program.id)).limit(1)
      : [];
    if (!organization || !version) throw new Error("Seeded program is required");
    const [staff, learner] = await db.insert(user).values([
      { name: "Facilitator", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
      { name: "Learner", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
    ]).returning();
    if (!staff || !learner) throw new Error("Users were not created");
    await db.insert(roleAssignments).values([
      { userId: staff.id, organizationId: organization.id, role: "instructor" },
      { userId: learner.id, organizationId: organization.id, role: "student" },
    ]);
    const [assigned, other] = await db.insert(cohorts).values([
      { organizationId: organization.id, programVersionId: version.id, slug: `staff-a-${crypto.randomUUID()}`, name: "Assigned", startsAt: new Date("2026-01-01"), endsAt: new Date("2026-12-01") },
      { organizationId: organization.id, programVersionId: version.id, slug: `staff-b-${crypto.randomUUID()}`, name: "Other", startsAt: new Date("2026-01-01"), endsAt: new Date("2026-12-01") },
    ]).returning();
    if (!assigned || !other) throw new Error("Cohorts were not created");
    await db.insert(cohortStaffAssignments).values({ cohortId: assigned.id, userId: staff.id, role: "instructor" });
    const [enrollment] = await db.insert(enrollments).values({ userId: learner.id, programVersionId: version.id, cohortId: assigned.id, mode: "facilitated" }).returning();
    if (!enrollment) throw new Error("Enrollment was not created");
    await db.insert(cohortMemberships).values({ cohortId: assigned.id, userId: learner.id, enrollmentId: enrollment.id });
    await db.insert(lessonProgress).values({ enrollmentId: enrollment.id, lessonId: "week-01-lesson-01", contentVersion: "2026.1", state: "completed", completedAt: new Date() });

    const dashboard = await getCohortDashboard(staff.id, assigned.id);
    expect(dashboard.roster.rows).toHaveLength(1);
    expect(dashboard.roster.rows[0]).toMatchObject({ userId: learner.id, completedRequiredItems: 1 });
    await expect(getCohortDashboard(staff.id, other.id)).rejects.toMatchObject({ code: "AUTHORIZATION_DENIED" });

    const note = await addInterventionNote(staff.id, { cohortId: assigned.id, learnerId: learner.id, category: "technical_support", note: "Configured Git credentials." });
    const timeline = await getStudentTimeline(staff.id, assigned.id, learner.id);
    expect(timeline.notes).toContainEqual(note);
    expect(timeline.events.some((event) => event.type === "intervention")).toBe(true);
  });
});
