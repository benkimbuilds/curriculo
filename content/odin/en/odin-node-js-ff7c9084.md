# Project: Blog API

## One API, two interfaces

Build three logical applications: an API, a public reading/commenting interface and a separate writing/editing/publishing interface. Preserve this separation even in a monorepo. The point is demonstrating multiple clients consuming one HTTP contract.

## Plan and model

Choose separate repositories or independent application directories. Model posts, comments and users with titles, bodies, authors, timestamps and publication state. Decide whether comments require accounts or public names. Drafts exist in storage but must remain inaccessible publicly.

Use Prisma with PostgreSQL. Implement the API through Next Route Handlers; the two interfaces may be independent Next or React applications. Do not replace the entire API with Server Actions: external HTTP consumption is an explicit project objective.

## Build sequence

1. Define REST collection/detail endpoints: `/api/posts`, `/api/posts/[id]`, `/api/posts/[id]/comments` and comment detail. Document methods, inputs, statuses and responses.
2. Implement post/comment CRUD and test with curl or Postman before building the clients.
3. Protect writing, editing, publishing and moderation with server-checked identity and author roles. A reader must not gain editing rights by changing client code.
4. Practice JWT as in the original, using Better Auth's JWT plugin or a maintained provider. Issue tokens after authentication; verify signature, algorithm, issuer, audience and expiry at the API. Decoding alone is insufficient.
5. Use `Authorization: Bearer <token>` between client and API. Avoid persisting credentials in localStorage: keep short-lived tokens in memory or use an interface-side server with an HttpOnly session cookie. Document renewal and JWT revocation limits.
6. Build the public published-post list, details and comments. Filter drafts on the server even when a caller knows the ID.
7. Build the editorial interface: publication-state list, create/edit, publish/unpublish and comment management. A rich text editor such as [TinyMCE](https://www.tiny.cloud/docs/tinymce/6/cloud-quick-start/) is optional; accepted HTML needs allowlist sanitization.
8. Configure CORS for the actual client origins. CORS does not replace authentication.
9. Deploy all components and document URLs, configuration and contract.

## Acceptance criteria

- Two distinct interfaces consume one API.
- Publishing/unpublishing changes actual visibility, including detail endpoints.
- Altered, expired and wrong-audience tokens fail.
- Authenticated readers cannot edit or publish.
- Comments can be created and moderated under documented rules.
- Invalid forms cannot produce partial writes.
- Sign-out removes session access; document how long already-issued JWTs may remain valid.
- HTTP tests cover applicable 200/201, 400, 401/403 and 404 outcomes.
- README explains independent startup of API and clients.

## Resources

Read [Better Auth JWT](https://better-auth.com/docs/plugins/jwt), [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route) and the earlier API consumption lesson. [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) and [Passport JWT](https://github.com/mikenicholson/passport-jwt) remain original references; Passport is not required here.

