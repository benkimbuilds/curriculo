# Project: Mini Message Board

## What you will build

A board that lists messages, opens an individual message and accepts new posts. Preserve the original project functionality while replacing Express and EJS with Next.

## Build sequence

1. Create App Router pages at `/` and `/new`: one lists messages, the other displays a form.
2. Prepare two fictional fixtures with `id`, `text`, `user` and `added`. Render author, text and date in a Server Component.
3. Add a “New message” link. The form needs labelled author and message fields with `name` attributes and a submit button.
4. Handle submission through a Server Action or POST `/api/messages`. The latter uses `await request.formData()`, not `express.urlencoded`. Check string types, trim whitespace and enforce length limits before writing.
5. Generate IDs and timestamps on the server, save and redirect home. Use HTTP 303 after a POST, or `redirect("/")` in a Server Action after invalidating the relevant view.
6. Add an “Open” link and `/messages/[id]`, handling absent identifiers appropriately.
7. Publish the repository and startup instructions. Deploy in the following lesson.

Fixtures teach rendering, but a module variable is unreliable storage in Next because processes restart or multiply. Before publishing writes, use the PostgreSQL table from “Using PostgreSQL”. The later persistence revision must demonstrate survival across restarts.

## Data model

```sql
CREATE TABLE messages (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_name TEXT NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 80),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

The visitor-supplied name is attribution, not verified identity. Do not describe this as authentication.

## Acceptance criteria

- Home displays both fixtures with author, text and date.
- A valid submission appears after redirect.
- Empty fields, a file submitted as a name and overlong text fail server validation.
- Details show the matching message; missing IDs never expose another record.
- HTML-like input never executes JavaScript.
- The form explains errors and prevents repeated clicks while pending.
- The PostgreSQL revision retains messages after a restart.
- README includes deployment URL, routes, storage decisions and test steps.

Repeat the flow in a fresh window and compare the stored row with the rendered message.

