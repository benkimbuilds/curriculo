import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "@/db";
import {
  cohortMemberships,
  cohorts,
  enrollments,
  featureFlags,
  organizations,
  profiles,
  programVersions,
  programs,
  roleAssignments,
  submissions,
  user,
} from "@/db/schema";

import { getGalleryProjectForViewer, listGalleryForViewer } from "./db-community";

const integrationTest =
  process.env.TEST_DATABASE_URL && process.env.SOCIAL_FEATURES_ENABLED === "true"
    ? it
    : it.skip;

describe("database-backed gallery authorization", () => {
  integrationTest("shows a facilitated project only inside its verified cohort", async () => {
    const [organization] = await db.select().from(organizations).limit(1);
    const [program] = organization
      ? await db.select().from(programs).where(eq(programs.organizationId, organization.id)).limit(1)
      : [];
    const [version] = program
      ? await db.select().from(programVersions).where(eq(programVersions.programId, program.id)).limit(1)
      : [];
    if (!organization || !version) throw new Error("Seeded program is required");
    await db.insert(featureFlags).values({ key: "social_features", enabled: true }).onConflictDoUpdate({ target: featureFlags.key, set: { enabled: true } });
    const [owner, peer, outsider] = await db.insert(user).values([
      { name: "Owner", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
      { name: "Peer", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
      { name: "Outsider", email: `${crypto.randomUUID()}@example.test`, emailVerified: true },
    ]).returning();
    if (!owner || !peer || !outsider) throw new Error("Users were not created");
    await db.insert(roleAssignments).values([owner, peer, outsider].map((account) => ({ userId: account.id, organizationId: organization.id, role: "student" as const })));
    await db.insert(profiles).values({ userId: owner.id, chosenName: "Owner", isMinor: false, profileVisible: true });
    const [cohortA, cohortB] = await db.insert(cohorts).values([
      { organizationId: organization.id, programVersionId: version.id, slug: `a-${crypto.randomUUID()}`, name: "A", startsAt: new Date("2026-01-01"), endsAt: new Date("2026-12-01") },
      { organizationId: organization.id, programVersionId: version.id, slug: `b-${crypto.randomUUID()}`, name: "B", startsAt: new Date("2026-01-01"), endsAt: new Date("2026-12-01") },
    ]).returning();
    if (!cohortA || !cohortB) throw new Error("Cohorts were not created");
    const enrollmentRows = await db.insert(enrollments).values([
      { userId: owner.id, programVersionId: version.id, cohortId: cohortA.id, mode: "facilitated" },
      { userId: peer.id, programVersionId: version.id, cohortId: cohortA.id, mode: "facilitated" },
      { userId: outsider.id, programVersionId: version.id, cohortId: cohortB.id, mode: "facilitated" },
    ]).returning();
    await db.insert(cohortMemberships).values(enrollmentRows.map((enrollment) => ({ cohortId: enrollment.cohortId!, userId: enrollment.userId, enrollmentId: enrollment.id })));
    const [submission] = await db.insert(submissions).values({ enrollmentId: enrollmentRows[0].id, projectId: "week-01-project", projectVersion: "2026.1", attempt: 1, status: "passed", repositoryUrl: "https://github.com/example/project", deploymentUrl: "https://example.com", commitSha: "a".repeat(40), snapshot: { rubricVersion: "1" } }).returning();
    if (!submission) throw new Error("Submission was not created");

    await expect(listGalleryForViewer(peer.id)).resolves.toMatchObject({ entries: [{ id: submission.id }] });
    await expect(listGalleryForViewer(outsider.id)).resolves.toMatchObject({ entries: [] });
    await expect(getGalleryProjectForViewer(outsider.id, submission.id)).rejects.toMatchObject({ code: "AUTHORIZATION_DENIED" });
  });
});
