import { pool } from "@/db";
import { getEnvironment } from "@/shared/env";
import { logger } from "@/shared/logger";
import { processOneMail } from "@/worker/mail-worker";
import { processOneEvaluation } from "@/worker/evaluation-worker";

const environment = getEnvironment();
let stopping = false;

process.on("SIGTERM", () => {
  stopping = true;
});
process.on("SIGINT", () => {
  stopping = true;
});

async function main() {
  logger.info("Background worker started");
  while (!stopping) {
    const [mailProcessed, evaluationProcessed] = await Promise.all([
      processOneMail(),
      processOneEvaluation(),
    ]);
    if (!mailProcessed && !evaluationProcessed) {
      await new Promise((resolve) => setTimeout(resolve, environment.WORKER_POLL_INTERVAL_MS));
    }
  }
  await pool.end();
  logger.info("Background worker stopped");
}

main().catch(async (error: unknown) => {
  logger.fatal({ err: error }, "Background worker stopped unexpectedly");
  process.exitCode = 1;
  await pool.end();
});
