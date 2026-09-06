# Authentication, sessions, and permissions

## Three separate questions

Authentication establishes identity. Sessions retain that state across requests. Authorization decides permitted actions. A cookie's existence proves none of these by itself: the server must validate a live session and enforce permissions.

The original uses Passport, strategies and express-session. This adaptation uses Better Auth with Next while retaining registration, sign-in/out, persistence and password hashing without custom cryptography or plaintext storage.

## Configure the library

1. Read [Better Auth installation](https://better-auth.com/docs/installation), select PostgreSQL and create a practice database.
2. Supply `DATABASE_URL`, `BETTER_AUTH_URL` and a strong random `BETTER_AUTH_SECRET` outside Git. Never reuse a tutorial word as a secret.
3. Configure the library, generate/review its schema and apply migrations with the installed version's CLI. User, account and session tables must exist before testing.
4. Mount its HTTP handler and create the client:

```ts
// lib/auth.ts — follow the provider installation/migration guide first
import "server-only";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
});
```

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { GET, POST } = toNextJsHandler(auth);

// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
```

```ts
// lib/current-user.ts
import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function currentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
```

This is a local starting configuration, not complete production email setup. Reuse one application pool to control connection counts. Before publishing, add email verification, recovery and real delivery according to the [provider guide](https://better-auth.com/docs/authentication/email-password).

## Register and sign in

Build name, email, password and confirmation forms. Validate server-side and report safe errors. The client may call `authClient.signUp.email` and `authClient.signIn.email`. Inspect results before navigating; a settled promise does not imply success.

The library stores hashes and checks credentials. Never log passwords or return them through form state. Do not silently trim passwords as you would names.

In Passport's model, strategies define authentication, while serialization/deserialization connect sessions to users. Better Auth providers handle corresponding responsibilities here. There is no `app.use` order to transfer: the official route receives requests, and session lookup runs wherever identity is needed.

## Cookies and lifetime

Browsers attach cookies according to domain, path and policies. An opaque identifier locates persisted session state. HttpOnly limits JavaScript access; Secure requires HTTPS; SameSite limits some cross-site sending. None replaces authorization.

Test reload and restart: valid sessions should survive according to policy. Test `authClient.signOut()`: revoke the session and reject later requests. Clearing React state does not sign someone out.

When a Server Action calls APIs that set cookies, follow the official `nextCookies` integration. Server Components cannot set cookies during rendering.

## Authorize data operations

Call `currentUser()` at every protected entry point. Reject or redirect if absent, depending on API versus page. Then check ownership:

```sql
UPDATE projects SET title = $1
WHERE id = $2 AND owner_id = $3
RETURNING id;
```

`$3` comes from the verified session, never the form. No matching row should yield a response that does not reveal another person's data. Apply the same policy to reads, downloads, actions and endpoints; hiding buttons is insufficient.

## Password hashing

Password hashes use one-way derivation designed to make guessing expensive. Unique salts ensure identical passwords produce different results and resist precomputed tables. bcrypt's cost is a work factor, not “salt length”. `bcrypt.compare` checks an input against a stored hash; it does not decrypt.

Better Auth owns its algorithm and verification. Do not replace password hashing with fast SHA-256 or compare newly salted hashes using equality. Study bcrypt separately with fictional data rather than altering library credential tables.

## Assignment

1. Build registration, sign-in, conditional welcome and sign-out.
2. Test wrong passwords, nonexistent users and duplicate emails without unnecessary disclosure.
3. Inspect fictional-account tables: no plaintext passwords may exist.
4. Restart, renew and revoke sessions and verify effects.
5. Create two accounts and attempt a cross-owner update directly.
6. Before public deployment, configure verification and recovery using expiring single-use tokens.
7. Read [Next authentication](https://nextjs.org/docs/app/guides/authentication) and the [official integration](https://better-auth.com/docs/integrations/next).

Videos 1, 2, 3, 5 and 6 of the [original session playlist](https://www.youtube.com/playlist?list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK), [Passport: The Hidden Manual](https://github.com/jwalton/passport-api-docs) and [connect-pg-simple](https://www.npmjs.com/package/connect-pg-simple) remain optional strategy/persistence comparisons. Further reading: [password storage risks](https://www.youtube.com/watch?v=8ZtInClXe1Q) and [cryptographic hashes](https://en.wikipedia.org/wiki/Cryptographic_hash_function).

## Knowledge check

- Which identity provider replaces LocalStrategy?
- Why is a cookie needed?
- What does a password compare function verify?
- Why must hashing exist from the first account?
- Why does knowing a project ID not grant access?
- How does sign-out differ from hiding UI?

