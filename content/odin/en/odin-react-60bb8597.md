# Project: shopping cart

Build a mock store that integrates components, external data, state, routing, and tests. Do not implement real payments. All Odin cart requirements remain; routing and deployment use Next.js App Router instead of a Vite SPA with React Router.

## Complete requirements

1. Create a React project with Next.js. Plan component and folder structure, state ownership, and required behavior. Keep the plan in the README and update it as decisions change.
2. Include home, shop, and cart pages with a navigation bar visible on every page.
3. The home page may use simple images and information about the fictional store.
4. Show individual product cards with title, image, manually editable quantity, increment/decrement controls, and an Add to Cart button.
5. The cart navigation link displays the current number of units and updates immediately as users add, remove, or change quantities.
6. The cart shows line items and quantities, supports increasing/decreasing quantities and removal, and handles zero explicitly. Reject negative, fractional, or otherwise invalid quantities.
7. Fetch products from [FakeStore API](https://fakestoreapi.com) or a comparable external API. Show loading, error, empty, and populated states.
8. Test the application's behavior with React Testing Library. Do not test routing-library implementation details.
9. Style the application and publish repository and deployment links. Verify each production page directly.

## Model quantities deliberately

A cart line represents a product and a quantity. Adding the same product repeatedly should combine units according to an explicit rule rather than produce ambiguous duplicate rows. The navigation count normally means the sum of units; document if you choose distinct products instead. Derive totals rather than storing another synchronized state:

```js
const units = cart.reduce((sum, line) => sum + line.quantity, 0);
const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
```

A real financial system would use integer minor units and defined rounding rules. For this exercise, document the API's price format. Inputs produce strings even when their type is number. Convert and validate before changing the cart. Keep a temporary input draft if necessary so someone can clear the field while editing without introducing `NaN` into application state.

## App Router structure

Use `app/page.tsx`, `app/tienda/page.tsx`, and `app/carrito/page.tsx`. Put shared navigation and a client cart provider in their common layout. The provider wraps `children`, replacing state supplied through a React Router outlet. Interactive cards and controls run on the client; a server page may fetch products and pass serializable data into them.

As an extension, `app/tienda/[id]/page.tsx` can show one product. Read `await params` in Next.js 16 and validate the ID. Use `not-found.tsx` for missing products and `error.tsx` for unexpected failures. Navigate with `Link` and `href`. Preserve cart state across page transitions; refresh may reset it without persistence, but document that limit.

## Deployment replacement

Odin describes SPA fallbacks on Netlify (`/* /index.html 200`) and Vercel (rewrites to `index.html`), plus Cloudflare Pages' default SPA handling. Those instructions belong to Vite and React Router. Do not add them to Next.js App Router. Run `npm run build` and `npm run start`, then deploy on Railway or another Next.js-compatible Node host. Configure build, start, and required environment variables using the [Next.js deployment guide](https://nextjs.org/docs/app/getting-started/deploying).

## Evidence to submit

- Add two units of one product and one of another: count and total must agree.
- Change quantity, remove a line, visit another page, and return without inconsistent state.
- Exercise empty, zero, negative, and fractional quantities without impossible state or `NaN`.
- Simulate API failure and verify recovery.
- Open `/tienda` and `/carrito` directly, refresh, and use browser back/forward.
- Publish test results and explain what survives navigation versus refresh.
