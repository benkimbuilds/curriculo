import { eq } from "drizzle-orm";

import { db, pool } from "@/db";
import {
  featureFlags,
  organizations,
  programs,
  programVersions,
  roleAssignments,
  user,
} from "@/db/schema";
import { getEnvironment } from "@/shared/env";
import { logger } from "@/shared/logger";

async function main() {
  const environment = getEnvironment();
  await db.transaction(async (transaction) => {
    const [organization] = await transaction
      .insert(organizations)
      .values({ slug: environment.DEFAULT_ORGANIZATION_SLUG, name: "AI Builders México" })
      .onConflictDoUpdate({
        target: organizations.slug,
        set: { name: "AI Builders México", updatedAt: new Date() },
      })
      .returning({ id: organizations.id });
    if (!organization) throw new Error("Could not seed organization");

    const [program] = await transaction
      .insert(programs)
      .values({
        organizationId: organization.id,
        slug: environment.DEFAULT_PROGRAM_SLUG,
        name: "Desarrollo web de cero a producción",
      })
      .onConflictDoUpdate({
        target: [programs.organizationId, programs.slug],
        set: { name: "Desarrollo web de cero a producción", updatedAt: new Date() },
      })
      .returning({ id: programs.id });
    if (!program) throw new Error("Could not seed program");

    await transaction
      .insert(programVersions)
      .values({ programId: program.id, version: "2026.1", isDefault: true, publishedAt: new Date() })
      .onConflictDoUpdate({
        target: [programVersions.programId, programVersions.version],
        set: { isDefault: true, publishedAt: new Date(), updatedAt: new Date() },
      });

    await transaction
      .insert(featureFlags)
      .values({
        key: "social_features",
        enabled: environment.SOCIAL_FEATURES_ENABLED,
        description: "Verified-user gallery and structured peer feedback",
      })
      .onConflictDoUpdate({
        target: featureFlags.key,
        set: { enabled: environment.SOCIAL_FEATURES_ENABLED, updatedAt: new Date() },
      });

    if (environment.BOOTSTRAP_DEVELOPER_ADMIN_EMAIL) {
      const [administrator] = await transaction
        .select({ id: user.id, verified: user.emailVerified })
        .from(user)
        .where(eq(user.email, environment.BOOTSTRAP_DEVELOPER_ADMIN_EMAIL.toLowerCase()))
        .limit(1);
      if (!administrator?.verified) {
        throw new Error("Bootstrap developer administrator must already be a verified account");
      }
      await transaction
        .insert(roleAssignments)
        .values({
          userId: administrator.id,
          organizationId: organization.id,
          role: "developer_administrator",
          grantedByUserId: administrator.id,
        })
        .onConflictDoNothing();
    }
  });
  logger.info("Seed data is ready");
}

main()
  .catch((error: unknown) => {
    logger.error({ err: error }, "Database seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
