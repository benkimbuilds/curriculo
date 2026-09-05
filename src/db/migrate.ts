import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db, pool } from "@/db";
import { logger } from "@/shared/logger";

async function main() {
  await migrate(db, { migrationsFolder: "drizzle" });
  logger.info("Database migrations completed");
}

main()
  .catch((error: unknown) => {
    logger.error({ err: error }, "Database migration failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
