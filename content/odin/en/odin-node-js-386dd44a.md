# Project: Photo Tagging App

## Find the characters

Build a game inspired by [Where's Waldo](http://en.wikipedia.org/wiki/Where's_Wally%3F). A busy image contains characters or objects; the player targets a region, selects a character and receives correct/incorrect feedback. You may use your own image and targets.

## Assignment

1. Plan UI, schema and flow. Choose an image you may use and identify target positions. Store correct coordinates in PostgreSQL, not in the browser bundle.
2. Build React interaction without a backend first: clicking opens a target box and character menu; clicking elsewhere dismisses them.
3. Normalize coordinates across rendered sizes. Horizontal position is `(clientX - rect.left) / rect.width`; use the actual image region and account for `object-fit` letterboxing.
4. Add Route Handlers for starting rounds and validating selections. Submit round ID, character and normalized coordinates; the server compares them with stored bounds.
5. Connect feedback and markers: correct guesses mark targets; wrong guesses explain failure. Close the selection box after responding.
6. Record start and finish on the server. A client timer is display-only, never the authoritative score. Complete a round once, only after all targets are found.
7. On completion, request a public leaderboard name. Validate length, avoid personal information and associate it with the completed round.
8. Play-test, push to GitHub and deploy.

## State and trust

Anonymous rounds still need ownership. Use a securely managed opaque session cookie or a random round identifier paired with an access secret. Knowing an ID must not let someone finish another player's round. Start responses must not expose correct coordinates.

Store found targets and timing server-side. Repeating a correct guess must not increment progress twice; enforce uniqueness of round and character.

## Acceptance criteria

- Target box and menu open and dismiss predictably.
- The same target is discoverable at small and large sizes.
- Incorrect guesses add no marker or progress.
- Validation happens against private server data.
- The server calculates duration and rejects another player's or an already-completed round.
- A score is recorded once with a validated name.
- Leaderboards sort correctly and exclude incomplete rounds.
- README includes normalization and tampered-request checks.

## Extra credit

Store multiple images with their targets and let users choose before starting. Bind each round to its image so coordinates from another board cannot be submitted.

