# Prisma ORM: schema, client, and migrations

## What an ORM solves

Raw SQL can repeat many variations of selects, filters, sorting, inserts and relationships. Entity-specific functions help, but large projects need consistent models and change management.

An ORM maps language objects to tables, exposes schema in source control and supplies queries and migrations. It has a learning cost and may not express every SQL feature. SQL knowledge remains essential for correctness and performance.

## Prisma's three pieces

The **schema** defines models, types, optional fields and relationships. The generated **client** knows those models and provides CRUD. **Migrate** records structural changes in migration files.

Follow the [official Prisma 7 PostgreSQL quickstart](https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql) using TypeScript. This adaptation does not need the original JavaScript/CommonJS workaround: Next already uses TypeScript. Keep CLI, client and adapter versions compatible.

1. Install the guide's dependencies in your practice project.
2. Initialize PostgreSQL with an explicit generated-client output. Inspect `schema.prisma` and `prisma.config.ts`; current configuration supplies the datasource URL there.
3. Set `DATABASE_URL` outside Git.
4. Define models. This example uses `Author` to avoid confusing practice tables with authentication-library tables:

```prisma
model Author {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  messages Message[]
}
model Message {
  id        Int      @id @default(autoincrement())
  content   String   @db.VarChar(255)
  createdAt DateTime @default(now())
  authorId  Int
  author    Author   @relation(fields: [authorId], references: [id])
}
```

```ts
// lib/prisma.ts
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
```

```ts
// Inside a server-side exercise after author 1 has been created:
await prisma.message.create({ data: { content: "Hola", authorId: 1 } });
const messages = await prisma.message.findMany({
  where: { authorId: 1 },
  select: { id: true, content: true },
  orderBy: { id: "asc" },
});
```

The relation uses `authorId` referencing an author's key; `messages` represents the inverse side. A relation is not arbitrary JSON. Create the author before inserting their message.

## Generate and migrate

Run `npx prisma migrate dev --name init` against development only, then `npx prisma generate`. Generation updates the client, not the database. Production uses reviewed `prisma migrate deploy`, not development migration commands.

Share the client per process and reuse it during reloads as with the earlier pool. Do not construct one per request or disconnect after every web query.

Prisma supports CRUD, filters, sorting, pagination and relations, plus raw SQL when necessary. Parameterize raw queries. An ORM does not authorize users; ownership filters remain required.

## Schema considerations

`autoincrement()` and identity/serial columns are not interchangeable across tools. Inspect generated SQL and constraints rather than assuming support. Data migrations, such as backfilling a new column before making it required, need planning and tests with existing rows.

## Assignment

1. Finish the quickstart and create, read, update and delete fictional data.
2. Add a one-to-many relation and query messages with authors.
3. Add an optional column, generate a migration and confirm rows survive.
4. Explain the SQL corresponding to a filter, sort and pagination.
5. Read [Prisma overview](https://www.prisma.io/docs/orm/v7), [schema](https://www.prisma.io/docs/orm/v7/prisma-schema/overview), [models](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models), [relations](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations), [CRUD](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud) and [raw SQL](https://www.prisma.io/docs/orm/v7/prisma-client/using-raw-sql).
6. Complete [Migrate](https://www.prisma.io/docs/orm/v7/prisma-migrate/getting-started), its [mental model](https://www.prisma.io/docs/orm/v7/prisma-migrate/understanding-prisma-migrate/mental-model) and [data migrations](https://www.prisma.io/docs/guides/data-migration).

## Knowledge check

- Which repetition does an ORM reduce?
- What does each of Prisma's three pieces do?
- How does the client learn your models?
- How do you define a relation?
- What does `findMany` do?
- How do client generation and database migration differ?

Supplement with the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) and [Traversy Media course](https://www.youtube.com/watch?v=CYH04BJzamo), checking version differences.

## Observe generated SQL

Temporarily enable query logging in development and compare findMany with its SQL. Add select to limit columns and where to scope authors. Verify the meaning remains correct. Disable detailed logging before publishing to avoid exposing user data.
