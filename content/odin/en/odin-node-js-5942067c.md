# Testing Next.js routes and controllers

## Test HTTP contracts

You already know unit tests. Now verify methods, paths, headers, statuses and bodies together. The original uses SuperTest around Express. For Next, test pure rules as functions and use Playwright against a real server for routing, cookies and rendering.

Exporting functions makes them testable, but calling a Route Handler directly does not prove framework route selection or request-context cookie behavior. Choose the layer that supports your claim.

## Setup

Follow the [Next Playwright guide](https://nextjs.org/docs/app/guides/testing/playwright) in your practice application. Configure `baseURL` and `webServer` with a dedicated test database. Prefer a production build to catch development differences.

```ts
// tests/posts.spec.ts — API fixture from the API Basics lesson
import { test, expect } from "@playwright/test";

test("returns the documented public post shape", async ({ request }) => {
  const response = await request.get("/api/posts");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(await response.json()).toEqual([
    { id: 1, title: "Primera publicación" },
  ]);
});
```

This checks the previous lesson's fictional public API, including status, content type and body rather than merely absence of an exception.

## Await asynchronous work

Await every operation, including asynchronous assertions. A test that starts a request and finishes before checking it can pass while the request later fails.

The original's `done` callback signals completion. Do not combine it with returned promises; use the runner's async style. SuperTest builds on SuperAgent's HTTP features and provides `.expect`, `.end`, forms and multipart. Playwright's `request` context is the HTTP client; `expect` asserts results.

## Write/read sequence

1. Prepare a fictional user and authenticate an isolated context.
2. POST a valid message.
3. Check 201 or the documented redirect.
4. Use the returned ID to GET details.
5. Assert exactly the persisted public fields.
6. Remove or roll back fixtures only in the test database.

Starting a POST does not mean it completed. Use `form` for form payloads, `data` for JSON and `multipart` for files, following [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext). Do not manually supply an incorrect multipart boundary.

## Assignment

- Test GET, POST and an unsupported method.
- Cover invalid input, missing ID, absent session and denied permission.
- Assert error headers/body as well as status.
- Test the browser flow: form, failure, correction and result.
- Deliberately break an assertion and verify a nonzero exit, proving the test ran.
- Compare the original [SuperTest](https://github.com/forwardemail/supertest) and [SuperAgent](https://forwardemail.github.io/superagent/) documentation.

## Knowledge check

- What problem does a testing HTTP client solve?
- What does integration detect beyond a direct function call?
- What did done mean and how does async/await replace it?
- Why must request and assertion failures propagate?
- How would you submit multipart data?
- Why must these tests never target production?

