# Routes, parameters, and organization

## A route is a contract

The HTTP method and URL identify the requested operation. GET reads; POST submits data or performs an action; PUT replaces; PATCH partially updates; DELETE removes. The address bar sends GET, so test other methods with an HTTP client.

Next represents paths with folders. `page.tsx` creates UI; `route.ts` exports supported HTTP methods. An unimplemented method receives 405. Rather than copying `app.all`, explicitly export the methods your contract permits.

## Build the library route map

```text
app/
  page.tsx
  about/page.tsx
  contact/page.tsx
  books/page.tsx
  books/[bookId]/page.tsx
  books/[bookId]/reserve/page.tsx
  authors/page.tsx
  authors/[authorId]/page.tsx
  api/books/[bookId]/reserve/route.ts
  api/authors/[authorId]/route.ts
```

```ts
// app/api/authors/[authorId]/route.ts
export async function GET(
  request: Request,
  context: { params: Promise<{ authorId: string }> }
) {
  const { authorId } = await context.params;
  const url = new URL(request.url);
  const sorts = url.searchParams.getAll("sort");
  if (!/^[1-9]\d*$/.test(authorId)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }
  return Response.json({ authorId, sorts });
}
```

Square brackets define a dynamic parameter. Current Next passes `params` as a promise; await it. Query parameters do not change path matching: `?sort=date&sort=likes` still addresses the same resource, and `getAll` preserves repeated values.

## Patterns and precedence

`[id]` captures one segment, `[...slug]` one or more, and `[[...slug]]` also permits zero. A `(catalog)` route group organizes files without adding a URL segment. Layouts share structure but are not manually mounted routers.

Next resolves static and dynamic routes according to framework conventions, not the order of `app.get` registrations. For aliases such as `/message` and `/messages`, use explicit paths or documented redirects rather than Express wildcard strings. Use `not-found.tsx` for missing-page UI, and validate identifiers before querying storage.

A Route Handler does not participate in layouts or page navigation. Separate `/books/[bookId]/reserve`, the form page, from `/api/books/[bookId]/reserve`, its potential POST endpoint. Server Actions offer another approach for UI mutations, covered later.

## Assignment

1. Read [pages and layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [dynamic segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) and [route reference](https://nextjs.org/docs/app/api-reference/file-conventions/route).
2. Implement every mapped route with a distinct response. Add GET and POST for contact; the POST may acknowledge input without persisting it yet.
3. Build author list/detail and book list/detail/reservation pages.
4. Test known, malformed and missing identifiers. The example has no database yet; once you add queries, distinguish valid syntax from an existing record.
5. Send two `sort` parameters and verify neither is lost.
6. Use [Postman](https://www.postman.com/downloads/) or curl to compare GET and POST on the same endpoint.

## Knowledge check

- How do you restrict a route to a method?
- How do you explicitly implement multiple methods?
- Which patterns match one, many or zero segments?
- Why must authorization not depend on file ordering?
- Where do path and query parameters live?
- How do you organize book and author routes without repeating segments?
- If `app/users` already represents `/users`, where would you put `/users/delete`?

For historical comparison, [Express routing](https://expressjs.com/en/guide/routing.html) and this [routing video](https://youtu.be/0Hu27PoloYw?si=LZ8wQkOTP-e50Zvi) describe the replaced model; do not use that syntax in this project.

## Parameter test cases

List requests to /api/authors/1, /api/authors/abc, /api/authors/1?sort=date and repeated sort parameters. Predict authorId and the query array before executing. Dynamic segments begin as text; numeric conversion alone does not validate an identifier.

Add the static /authors/new page and confirm it is not treated as ID new. Then add a documentation catch-all and inspect its segment array. Never turn arbitrary segments into filesystem access: this experiment demonstrates URL resolution, not publishing the server's directories.
