# React routing with Next.js App Router

This lesson replaces Odin's React Router implementation with Next.js App Router while preserving client navigation, nested and dynamic routes, index views, error handling, shared data, protected routes, and routing tests. The pinned original remains available for comparison. Do not install two routers to manage the same application routes.

## Client-side navigation

Traditional navigation requests a new document. Client routing intercepts internal links, updates the URL using browser mechanisms such as the History API, and changes the view without replacing the entire document. Next.js combines server rendering with client transitions: client navigation does not mean no server requests occur.

A routing library handles history and view coordination, but you must still verify document titles, headings, focus, and navigation with assistive technology. A visually smooth transition is not automatically an understandable one.

## Routes become files

Odin configures `createBrowserRouter` with `{ path, element }` objects and renders `RouterProvider`. App Router derives routes from files:

```text
app/
  layout.tsx
  page.tsx
  not-found.tsx
  profile/
    layout.tsx
    page.tsx
    [name]/
      page.tsx
    error.tsx
```

The root page handles `/`; the profile page handles `/profile`; `[name]` captures a variable segment. A folder without a page does not itself publish a page. The root layout must contain `html` and `body`; nested layouts do not repeat those tags.

```tsx
// app/layout.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav><Link href="/">Home</Link> <Link href="/profile">Profiles</Link></nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

Next's `Link` uses `href`, not React Router's `to`. Prefer real links for navigation so users can open another tab. Keep suitable HTML links for external destinations.

## Nested routes, index pages, and parameters

React Router uses `Outlet` for the selected child. Next's structural equivalent is a layout's `children` prop:

```tsx
// app/profile/layout.tsx
import type { ReactNode } from "react";
export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <section><h1>Workshop profiles</h1>{children}</section>;
}

// app/profile/page.tsx
import Link from "next/link";
export default function ProfilesPage() {
  return <p>Choose <Link href="/profile/popeye">Popeye</Link> or <Link href="/profile/spinach">Spinach</Link>.</p>;
}
```

The folder's page supplies the index view when there is no additional segment. Its layout also wraps descendants. A dynamic profile page reads its parameter:

```tsx
// app/profile/[name]/page.tsx
import { notFound } from "next/navigation";

const profiles: Record<string, string> = {
  popeye: "I am Popeye and I love spinach.",
  spinach: "I am Spinach; Popeye appreciates me.",
};

export default async function ProfilePage({ params }: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const description = profiles[name];
  if (!description) notFound();
  return <p>{description}</p>;
}
```

Next.js 16 server pages receive asynchronous `params`; Client Components can use `useParams` from `next/navigation`. Parameters are external input and must be validated. `[...slug]` matches several segments; `[[...slug]]` also permits none. A catch-all pattern is not a substitute for explicit missing-resource handling.

## Missing resources and unexpected errors

`app/not-found.tsx` supplies missing-resource UI, and `notFound()` handles an unknown record even when the dynamic route pattern matched. An unexpected exception is different. Put `error.tsx` in a segment to offer recovery. This project's Next.js 16.3 API names the recovery function `retry`:

```tsx
"use client";
import Link from "next/link";

export default function ProfileError({ retry }: { retry: () => void }) {
  return <section><h2>We could not open the profile</h2><button onClick={() => retry()}>Try again</button><Link href="/profile">View profiles</Link></section>;
}
```

Boundaries catch rendering failures in descendants, not every event-handler or asynchronous error. Model those failures explicitly. An error in the same segment's layout needs a higher boundary; global error UI replaces the root layout and must include `html` and `body`. Do not expose stack traces or secrets.

## Shared data and protected navigation

React Router's outlet context shares values with nested descendants. In Next.js, place a Client Component context provider around `children` in a stable layout. A cart can then survive navigation between store pages. Do not attempt to inject arbitrary props into framework-owned pages through `children`: use client context, props on components you instantiate, or server data loading. Server Components do not consume client context.

For imperative navigation from an event, use `useRouter` from `next/navigation`, with `push`, `replace`, or `back`. Prefer `Link` for ordinary navigation. Protected pages must verify session and authorization on the server before returning sensitive data. Redirect missing sessions using `redirect("/ingresar")`; authorize each sensitive operation too. A hidden button or client redirect does not prevent direct endpoint requests. A persistent layout alone is not an adequate authorization boundary.

## Tests and deployment

Odin uses `MemoryRouter` or `createMemoryRouter` to supply React Router context during tests. Those are not substitutes for App Router. Test presentational components with RTL and use browser tests against the running Next app for parameters, navigation, redirects, shared layouts, and missing pages. A mock of `next/navigation` can show that a handler requested navigation; it cannot prove the target exists or is protected.

Build and deploy Next.js on a compatible Node host. Do not redirect every request to `/index.html`, as a Vite SPA deployment might. Verify a direct request and refresh of `/profile/popeye`, internal navigation, and browser back/forward.

## Walk through distinct cases

Start at `/` and follow the profile link. Confirm that shared navigation stays present and the URL changes. Then open `/profile` directly in another tab: its index must work without a previous visit to the homepage. This reveals applications that accidentally depend on data prepared by an earlier navigation.

Visit `/profile/popeye` and then manually change the URL to `/profile/spinach`. Both match the same dynamic pattern. An unknown name also matches `[name]`, but it does not identify an allowed record, so the page must validate it. A completely unknown path matches no published page and should receive a clear missing-page view:

```tsx
// app/not-found.tsx
import Link from "next/link";
export default function NotFound() {
  return <section><h1>We could not find that page</h1><Link href="/">Return home</Link></section>;
}
```

Do not silently redirect every bad destination home: users lose the explanation and broken links become difficult to detect. A temporarily unavailable server is also different from a nonexistent record. A retry button helps recoverable failures; it does not make a missing identifier valid.

To verify shared state, put a small counter inside a client provider wrapping both navigation and pages. Change it from one page and read it from another. If it resets during navigation, inspect whether the provider lives inside a page that unmounts, or whether its key changes. Two components with the same name in different pages do not share an instance automatically.

Preserving layout state does not preserve authorization guarantees. A layout may remain mounted, so an access check performed there once cannot establish current permission for every later operation. Check session and authorization close to sensitive data. Requesting an operation directly without using its UI button is a useful way to verify that the server rejects unauthorized callers.

The original's testing guidance distinguishes supplying a minimal routing context from executing routing behavior. Rendering a child containing a link may only need the former. Verifying nested matching, parameters, redirects, and errors needs the latter. In this adaptation, run Next.js in a real browser for that evidence. A mocked `push` call cannot show that the production server will handle a refreshed destination.

## Assignments

1. Read [SPAs and client-side routing](https://bholmes.dev/blog/spas-clientside-routing/) and compare document requests with transitions in Network.
2. Build the example, add a profile and another nested route, then reconstruct it without copying.
3. Study [layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [navigation](https://nextjs.org/docs/app/getting-started/linking-and-navigating), and [error handling](https://nextjs.org/docs/app/getting-started/error-handling). Compare [React Router](https://reactrouter.com/home) and [outlet context](https://reactrouter.com/api/hooks/useOutletContext) to recognize existing codebases.
4. Verify index, valid and unknown profiles, unknown route, back navigation, shared state, and unauthenticated access. Test your behavior, not router internals.

## Knowledge check

- What changes with client navigation, and what still happens on the server?
- Which files replace route configuration and an outlet?
- How do index pages, parameters, and catch-all segments differ?
- When do you need `notFound` versus an error boundary?
- How do pages share state without arbitrary props injected into `children`?
- Why does protected navigation require server authorization?
- What needs an actual browser test rather than a router mock?
