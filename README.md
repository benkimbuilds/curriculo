# Ruta

Ruta is a free, open-source learning platform and 12-week curriculum for people
in Mexico learning full-stack web development from zero. The learner experience
is written in Mexican Spanish; authorized curriculum administrators can audit
the English source edition.

The curriculum adapts the project-based approach and learning sequence of
[The Odin Project](https://www.theodinproject.com/paths/full-stack-javascript),
replaces Ruby/Rails and Express-centric application work with Next.js and
PostgreSQL, and introduces responsible AI application development in the final
month.

## Included

- Public email/password registration, required email verification, password
  recovery, revocable database sessions, and automatic self-paced enrollment.
- Twelve bilingual weeks, 96 localized lesson entries, 12 milestone projects,
  weighted rubrics, content provenance, and locale-parity validation.
- Student progress, immutable project attempts, cohort management, role-based
  administration, progress/intervention views, and audit events.
- A verified-user project gallery and structured peer feedback model. Social
  features default off in production until the all-ages safeguarding policy is
  approved.
- A deterministic Week 1 deployment evaluator with SSRF protection and
  fail-to-human-review behavior. Student code is never executed by the web or
  worker process.
- Railway-ready web and worker services, PostgreSQL migrations, an SMTP outbox,
  health endpoints, and local PostgreSQL/Mailpit development.

## Local development

Requirements: Node.js 22, pnpm 10, and Docker Desktop (or a local PostgreSQL
server).

```bash
cp .env.example .env.local
docker compose up -d postgres mailpit
pnpm install --frozen-lockfile
pnpm db:bootstrap
pnpm dev
```

Open the app at [http://localhost:3000](http://localhost:3000) and Mailpit at
[http://localhost:8025](http://localhost:8025). Verification and password-reset
messages are captured by Mailpit locally.

Run the mail worker in another terminal:

```bash
pnpm worker
```

## Verification

```bash
pnpm content:validate
pnpm content:manifest:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Database-backed integration tests run when `TEST_DATABASE_URL` points to a
disposable PostgreSQL database.

## Curriculum authoring

Curriculum files live in `content/programs/web-development/v1`. Each week must
have paired `en` and `es-MX` documents with stable IDs, project and rubric
versions, attribution, provenance, review status, and safe HTTPS resources.

After editing content:

```bash
pnpm content:validate
pnpm content:manifest
pnpm content:manifest:check
```

English content is an audit/source edition. The published learner edition is
Mexican Spanish.

## Deployment

`railway.toml` configures the web service and `railway.worker.toml` configures
the outbox worker. Both use the same Docker image. Add Railway PostgreSQL and
set every variable from `.env.example` with production values before deploying.

Production activation still requires:

- a unique `BETTER_AUTH_SECRET` and final trusted origins;
- a transactional SMTP provider plus SPF, DKIM, and DMARC;
- live migration, health, backup, restore, and rollback verification;
- an approved safeguarding/consent policy before enabling social features for
  an all-ages audience;
- a dedicated sandbox before any future evaluator executes student code.

## Licensing

Application code is MIT-licensed; see `LICENSE`. Educational content is
licensed separately under CC BY-NC-SA 4.0; see `LICENSE-CONTENT.md` and the
curriculum attribution metadata. Third-party links retain their original
licenses.
