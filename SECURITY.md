# Security policy

Please report suspected vulnerabilities privately to the program operator.
Do not include student data, credentials, reset links, or exploit details in a
public issue.

## Supported version

Until the first tagged release, only the current `main` branch is supported.

## Security boundaries

- Student repositories and arbitrary code must never execute in the web or
  worker service. A separately approved sandbox is required.
- Social features remain disabled in production until the operator approves
  the safeguarding policy for participants of all ages.
- Secrets belong in environment variables and must not be committed.
- Production email, AI, GitHub, and deployment providers require independent
  credential and data-handling review before activation.

