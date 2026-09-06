# Forms and data handling

## From form to server

HTML forms define `action` (destination) and `method` (GET or POST). Each field is submitted under its `name`; `id` connects its label, not its submitted key. GET puts values in the URL and suits shareable searches. POST sends a body and suits mutations; it still requires HTTPS and is not inherently secure.

POST/Redirect/GET prevents refresh from repeating a POST, but does not alone prevent duplicate concurrent operations.

Next Server Actions receive `FormData` through a form's `action`; Route Handlers use `request.formData()`. Do not copy Express's `req.body` or `express.urlencoded`.

## Validate, normalize and encode

Validation checks rules. Normalization may trim whitespace or convert a number. Output encoding depends on context: React escapes JSX text, while SQL requires parameters. Encoding everything as HTML upon receipt causes double-encoding.

A field can be `string`, `File` or `null`; TypeScript cannot validate network data. Extract allowed fields explicitly. Passing `Object.fromEntries(formData)` directly into an ORM can admit unexpected properties.

Use Zod for this exercise (`npm install zod` in the student's project). Chained rules produce structured errors. Real names contain accents, spaces, apostrophes and hyphens; do not restrict them to ASCII letters for convenience.

```ts
// lib/contact-input.ts
import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  age: z.preprocess(
    value => value === "" || value == null ? undefined : value,
    z.coerce.number().int().min(18).max(120).optional(),
  ),
  bio: z.string().trim().max(200),
});

export function parseContact(formData: FormData) {
  return contactSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    age: formData.get("age"),
    bio: formData.get("bio"),
  });
}
```

```ts
// app/contacts/actions.ts — validation-only stage, no persistence yet
"use server";
import { parseContact } from "@/lib/contact-input";

export async function validateContact(
  _previous: { message: string },
  formData: FormData,
) {
  const result = parseContact(formData);
  if (!result.success) {
    return { message: result.error.issues.map(issue =>
      issue.path.join(".") + ": " + issue.message).join("; ") };
  }
  return { message: "Datos válidos; aún no se han guardado." };
}
```

```tsx
// app/contacts/new/contact-form.tsx
"use client";
import { useActionState } from "react";
import { validateContact } from "../actions";

export function ContactForm() {
  const [state, action, pending] = useActionState(validateContact, { message: "" });
  return (
    <form action={action}>
      <label htmlFor="firstName">Nombre</label>
      <input id="firstName" name="firstName" required maxLength={80} />
      <label htmlFor="lastName">Apellido</label>
      <input id="lastName" name="lastName" required maxLength={80} />
      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="age">Edad de ejemplo (opcional)</label>
      <input id="age" name="age" type="number" min={18} max={120} />
      <label htmlFor="bio">Biografía</label>
      <textarea id="bio" name="bio" maxLength={200} />
      <p aria-live="polite">{state.message}</p>
      <button disabled={pending}>Validar</button>
    </form>
  );
}
```

This initial example **validates only**, as its message explicitly states. Add `app/contacts/new/page.tsx` importing and rendering `ContactForm`. The 18–120 age range is the original exercise's fictional domain rule, not a Ruta participation requirement.

## Errors and persistence

`useActionState` adds previous state as the first argument and exposes `pending`. Improve the example with per-field errors linked through `aria-describedby`. Preserve safe input on failure, never passwords.

When adding storage, validate first and write only `result.data`. Invalidate the view and redirect after success. HTTP endpoints use 400 for invalid input, 201 for creation and 303 for a form POST redirect. Server Actions return UI state rather than an HTTP `Response`.

## Complete CRUD

1. Add a storage module and contacts table containing ID, first/last name, email, optional age and biography.
2. Implement listing and creation. Add editing with existing values and the same validation.
3. Validate IDs separately and check record existence. Once accounts are introduced, scope every read and write to the authenticated owner.
4. Add confirmed deletion through POST or a Server Action, never GET.
5. Add name/email search through a GET form. Await page `searchParams` in current Next, validate scalar inputs and search in SQL.
6. Render results in a distinct view or filtered list. Distinguish empty results from query failure.

## Assignment and checks

- Required first/last names and correctly formatted email.
- Optional integer age from 18 to 120; biography limited to 200 characters.
- Test spaces, accents, apostrophes, invalid email, empty age, 17, 121 and a 201-character biography.
- Bypass browser validation with a direct request; server rejection must remain.
- Store HTML-like biography text and verify it renders as text rather than executes.
- Read [Next forms](https://nextjs.org/docs/app/guides/forms) and [sanitizing versus escaping](https://blog.presidentbeef.com/blog/2020/01/14/injection-prevention-sanitizing-vs-escaping/).

## Knowledge check

- What do action, method, name and id do?
- How do you import and apply a validation schema?
- How do normalization, validation and encoding differ?
- How do you represent optional fields?
- How do server errors appear without losing safe input?
- Why is rendering user-provided HTML dangerous?

Original [express-validator docs](https://express-validator.github.io/docs/), [chains](https://express-validator.github.io/docs/guides/validation-chain), [custom validators](https://express-validator.github.io/docs/guides/customizing#implementing-a-custom-validator) and the [forms video](https://youtu.be/SccSCuHhOw0?si=2dZ5Y4dvxyh7jpcy) remain comparisons rather than implementation dependencies.

