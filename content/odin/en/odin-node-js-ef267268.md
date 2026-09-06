# API basics and CORS

## One backend for multiple clients

An API lets websites, mobile applications and other clients share business logic. Servers often return JSON rather than complete views. Separating interfaces requires a clear contract and explicit origin handling.

REST means Representational State Transfer. Organize resources and use HTTP methods to express operations. JSON alone does not make an API RESTful; contracts, statuses, absence of implicit client context and appropriate caching matter too.

## Resources and methods

| Method | Resource | Operation |
| --- | --- | --- |
| GET | /api/posts | Read collection |
| POST | /api/posts | Create |
| GET | /api/posts/42 | Read one |
| PUT | /api/posts/42 | Replace |
| PATCH | /api/posts/42 | Partial update |
| DELETE | /api/posts/42 | Delete |
| GET | /api/posts/42/comments | Read comments |

Use resource nouns rather than `getAllPostComments`. Add a comment ID for detail and verify it belongs to the URL's post; finding that comment alone is insufficient.

## Same origin and CORS

An origin combines scheme, host and port. The same-origin policy restricts JavaScript reading responses from another origin. CORS declares permitted response-reading origins. It does not stop curl requests or replace permissions.

Some requests require OPTIONS preflight. Declare accepted methods and headers. Cookie credentials require explicit credential configuration and a concrete origin rather than `*`.

```ts
// app/api/posts/route.ts — isolated public read fixture
const posts = [{ id: 1, title: "Primera publicación" }];
const allowed = new Set(["http://localhost:3001"]);

function cors(origin: string | null) {
  const headers = new Headers({ Vary: "Origin" });
  if (origin && allowed.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  return headers;
}
export async function GET(request: Request) {
  return Response.json(posts, { headers: cors(request.headers.get("origin")) });
}
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: cors(request.headers.get("origin")),
  });
}
```

This is a fictional public-read CORS fixture, not an authenticated API. Missing CORS headers for rejected origins prevent browsers reading responses; servers must still authorize private data.

## Assignment

1. Read [REST API design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design) and [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).
2. Implement the fixture and a separate-port client using fetch.
3. Test allowed, disallowed and absent Origin headers with curl. Explain browser policy versus authorization.
4. Add persistent message collection/detail operations with validation and appropriate HTTP statuses.
5. Test POST followed by GET to verify creation.
6. Read [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route). The [original Express REST tutorial](https://www.robinwieruch.de/node-express-server-rest-api/) remains an organizational comparison.

## Knowledge check

- What does REST stand for?
- How do methods map to CRUD?
- What defines an origin?
- What does CORS do and not do?
- How do you apply common or endpoint-specific policy?
- What do Allow-Origin, Allow-Methods and Allow-Headers mean?
- Why does an allowlisted API still require permissions?

Comparisons: [Express CORS](https://expressjs.com/en/resources/middleware/cors.html) and a [simple REST definition](https://simple.wikipedia.org/wiki/Representational_state_transfer).

## Inspect preflight

From the allowed client port, send a request carrying Authorization. The browser may issue OPTIONS first. Inspect both Network entries and explain why successful preflight does not authorize writes: it only announces cross-origin policy.

Change the client port; localhost with a different port is a different origin and is no longer allowed. Compare curl without Origin: the public endpoint still responds. This demonstrates why origin allowlists are not authentication.

When adding POST, update allowed methods only where needed and retain validation, sessions and permissions in the handler. If endpoint policies differ, pass explicit policy into a shared helper rather than globally permitting every origin.
