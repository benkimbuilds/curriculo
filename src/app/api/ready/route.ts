import { sql } from "drizzle-orm";

import { db } from "@/db";
import { logger } from "@/shared/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json(
      { status: "ready", database: "connected" },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    logger.error({ err: error }, "Readiness check failed");
    return Response.json(
      { status: "not_ready", database: "unavailable" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
