# Testing database operations

## What to test

pg and ORMs already test their own behavior. Your responsibility is your queries, relationships, permissions and rules. You do not need to re-prove generic PostgreSQL insertion, but you must prove ownership filters and atomic rollback.

Extract pure calculations and transformations for database-free tests. Test complex SQL and relationships against real PostgreSQL: a mock returning the desired result cannot prove SQL correctness.

## Dedicated test database

Create a separate database named with `test_` and a distinct URL. Never fall back to production when configuration is absent. Fail early:

```ts
import { Pool } from "pg";

const raw = process.env.TEST_DATABASE_URL;
if (!raw) throw new Error("A dedicated TEST_DATABASE_URL is required");
const url = new URL(raw);
const name = decodeURIComponent(url.pathname.slice(1));
if (!name.startsWith("test_") || raw === process.env.DATABASE_URL) {
  throw new Error("Refusing non-test database");
}
export const testPool = new Pool({ connectionString: raw, max: 1 });
```

A prefix alone does not establish disposability. Use dedicated credentials/networking and verify the destination before destructive cleanup.

Load environment before importing modules that create connections. Node can use `process.loadEnvFile()`; Jest and other runners may do so in setup. `NODE_ENV=test` selects configuration but does not replace URL validation.

## Migrations and isolation

1. Create a test database or disposable container.
2. Apply the same versioned migrations.
3. Seed minimal deterministic fixtures.
4. Run the case and inspect results.
5. Clean up or roll back before the next case.
6. Close pools and clients afterward.

Respect foreign keys when cleaning multiple tables: delete dependents first or roll back a controlled transaction. Every query in a transaction must use one connection.

A test's open transaction does not wrap requests to a server using a different pool. For HTTP integration, clean fixtures by ID or isolate schemas/databases per process.

Do not run files that clean the same database concurrently. Serialize them or provide real worker isolation. The original Jest option is `--runInBand`; other runners have different settings.

## Assignment

1. Inspect [node-postgres tests](https://github.com/brianc/node-postgres/tree/master/packages/pg/test) to distinguish library and application coverage.
2. Create two users with separate projects and prove A's query excludes B's projects.
3. Exercise a unique constraint and confirm duplicates cannot create two rows.
4. Fail the second write in a transaction and verify the first rolls back.
5. Run cases individually or in another order; results must remain independent.
6. Start without `TEST_DATABASE_URL`: fail before any query.
7. Document database creation, migration, seed, execution and cleanup.

## Knowledge check

- When does a data-operation unit test add value?
- When is real integration necessary?
- How do you configure and verify the test database?
- Why can parallel cleanup break other tests?
- Why can't one client's rollback revert another's work?
- What evidence establishes transaction atomicity?

