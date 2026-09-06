# AI Builders Web Curriculum

This directory is the versioned curriculum source for the twelve-week beginner program. Learners read the published `es-MX` edition; authorized curriculum and developer administrators may consult the paired English audit source. Each locale uses the same stable week, module, lesson, project, rubric, and criterion identifiers so progress survives editorial changes.

The guided lesson prose, examples, projects, and rubrics are original adaptations informed by The Odin Project. The complete library under `odin/` also vendors the first-party source lessons and maps every official Foundations and Full Stack JavaScript entry to Spanish material. Third-party readings remain links rather than reproduced articles. Every source file is tied to a pinned commit and SHA-256 hash.

## Editorial workflow

1. Edit the paired files under `weeks/en` and `weeks/es-MX` without changing stable IDs.
2. Move content through `draft`, `review`, `published`, or `archived`.
3. Run `pnpm exec tsx scripts/content/validate.ts`.
4. Regenerate the runtime registry with `pnpm exec tsx scripts/content/generate-manifest.ts`.
5. Commit the content files and generated manifest together.

For the complete library, edit `odin/es-MX/<id>.md` and the relevant `odin/mappings/<course>.json`. A substantive Next.js, platform, or technical replacement also requires `odin/en/<id>.md`. Otherwise the pinned upstream English lesson is retained for comparison. Run `pnpm content:odin:build` and `pnpm content:odin:check`, committing the generated library and coverage report with the sources. Do not alter `odin/upstream/` manually.

The inventory currently contains 197 official entries: 162 lessons and 35 projects. The guided 48 lessons are separate; do not count their English and Spanish bodies as distinct curriculum topics. Source-relative length checks help detect abbreviated adaptations but do not replace instructional review. Independent human pedagogical review is not certified by the generated report.

Published Spanish content must have a published English audit source. URLs must be public HTTPS resources. The validator rejects private-network, credential-bearing, malformed, and non-HTTPS destinations.

## Scope and audience

The sequence assumes no previous programming experience. Setup instructions support the lab's Windows computers and learners using macOS. The full library exceeds the twelve-week guided workload. Its progress is tracked separately, and its projects are additional practice with their own requirements rather than automatically graded weekly submissions. Week labels organize study; they are not an access deadline.
