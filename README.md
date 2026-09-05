# Ruta

Ruta is a free, open-source learning platform and 12-week curriculum for people
learning full-stack web development from zero. The learner experience is written
in Spanish; authorized curriculum administrators can switch
to the English audit edition.

The curriculum adapts the project-based approach and learning sequence of
[The Odin Project](https://www.theodinproject.com/paths/full-stack-javascript).
It replaces Ruby/Rails and Express-centric application work with React, Next.js,
and PostgreSQL, then introduces responsible AI application development in the
final month.

- Production: [web-production-9d421.up.railway.app](https://web-production-9d421.up.railway.app)
- Source: [github.com/benkimbuilds/curriculo](https://github.com/benkimbuilds/curriculo)
- Hosting: Railway project `ruta-curriculo`, production environment

## What is included

- Public email/password registration, required email verification, password
  recovery, revocable database sessions, and automatic self-paced enrollment.
- Twelve bilingual weeks, 96 localized lessons, 12 milestone projects, weighted
  rubrics, content provenance, and locale-parity validation.
- Student progress, immutable project attempts, cohort management, role-based
  administration, intervention views, and audit events.
- A verified-user project gallery and structured peer feedback model. Social
  features remain disabled until the all-ages safeguarding policy is approved.
- A deterministic Week 1 deployment evaluator with SSRF protection and
  fail-to-human-review behavior. Student code is never executed by the web or
  worker process.
- Managed PostgreSQL, transactional email, database migrations, health checks,
  continuous integration, and automatic Railway deployments from `main`.

## Architecture

### Visual system

Ruta shares the design language of AI Builders LATAM: Instrument Serif headings,
Geist body text, Geist Mono labels, white surfaces, charcoal actions, subtle gray
borders, and rounded navigation and cards. `src/app/aibuilders-theme.css` adapts
the styles from the local `website-lat` project across public, learner, and staff
screens. `src/app/globals.css` retains structural layouts and responsive behavior.
Fonts are self-hosted in `public/fonts`, alongside their SIL Open Font licenses.

### Runtime

Ruta is a modular Next.js application with one codebase and two application
processes. Both processes use the same production Docker image and database.

| Component | Railway service | Responsibility | Public traffic |
| --- | --- | --- | --- |
| Next.js web | `web` | Pages, Better Auth endpoints, staff tools, curriculum, progress, submissions, and health checks | Yes |
| Background process | `evaluator-worker` | Transactional email outbox and queued project evaluations | No |
| PostgreSQL 18 | `Postgres` | Accounts, sessions, curriculum state, progress, submissions, evaluation runs, roles, cohorts, and audit records | No |

The main runtime flow is:

1. A browser sends an authenticated request to the Next.js service.
2. The web service validates authorization and writes transactional state to
   PostgreSQL.
3. Email and evaluation work is recorded in database-backed queues.
4. The worker claims queued rows with PostgreSQL locking, processes them, and
   writes the result back to the database.

There is no separate Redis or message-broker dependency. Queue claims use
`FOR UPDATE SKIP LOCKED`, and stale processing locks can be reclaimed.

### Application boundaries

- `src/app` contains routes, pages, server actions, and health endpoints.
- `src/modules` contains domain logic for authentication, authorization,
  curriculum, cohorts, projects, evaluation, community, staff, and mail.
- `src/worker` contains the long-running mail and evaluation loop.
- `src/db/schema.ts` is the Drizzle schema; `drizzle/` contains committed SQL
  migrations.
- `content/weeks/{es-MX,en}` contains the authored curriculum.
- `src/generated/content-manifest.ts` is generated from the curriculum source.
- `tests/e2e` contains the browser-level registration and learning flow.

## Production deployment

Railway deploys both application services automatically when `main` changes.
The `web` service uses `railway.toml`; `evaluator-worker` uses
`railway.worker.toml`. Railway service settings also keep explicit start
commands so the two services cannot be confused.

Each service runs idempotent migrations before starting:

```text
web:              pnpm db:migrate -> pnpm start
evaluator-worker: pnpm db:migrate -> pnpm worker
```

The production topology currently uses:

- a Railway-provided HTTPS domain;
- Railway managed PostgreSQL with a persistent volume;
- Resend SMTP on the worker for verification and recovery email;
- a unique Better Auth secret stored only in Railway;
- GitHub-connected builds from `benkimbuilds/curriculo`, branch `main`;
- `SOCIAL_FEATURES_ENABLED=false`.

Do not commit production credentials. Railway holds the database URL, auth
secret, and SMTP password as service variables.

### Environment variables

Use `.env.example` as the canonical inventory. Production values are divided by
service as follows:

| Variable | Web | Worker | Notes |
| --- | :---: | :---: | --- |
| `DATABASE_URL` | Yes | Yes | Railway reference to `Postgres.DATABASE_URL` |
| `BETTER_AUTH_URL` | Yes | No | Exact public HTTPS origin |
| `BETTER_AUTH_SECRET` | Yes | Yes | Unique secret; worker needs it because runtime configuration is shared |
| `TRUSTED_ORIGINS` | Yes | No | Comma-separated approved browser origins |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | No | Yes | Production email transport |
| `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | No | Yes | Credentials and verified sender identity |
| `DEFAULT_ORGANIZATION_SLUG` | Yes | Yes | Defaults to `aibuilders-mexico` |
| `DEFAULT_PROGRAM_SLUG` | Yes | Yes | Defaults to `odin-full-stack-mx` |
| `BOOTSTRAP_DEVELOPER_ADMIN_EMAIL` | Yes | No | Optional verified account to grant during `db:seed` |
| `SOCIAL_FEATURES_ENABLED` | Yes | Yes | Keep `false` until safeguarding approval |
| `LOG_LEVEL` | Yes | Yes | Structured Pino log threshold |
| `WORKER_POLL_INTERVAL_MS` | No | Yes | Idle polling interval for queued work |

### Health and readiness

- `GET /api/health` confirms the Next.js process is responding.
- `GET /api/ready` runs `select 1` and returns `503` if PostgreSQL is not
  reachable.
- Railway uses `/api/ready` as the web deployment health check.
- Worker readiness is verified from the `Background worker started` log entry
  and the absence of restart-loop errors.

### Initial seed and administrator bootstrap

Run the seed after the first migration:

```bash
railway ssh --project <project-id> --service web --environment production pnpm db:seed
```

The seed is idempotent and creates or updates the organization, default program,
program version, and feature flag. If `BOOTSTRAP_DEVELOPER_ADMIN_EMAIL` does not
yet identify a verified account, the platform data is still seeded and the
administrator grant is deferred. After that person registers and verifies their
email, run `pnpm db:seed` again to apply the role.

### Release verification

After a production push, verify the source and runtime independently:

```bash
git rev-parse HEAD
git rev-parse '@{u}'
git ls-remote origin refs/heads/main

railway service status --service web --environment production --json
railway service status --service evaluator-worker --environment production --json

curl -fsS https://web-production-9d421.up.railway.app/api/health
curl -fsS https://web-production-9d421.up.railway.app/api/ready
```

The three Git SHAs should match. Both application services should report
`SUCCESS`, and both HTTP probes should return `200`.

## Local development

Requirements: Node.js 22, pnpm 10, and Docker Desktop or another Docker
runtime. Windows contributors can use Docker Desktop with PowerShell, Git Bash,
or WSL; macOS contributors can use Docker Desktop from their usual terminal.

```bash
cp .env.example .env.local
docker compose up -d postgres mailpit
pnpm install --frozen-lockfile
pnpm db:bootstrap
pnpm dev
```

Open the app at [localhost:3000](http://localhost:3000) and Mailpit at
[localhost:8025](http://localhost:8025). Mailpit captures verification and
password-reset messages locally instead of sending real email.

Run the background process in another terminal:

```bash
pnpm worker
```

## Database changes

Update `src/db/schema.ts`, generate a migration, inspect the SQL, and validate it
against a disposable PostgreSQL database:

```bash
pnpm db:generate
pnpm db:migrate
pnpm test
```

Never edit an already-applied migration. Add a new migration instead. Application
startup applies pending migrations before accepting web traffic or starting the
worker loop.

## Curriculum authoring

Curriculum files live in `content/weeks/es-MX` and `content/weeks/en`. Each week
must preserve stable IDs, project and rubric versions, attribution, provenance,
review status, and safe HTTPS resources across both locales.

After editing curriculum content:

```bash
pnpm content:validate
pnpm content:manifest
pnpm content:manifest:check
```

Spanish is the published learner edition. English is the audit/source
edition available to authorized curriculum administrators.

## Testing and CI

Run the standard local release gate with:

```bash
pnpm check
```

This validates curriculum structure and generated content, runs ESLint,
TypeScript, unit tests, and a production Next.js build. Database integration
tests additionally run when `TEST_DATABASE_URL` points to a disposable
PostgreSQL database.

GitHub Actions expands this with PostgreSQL and Mailpit services, database
migrations and seeding, enabled-community isolation tests, Playwright browser
flows, a production burst smoke test, and a Docker build/migration smoke test.

## Security and operating constraints

- Social/community features stay off until the all-ages safeguarding and
  moderation policy is approved.
- The evaluator fetches bounded public HTTP content and does not execute student
  repositories. Any future code execution requires a dedicated sandbox.
- `/api/ready` must not be replaced with a process-only check; database
  connectivity is part of deployment readiness.
- Production verification and password-recovery mail must use a verified sender.
- Review `SECURITY.md` before changing authentication, authorization, evaluator
  networking, moderation, or secret handling.

## Licensing

Application code is MIT-licensed; see `LICENSE`. Educational content is licensed
separately under CC BY-NC-SA 4.0; see `LICENSE-CONTENT.md` and the curriculum
attribution metadata. Third-party links retain their original licenses.
