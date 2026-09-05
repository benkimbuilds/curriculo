import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { getEnvironment } from "@/shared/env";

import * as schema from "./schema";

const globalDatabase = globalThis as typeof globalThis & {
  curriculoPool?: Pool;
};

export const pool =
  globalDatabase.curriculoPool ??
  new Pool({
    connectionString: getEnvironment().DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: process.env.NODE_ENV === "test",
  });

if (process.env.NODE_ENV !== "production") {
  globalDatabase.curriculoPool = pool;
}

export const db = drizzle({ client: pool, schema, casing: "snake_case" });
export type Database = typeof db;
