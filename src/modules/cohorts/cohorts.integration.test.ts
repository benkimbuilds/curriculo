import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "@/db";
import {
  cohortMemberships,
  cohortSchedules,
  announcements,
  cohortInvitations,
  cohorts,
  organizations,
  programVersions,
  programs,
  roleAssignments,
  user,
} from "@/db/schema";
import {
  addLearnerToCohort,
  archiveCohort,
  createCohort,
  inviteLearnerToCohort,
  grantOrganizationRole,
  publishAnnouncement,
  setCohortWeekSchedule,
} from "./service";

const integrationTest = process.env.TEST_DATABASE_URL ? it : it.skip;

describe("cohort service", () => {
  integrationTest("enforces authorization, capacity, and idempotent membership", async () => {
    const [organization] = await db.select().from(organizations).limit(1);
    const [program] = organization
      ? await db.select().from(programs).where(eq(programs.organizationId, organization.id)).limit(1)
      : [];
    const [version] = program
      ? await db.select().from(programVersions).where(eq(programVersions.programId, program.id)).limit(1)
      : [];
    if (!organization || !version) throw new Error("Seeded program is required");

    const [administrator, learnerOne, learnerTwo, ordinaryUser] = await db
      .insert(user)
      .values([
        { name: "Admin", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
        { name: "Uno", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
        { name: "Dos", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
        { name: "Sin permisos", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
      ])
      .returning();
    if (!administrator || !learnerOne || !learnerTwo || !ordinaryUser) {
      throw new Error("Test users were not created");
    }
    await db.insert(roleAssignments).values([
      { userId: administrator.id, organizationId: organization.id, role: "administrator" },
      { userId: learnerOne.id, organizationId: organization.id, role: "student" },
      { userId: learnerTwo.id, organizationId: organization.id, role: "student" },
      { userId: ordinaryUser.id, organizationId: organization.id, role: "student" },
    ]);

    await expect(
      createCohort(
        {
          organizationId: organization.id,
          programVersionId: version.id,
          slug: `forbidden-${crypto.randomUUID()}`,
          name: "Sin permisos",
          startsAt: new Date("2026-09-07T15:00:00Z"),
          endsAt: new Date("2026-11-27T21:00:00Z"),
          timezone: "America/Mexico_City",
          capacity: 1,
        },
        ordinaryUser.id,
      ),
    ).rejects.toMatchObject({ code: "AUTHORIZATION_DENIED" });
    await expect(grantOrganizationRole(
      organization.id,
      ordinaryUser.id,
      "developer_administrator",
      administrator.id,
    )).rejects.toMatchObject({ code: "AUTHORIZATION_DENIED" });

    const cohort = await createCohort(
      {
        organizationId: organization.id,
        programVersionId: version.id,
        slug: `cohort-${crypto.randomUUID()}`,
        name: "Cohorte de prueba",
        startsAt: new Date("2026-09-07T15:00:00Z"),
        endsAt: new Date("2026-11-27T21:00:00Z"),
        timezone: "America/Mexico_City",
        capacity: 1,
      },
      administrator.id,
    );
    const [unverifiedLearner] = await db.insert(user).values({
      name: "Sin verificar",
      email: `${crypto.randomUUID()}@example.test`,
      emailVerified: false,
    }).returning();
    if (!unverifiedLearner) throw new Error("Unverified learner was not created");
    await expect(addLearnerToCohort(
      cohort.id,
      unverifiedLearner.id,
      administrator.id,
    )).rejects.toThrow("LEARNER_EMAIL_NOT_VERIFIED");

    const firstEnrollment = await addLearnerToCohort(
      cohort.id,
      learnerOne.id,
      administrator.id,
    );
    await expect(
      addLearnerToCohort(cohort.id, learnerOne.id, administrator.id),
    ).resolves.toBe(firstEnrollment);
    await expect(
      addLearnerToCohort(cohort.id, learnerTwo.id, administrator.id),
    ).rejects.toThrow("COHORT_CAPACITY_REACHED");

    const memberships = await db
      .select()
      .from(cohortMemberships)
      .where(eq(cohortMemberships.cohortId, cohort.id));
    expect(memberships).toHaveLength(1);

    await setCohortWeekSchedule(cohort.id, "week-01", {
      opensAt: new Date("2026-09-07T15:00:00Z"),
      dueAt: new Date("2026-09-14T15:00:00Z"),
    }, administrator.id);
    await publishAnnouncement(cohort.id, { title: "Bienvenida", body: "Revisa la primera semana." }, administrator.id);
    await inviteLearnerToCohort(cohort.id, `pending-${crypto.randomUUID()}@example.test`, administrator.id);
    expect(await db.select().from(cohortSchedules).where(eq(cohortSchedules.cohortId, cohort.id))).toHaveLength(1);
    expect(await db.select().from(announcements).where(eq(announcements.cohortId, cohort.id))).toHaveLength(1);
    expect(await db.select().from(cohortInvitations).where(eq(cohortInvitations.cohortId, cohort.id))).toHaveLength(1);
    await expect(setCohortWeekSchedule(cohort.id, "week-02", {}, ordinaryUser.id)).rejects.toMatchObject({ code: "AUTHORIZATION_DENIED" });
    await archiveCohort(cohort.id, administrator.id);
    const [archived] = await db.select().from(cohorts).where(eq(cohorts.id, cohort.id));
    expect(archived?.active).toBe(false);
  });
});
