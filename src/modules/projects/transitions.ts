import type {
  SubmissionAttempt,
  SubmissionAttemptEvent,
  SubmissionAttemptState,
} from "./types";

export class InvalidSubmissionTransitionError extends Error {
  constructor(from: SubmissionAttemptState, event: SubmissionAttemptEvent["type"]) {
    super(`Cannot apply ${event} to submission in ${from}`);
    this.name = "InvalidSubmissionTransitionError";
  }
}

function assertTimestamp(value: string): string {
  if (!value || Number.isNaN(Date.parse(value))) throw new Error("Transition timestamp is invalid");
  return new Date(value).toISOString();
}

export function transitionSubmissionAttempt(
  attempt: Readonly<SubmissionAttempt>,
  event: SubmissionAttemptEvent,
): Readonly<SubmissionAttempt> {
  const transitions: Partial<
    Record<SubmissionAttemptState, Partial<Record<SubmissionAttemptEvent["type"], SubmissionAttemptState>>>
  > = {
    submitted: { evaluation_started: "evaluating", evaluation_needs_review: "needs_review" },
    evaluating: {
      evaluation_passed: "passed",
      evaluation_failed: "needs_revision",
      evaluation_needs_review: "needs_review",
    },
  };

  let nextState = transitions[attempt.state]?.[event.type];
  if (event.type === "staff_resolved" && attempt.state === "needs_review") {
    if (!event.reason.trim()) throw new Error("A staff resolution requires a reason");
    nextState = event.outcome;
  }
  if (!nextState) throw new InvalidSubmissionTransitionError(attempt.state, event.type);

  return Object.freeze({
    submission: attempt.submission,
    state: nextState,
    updatedAt: assertTimestamp(event.at),
  });
}

