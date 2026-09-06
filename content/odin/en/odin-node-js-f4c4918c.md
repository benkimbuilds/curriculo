# Project: Members Only

## A club with distinct permissions

Build a clubhouse where anybody can read messages but only members can see authors and dates. Registered accounts may post; club membership requires an additional step. Administrators may also delete messages.

## Assignment

1. Model users with first/last names, sign-in identifier and membership status. Delegate credentials and sessions to Better Auth; keep domain profiles and permissions in PostgreSQL. Messages need title, body, timestamp and author.
2. Create the Next application and migrations with required-field and relationship constraints.
3. Implement registration with password confirmation and server validation. The library must hash credentials from the first account; never introduce a plaintext-password stage.
4. Registration must not grant membership. Add a club-passcode page. Check the code exclusively on the server, limit attempts and update the authenticated user's membership.
5. Add sign-in and sign-out through Better Auth's official integration.
6. Show “Create message” when signed in and independently guard the server mutation. Hiding a link is not authorization.
7. Return author and timestamp only to members or administrators. Visitors and nonmember accounts receive title and body only; do not hide private fields in props, JSON or HTML.
8. Add an administrator role and server-authorized deletion. Provision administrators through a protected administrative operation, never a public registration checkbox.
9. Deploy and document role checks with fictional accounts.

## Acceptance matrix

| Operation | Visitor | Account | Member | Administrator |
| --- | --- | --- | --- | --- |
| Read title/body | Yes | Yes | Yes | Yes |
| Post | No | Yes | Yes | Yes |
| See author/date | No | No | Yes | Yes |
| Delete | No | No | No | Yes |

The distinction between registration and membership is central; do not grant membership automatically.

## Concrete checks

- Post as account A, request the list anonymously and verify network responses contain neither author nor date.
- Submit a wrong passcode: membership remains unchanged.
- Submit the correct code: a fresh read includes attribution.
- Submit `isAdmin=true` or another account's ID: permissions remain unchanged.
- Send a direct delete request as a member: it fails.
- Delete as an administrator and verify list and detail removal.
- Sign out and repeat a protected operation: it fails.

The [Better Auth Next integration](https://better-auth.com/docs/integrations/next) and [email/password guide](https://better-auth.com/docs/authentication/email-password) replace Passport and its strategies.

