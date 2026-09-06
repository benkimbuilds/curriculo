# Project: Messaging App

## Conversations between people

Build an application where authenticated users message others and customize their profiles. You do not need every Discord or WhatsApp feature: complete the core first.

## Assignment

1. Plan screens, models and libraries. Define users, profiles, conversations, memberships and messages. Decide whether a direct conversation is reused or multiple threads may exist between a pair.
2. Integrate maintained Next authentication with persistent sessions. Server-side, require conversation membership for every read and write.
3. Implement sending to another user, listing conversations and viewing ordered history. Derive the sender from the session, never a client-provided field.
4. Add own-profile editing with validated display name and biography. Changing an ID must not permit editing someone else's profile.
5. Provide pending, failure and retry states. Bound message length and paginate history instead of loading thousands of records.
6. Deploy and document fictional accounts or evaluation steps.

REST is request-response: another person's message does not spontaneously trigger a response to your browser. Real-time delivery is not required. Manual refresh or reasonable polling is acceptable; explain latency. WebSockets or real-time services are extensions, not substitutes for authorization.

## Suggested model

```text
users -> profiles
conversations -> conversation_members -> users
conversations -> messages -> sender (users)
```

Message queries must enforce membership in the same operation or suitable transaction. A conversation ID is not a sufficient secret. A uniqueness rule or idempotency key can prevent duplicate sends on retry.

## Acceptance criteria

- A signs in and sends B a message; B retrieves it.
- C cannot read or send into that conversation, including direct endpoint calls.
- History ordering and pagination are stable.
- A can edit only A's profile.
- Failed sends are visible; retries do not silently duplicate messages.
- Sign-out prevents private reads and sends.
- The interface does not promise real-time delivery when it only refreshes manually.

## Extra credit

- Image messages with private storage, size limits and content validation.
- Friends or online-user lists, defining what “online” means and when it expires.
- Group conversations with participant addition/removal and explicit history-access rules.

For each extension, repeat negative tests with an unrelated third account.

