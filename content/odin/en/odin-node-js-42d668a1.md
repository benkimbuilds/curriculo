# Deployment and troubleshooting

## Make the application reachable

A host serves or runs your application on Internet-accessible computers. Static sites deliver prepared files; dynamic applications execute code to query data and choose responses. GitHub Pages serves static files but does not run your Node server.

A platform as a service, PaaS, manages infrastructure while you remain responsible for configuration, data and behavior. Railway is the reference because this learning platform uses it. Purchasing a personal plan is not required for local practice; use a cohort-provided environment when available.

## Identify the resources

- **Instance:** a process or container running the application. Multiple instances do not automatically share memory or files.
- **Database:** often a separate service, even within one project. Understand credentials, private networking and backups.
- **Domain:** the public name used to reach the app. A provider-generated domain is sufficient for portfolio work.
- **Configuration:** environment-specific injected variables. An ignored local `.env` does not automatically reach production.

Application and database may use different providers if connectivity and security permit. A database provider does not necessarily execute web applications.

## Deploy the message board

1. Verify `npm run build` and `npm start` locally. Declare a compatible Node version and retain the lockfile.
2. Follow [Next deployment](https://nextjs.org/docs/app/getting-started/deploying) and [Railway documentation](https://docs.railway.com/). Create a web service from the repository or image.
3. Configure reproducible installation, build and start commands. Listen on the host's required interface and port.
4. Add PostgreSQL and supply its connection as `DATABASE_URL`. Keep credentials out of Git and browser code.
5. Run migrations before serving code that depends on them. Do not run destructive seeds on every startup.
6. Generate an HTTPS domain. Update authentication and allowed origins when accounts are present.
7. Test home, message creation and details from a fresh window. Restart and confirm persistence.
8. Record the deployed Git revision, migration result and checks.

A successful build does not establish that a form writes correctly; test the actual journey.

## Diagnose by stage

For **build-time failures**, start at the first useful error: Node version, missing dependency, required environment variable, filename case or command configuration. Linux filenames are case-sensitive even if your workstation behaves differently.

For a **500 after deployment**, observe runtime logs while reproducing one request. Check database connectivity, migrations and variables. Public errors should remain general; do not expose stack traces or credentials.

Requests and queries are not necessarily logged automatically. Add useful sanitized logs. [Sentry](https://sentry.io/) may provide additional diagnostics later; it is not required here.

If an earlier revision worked, compare `git log` and `git diff`. Redeploy a known revision only after checking schema compatibility: code rollback does not reverse data changes.

## Providers and resources

Compare [Railway](https://railway.app/), [Render](https://render.com/docs/), [Neon](https://neon.tech/docs/introduction) and [Aiven](https://aiven.io/docs/get-started). Neon and Aiven provide databases; separately identify where Next will execute. Quotas, free trials, sleep behavior and prices change; verify current terms before activating resources. [free-for.dev](https://free-for.dev/) indexes options.

The original mentions [Porkbun](https://porkbun.com/), [NameSilo](https://www.namesilo.com/) and [Domainr](https://domainr.com/) for custom domains. Buying a domain is optional.

## Knowledge check

- How do static and dynamic sites differ?
- What does PaaS mean and manage?
- What is an instance?
- Where do you investigate build versus runtime errors?
- Why must a restart not erase messages?
- What must you check before restoring an older revision?

