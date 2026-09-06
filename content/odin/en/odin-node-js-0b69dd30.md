# Final project: Odin-Book

## A complete social application

Combine modeling, authentication, relationships, UI and deployment in a bounded social-network application: users, profiles, posts, follow requests, comments and likes.

Write scope before coding. A commercial network takes entire teams; your objective is delivering the complete core. Separate requirements from extras, design relationships and implement verifiable user journeys.

## Preparation

1. Diagram users, profiles, posts, comments, reactions and follow requests/relationships.
2. Define constraints: one reaction per user/post, no duplicate follows, request states and deletion permissions.
3. Use Next, PostgreSQL and Prisma or the studied ORM. Integrate Better Auth with email/password or GitHub OAuth. Passport is replaced, while maintained-library authentication remains required.
4. Write a fictional-data seed script, optionally using [Faker](https://github.com/faker-js/faker). Do not seed demonstrations with real people.

## Requirements

1. Require sign-in to view content; only necessary authentication and recovery pages are public.
2. Support the chosen sign-in method and session revocation/sign-out.
3. Allow follow requests. Recipients accept or reject them; pending requests are not accepted follows.
4. Create text posts.
5. Like posts without duplicate reactions.
6. Comment on posts.
7. Always display post content, author, comments and likes.
8. Show recent posts from the current user and accepted follows in a sorted, paginated feed.
9. Let users create profiles with pictures. You may use authorized OAuth pictures or [Gravatar](https://www.gravatar.com/); explain data shared with external providers.
10. Profile pages show information, image and posts.
11. Provide a user directory with follow-request buttons for users not already followed or pending.
12. Deploy and document the application.

Adapt details to the chosen network without silently removing core functions. Chat, notifications and real-time updates are optional.

## Acceptance criteria

- Anonymous profile, post and private API requests are rejected.
- A requests B; restricted content remains inaccessible before acceptance and appears in the appropriate feed afterward.
- C cannot accept B's requests, edit another person's posts or change another profile.
- Repeated or concurrent likes create only one reaction.
- Posts display correct author, comments and reaction counts.
- Feed pagination neither repeats nor skips records because of unstable ordering.
- Invalid forms preserve safe values and never expose passwords or secrets.
- Migrations and fictional seeds support evaluation from an empty database.
- README covers architecture, limitations, authorization checks and deployment URL.

## Extra credit

1. Add post images through validated URLs or uploads to [Cloudinary](https://cloudinary.com/documentation/node_integration) or [Supabase Storage](https://supabase.com/docs/guides/storage); store references rather than indiscriminate binary data.
2. Support profile-photo changes with validation and ownership.
3. Add a visitor demonstration session for evaluation without registration. Keep it limited and isolated, with no administrator rights or real private data.
4. Polish presentation after the core works.
5. Explore [Socket.IO](https://socket.io/) for real-time features only after completing the core; authenticate those connections too.

