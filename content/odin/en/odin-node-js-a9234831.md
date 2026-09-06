# API security and tokens

## Sessions and tokens

Sessions commonly associate a cookie with server state. Bearer tokens are explicitly sent in `Authorization`; possession permits use while valid. Both require HTTPS, validation and authorization.

JWT contains header, payload and signature. Its encoded payload is readable, not secret storage. A signature detects tampering only when checked with the correct key and allowed algorithm.

## Request flow

1. Authenticate through a maintained library.
2. Issue a token with subject, expiry, issuer and audience.
3. Call the API with `Authorization: Bearer ...`.
4. Verify signature, allowed algorithm, issuer, audience and time.
5. Enforce resource permissions independently.

Decoding is not verification. A decode function can read a forged payload. Verification must reject invalid signatures and expiration before protected queries run.

## Implement in Next

Use [Better Auth's JWT plugin](https://better-auth.com/docs/plugins/jwt) or an equivalent provider. Follow its key/JWKS, issuer and audience configuration. Verify with a maintained library rather than implementing signatures yourself.

Extract server-side verification and invoke it from each protected Route Handler. Missing headers, wrong schemes and invalid tokens receive 401. Valid identity without permission requires 403 or a non-disclosing absence response.

Short lifetimes reduce exposure but do not automatically revoke stolen copies. Document renewal, sign-out and, when immediate revocation matters, session checks or revocation tracking. Deleting localStorage does not invalidate a token at the server.

## Assignment

1. Watch the original videos on [creating/verifying JWTs](https://www.youtube.com/watch?v=7nafaH9SddU) and [use cases](https://www.youtube.com/watch?v=7Q17ubqLfaM).
2. Configure the library's issuer in a practice application.
3. Add a protected endpoint returning only the user's public identifier.
4. Send a valid token and verify 200.
5. Alter a character, use an expired token, change audience and omit the header: all must fail.
6. Verify a valid token cannot edit another user's resource.
7. Choose an interface-side server with an HttpOnly cookie or short-lived in-memory tokens; document the tradeoff.

## Knowledge check

- What is JWT?
- How do encoding, signing and encryption differ?
- How do tokens avoid repeated credentials and limit validity?
- Where is the token transmitted?
- How do signing and verification differ?
- Why does expiration not replace authorization?
- What happens to tokens issued before sign-out?

Original comparisons: [Express JWT guide](https://web.archive.org/web/20230207144457/https://laptrinhx.com/a-practical-guide-for-jwt-authentication-using-node-js-and-express-917791379/), [Passport JWT](https://medium.com/@paul.allies/stateless-auth-with-express-passport-jwt-7a55ffae0a5c) and [JWT pitfalls](https://www.youtube.com/watch?v=JdGOb7AxUo0). Passport is not required.

