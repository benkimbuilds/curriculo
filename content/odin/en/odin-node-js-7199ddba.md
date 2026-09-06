# Views with React Server Components

## Server-generated HTML

A SPA may begin with minimal HTML and build its interface in the browser. A server view incorporates data before sending HTML. The original lesson used EJS templates; this version uses React Server Components while teaching the server/client boundary explicitly.

Components in `app` run on the server by default. They may query server data and return JSX. They cannot use interactive state, effects or browser APIs. Isolate interaction in a small `"use client"` component and pass only the public data it needs.

## Variables, loops and conditions

Braces insert JSX expressions. Use `map` for lists and conditional expressions for empty states. Data arrives through local variables or explicit props, not a global `locals` object. An undeclared variable remains an error; define optional property types and fallback values deliberately.

```tsx
// app/components/footer.tsx
export function Footer() {
  return <footer><small>Biblioteca de práctica</small></footer>;
}

// app/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "./components/footer";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav aria-label="Principal">
          <Link href="/">Inicio</Link>{" "}
          <Link href="/about">Acerca de</Link>
        </nav>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
const users = ["Rose", "Cake", "Biff"];

function User({ name }: { name: string }) {
  return <li>{name}</li>;
}

export default function Home() {
  return users.length
    ? <ul>{users.map(name => <User key={name} name={name} />)}</ul>
    : <p>No hay personas todavía.</p>;
}

// app/about/page.tsx
export default function About() {
  return <h1>Acerca de la biblioteca</h1>;
}
```

The `User` props replace template locals. Keys must be stable and unique among siblings; the teaching fixture has distinct names, but production records should use IDs.

## Reuse and structure

A reusable component replaces a template partial. The root layout receives `children` and adds navigation and footer to every page. Nested layouts share structure within a section. Folders organize routes; shared components may live in `components`.

React escapes interpolated text. Try `<script>alert(1)</script>` as a name: it should render as text rather than execute. Do not switch to `dangerouslySetInnerHTML` to “fix” the result. Input normalization and context-specific output encoding are different concerns.

Import `app/globals.css` from the layout for global styling. Files in `public` are available from the root: `public/logo.svg` becomes `/logo.svg`, not `/public/logo.svg`. CSS changes presentation without changing where data originates.

## Assignment

1. Read [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) and [layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages).
2. Implement the example list, navigation and footer.
3. Add `/about` and verify its footer is shared rather than duplicated.
4. Move the user component into a subdirectory and update its import.
5. Change the color with CSS, add a static asset and inspect the returned HTML.
6. Test empty lists, absent data and HTML-like text.
7. For optional comparison, [EJS documentation](https://ejs.co/#docs), [template engines](https://expressjs.com/en/guide/using-template-engines.html) and the [original tutorial](https://blog.logrocket.com/how-to-use-ejs-template-node-js-application/) describe the replaced alternative.

## Knowledge check

- How does server rendering differ from a client-rendered SPA?
- Which files configure App Router views?
- How do you run logic and interpolate values in JSX?
- How does the server supply view data?
- How do you reuse navigation and footers?
- Which data may cross into a Client Component, and which must remain private?

## Verify execution boundaries

Temporarily log from a Server Component and observe the terminal when requesting the page. Add a small client button with state and compare server logs, browser console and transferred data. Development may render more than once, so a single log is not definitive evidence.

Inspect returned HTML for a list name. Disable JavaScript and check which basic content remains, then re-enable it and test interaction. Distinguish server-produced content from interactive behavior without assuming Client Components render only in the browser.
