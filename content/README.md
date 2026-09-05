# AI Builders Web Curriculum

This directory is the versioned curriculum source for the twelve-week beginner program. Learners read the published `es-MX` edition; authorized curriculum and developer administrators may consult the paired English audit source. Each locale uses the same stable week, module, lesson, project, rubric, and criterion identifiers so progress survives editorial changes.

The lesson prose, local examples, projects, and rubrics are original adaptations informed by the learning sequence of The Odin Project. They are not a bulk copy of Odin or of its third-party resources. Every week records the exact upstream repository commit, relevant upstream paths, editor or translator, review date, and independently linked resources.

## Editorial workflow

1. Edit the paired files under `weeks/en` and `weeks/es-MX` without changing stable IDs.
2. Move content through `draft`, `review`, `published`, or `archived`.
3. Run `pnpm exec tsx scripts/content/validate.ts`.
4. Regenerate the runtime registry with `pnpm exec tsx scripts/content/generate-manifest.ts`.
5. Commit the content files and generated manifest together.

Published Spanish content must have a published English audit source. URLs must be public HTTPS resources. The validator rejects private-network, credential-bearing, malformed, and non-HTTPS destinations.

## Scope and audience

The sequence assumes no previous programming experience. Setup instructions support the lab's Windows computers and learners using macOS. Self-paced learners may take longer than twelve weeks; the week labels define the facilitated cohort schedule, not an access deadline.
