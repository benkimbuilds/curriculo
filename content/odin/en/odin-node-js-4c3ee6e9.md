# Controllers, responses, and errors

## Separate responsibilities

A controller coordinates: interpret the request, apply validation and permissions, call the model, and prepare a response. The model handles data; the view presents it. MVC describes responsibilities rather than a mandatory directory tree.

In Next, Route Handlers can act as HTTP controllers. Server Components prepare views; Server Actions handle UI mutations. Extract shared business rules into server modules so entry points do not duplicate them.

## Finish responses correctly

`Response.json(data, { status })` produces JSON. `new Response(text, { status, headers })` controls text and headers. Return JSX for pages. `redirect` from `next/navigation` redirects through control flow; call it outside a catch block intended for database failures.

A status alone does not finish your function: return the response. Use 404 for absence, 400 for invalid input and 500 for unexpected failure. Never expose internal error objects or credentials.

```ts
// lib/authors.ts — read-only teaching fixture
const authors = [
  { id: 1, name: "Bryan" },
  { id: 2, name: "Christian" },
  { id: 3, name: "Jason" },
];
export async function findAuthor(id: number) {
  return authors.find(author => author.id === id) ?? null;
}
```

```ts
// app/api/authors/[authorId]/route.ts
import { findAuthor } from "@/lib/authors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ authorId: string }> }
) {
  const { authorId } = await params;
  if (!/^[1-9]\d*$/.test(authorId)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  const id = Number(authorId);
  if (!Number.isSafeInteger(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const author = await findAuthor(id);
    if (!author) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ id: author.id, name: author.name });
  } catch {
    console.error("author_lookup_failed");
    return Response.json({ error: "Service unavailable" }, { status: 500 });
  }
}
```

The read-only fixture isolates the concept; it is not durable storage. The handler awaits parameters, validates syntax and range, queries, distinguishes absence and returns a public projection. Its catch translates unexpected failure into a safe response. A real application should log an error identifier and sanitized server-side details.

## Middleware versus controller

Express chains functions receiving request, response and `next`, at application or router level. Next does not require this chain: function-call order expresses the flow, such as verify session, validate input, check ownership and update.

In Express, `next()` continues, `next(error)` finds an error handler, while `next("route")` and `next("router")` skip parts of the chain. Four parameters identify its error-handler signature. Do not copy these signatures into Next: functions return or throw, and callers decide how to handle the result.

Parsing also changes: use `request.json()` or `request.formData()`; static files belong in `public`. A shared authentication guard is an ordinary function invoked by every sensitive operation. A navigation proxy cannot replace those checks.

## Expected and unexpected failures

An absent author is expected and can be represented by `null`. Invalid forms return field errors. A database outage is unexpected. Pages use `notFound()` for missing resources and `error.tsx` boundaries for uncaught exceptions.

A domain error such as `class ConflictError extends Error` can distinguish conflicts used by several operations. Translate it to HTTP at the boundary. Do not map every exception to 404, hiding operational failures, or indiscriminately catch `redirect()` and `notFound()`, which use internal control-flow exceptions.

## Assignment

1. Implement the example; test `1`, `999`, `abc` and an out-of-range integer.
2. Add a book model and handlers, retaining separate responsibilities.
3. Force a query failure in development. Verify 500, a safe public message and useful logs.
4. Add an author page using the same data module and `notFound()`.
5. Read [Next error handling](https://nextjs.org/docs/app/getting-started/error-handling) and watch the [MVC overview](https://www.youtube.com/watch?v=Cgvopu9zg8Y).
6. Optionally compare [Express middleware](https://expressjs.com/en/guide/using-middleware.html) and [Express Middlewares, Demystified](https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1). Its statement about promises predates Express 5.

## Knowledge check

- When would you return JSON, text, JSX or a redirect?
- How do middleware and controllers differ?
- How do you order validation and authorization without `next`?
- What did the different `next` arguments mean, and why don't they transfer literally?
- How does responding differ from returning?
- When is a domain error useful?
- Which errors belong in the response versus server logs?

