# Using PostgreSQL from Next.js

## From queries to an application

Build a small username directory: home lists records, `/new` displays a form and a mutation saves a name. Keep SQL in server modules and UI in components. Complete the database course first.

## Create table and data

Create or connect to a practice database in psql using `CREATE DATABASE top_users;` and `\c top_users` with an appropriately privileged role. Inspect using `\l` and `\d`.

```sql
CREATE TABLE usernames (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE
);
INSERT INTO usernames (username) VALUES ('Mao'), ('nevz'), ('Lofty');
SELECT * FROM usernames;
```

`GENERATED ALWAYS AS IDENTITY` generates IDs using a sequence; the form must not supply the next ID. `UNIQUE` rejects duplicate names and `NOT NULL` rejects absent values.

## Connect through pg

Install `pg` and its development types for TypeScript. Set server-side `DATABASE_URL`. Its shape is `postgresql://user:password@host:port/database`; real values never belong in Git.

```ts
// lib/db.ts
import "server-only";
import { Pool } from "pg";

const globalDb = globalThis as unknown as { pool?: Pool };
export const pool = globalDb.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});
if (process.env.NODE_ENV !== "production") globalDb.pool = pool;

// lib/usernames.ts
import "server-only";
import { pool } from "./db";

export async function listUsernames(search = "") {
  const { rows } = await pool.query(
    "SELECT id, username FROM usernames WHERE username ILIKE $1 ORDER BY id",
    ["%" + search + "%"],
  );
  return rows;
}
export async function insertUsername(username: string) {
  const { rows } = await pool.query(
    "INSERT INTO usernames (username) VALUES ($1) RETURNING id",
    [username],
  );
  return rows[0];
}
```

A `Client` is one manually managed connection, useful in scripts. A `Pool` reuses connections for web requests. Do not construct a pool per request. Total connections depend on replica count and PostgreSQL limits, not just this local setting.

The development pattern avoids repeated pools during reloads. For transactions, acquire one client with `pool.connect()`, execute BEGIN/COMMIT or ROLLBACK and release in `finally`. Do not split a transaction across pooled connections.

## Parameterization and integration

`$1` separates data from SQL text. Never concatenate user input into SQL. Quoted names must remain data rather than become commands. Parameters cannot replace column identifiers; allowlist dynamic sort columns.

Call `listUsernames` from the Server Component; validate a string before calling `insertUsername` from the mutation. Refresh the view and redirect afterward. Search `/?search=sup` in SQL rather than fetching all records and filtering in JavaScript.

`%` and `_` retain pattern meanings in ILIKE. Document pattern search or escape them when promising literal matching.

## Seed data

Write a script that opens a Client, runs migrations or fixture inserts and closes it in `finally`. Read configuration from the environment. Unique constraints and `ON CONFLICT DO NOTHING` can make appropriate inserts repeatable. Do not automatically drop tables.

Separate local, test and production. The original suggests passing the URL as a command argument; this version avoids credentials in shell history and process listings. Select the environment explicitly and use its secret injection.

## Assignment

1. Review [node-postgres](https://node-postgres.com/), particularly connections, [parameterized queries](https://node-postgres.com/features/queries) and transactions.
2. Implement listing, form validation, insertion and SQL search.
3. Add confirmed practice-data deletion using POST or a Server Action. This replaces the original destructive GET; GET must not delete.
4. Return to the message board: create its table, migrate fictional fixtures, replace memory storage and integrate queries.
5. Configure a hosted database, run controlled migrations/seeds and verify messages survive restart.
6. Test quotes, duplicates and invalid input without damaging the table.

## Knowledge check

- How do you create a database and table in psql?
- What is pg?
- When should you use Client versus Pool?
- Where do query functions connect to Next?
- How do you rerun seeds without duplicates?
- Why must deletion not use GET?

## Distinguish environments

After deployment, privately inspect current_database() and current_user without printing credentials. Insert distinct fictional local and remote messages and verify each app reads only its own database. If environments accidentally share data, fix configuration before running tests that modify or delete rows.
