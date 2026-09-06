# Introduction to Next.js

## Moving beyond the manual server

Your Node informational site reads files, selects routes and prepares responses manually. The original lesson introduces Express. This adaptation uses **Next.js App Router** while preserving the learning goals: start a server, follow an incoming request, understand intervening logic and restart automatically during development.

Next combines React views with HTTP entry points. Pages are Server Components by default; Route Handlers return HTTP responses. Learn these boundaries before combining them.

## Create and run the application

1. Run `npx create-next-app@latest biblioteca`; select TypeScript and App Router. Keep the lockfile and record versions in your README.
2. Enter the directory and run `npm run dev`.
3. Open `http://localhost:3000`. Read the terminal if that port is occupied and select an available development port.
4. Replace the homepage and add the following handler.

```tsx
// app/page.tsx
export default function Home() {
  return <h1>Hola, mundo</h1>;
}
```

```ts
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hola, mundo" });
}
```

GET `/` resolves to `app/page.tsx`; GET `/api/hello` resolves to the exported method in `route.ts`. One renders UI; the other returns JSON with its content type. A page and Route Handler cannot occupy the same URL.

## Follow the request

The browser addresses an origin, port and path. Next matches the path to files, executes a component or handler and constructs the response. The browser receives status, headers and body. You do not call `app.listen`; the Next command manages the server.

Middleware broadly means work between receiving and responding: logging, authentication, validation or routing. Next does not use Express's `next()` chain. Put business rules and authorization in server functions called at each entry point. `proxy.ts` can redirect or rewrite requests, but navigation redirects cannot replace authorization within operations.

## Static files and development updates

Files in `public` are exposed from the root: `public/logo.svg` becomes `/logo.svg`. Never place secrets there.

The development command watches changes. Build with `npm run build`, then run `npm start` to check production behavior; development and production differ. Honor the port injected by your deployment platform.

## Assignment

1. Read [Next installation](https://nextjs.org/docs/app/getting-started/installation) and [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers).
2. Rewrite the informational site with home, `/about`, `/contact-me` and `app/not-found.tsx`.
3. Keep the original Node version to compare manual and file-based routing.
4. Request the page and endpoint with `curl -i` or PowerShell's `curl.exe -i`. Identify status and content type.
5. Change the message without restarting manually and explain what observes the change.

## Knowledge check

- Which manual Node responsibilities does Next handle?
- What happens when GET matches a page versus a Route Handler?
- How do you serve a public file?
- Which command watches changes?
- Why can't a navigation-only check enforce permissions?

The [original Express API reference](https://expressjs.com/en/api.html) remains useful for comparison; installing Express is not required.

## Response lab

Compare responses in Network. Inspect the main page request and its Content-Type, then open the JSON endpoint directly. Both may return 200 despite different bodies and consumers. Request an unknown URL and verify 404. Finally introduce a development syntax error, locate its file and line in the terminal, then fix it. Distinguish routing failure, compilation failure and a valid response in a different format.
