import type { EvaluationRun, EvaluationRunEvent, EvaluationState } from "./types";

export class InvalidEvaluationTransitionError extends Error {
  constructor(from: EvaluationState, event: EvaluationRunEvent["type"]) {
    super(`Cannot apply ${event} to evaluation in ${from}`);
    this.name = "InvalidEvaluationTransitionError";
  }
}

function normalizedTimestamp(value: string): string {
  if (!value || Number.isNaN(Date.parse(value))) throw new Error("Transition timestamp is invalid");
  return new Date(value).toISOString();
}

function freezeResult(result: NonNullable<EvaluationRun["result"]>) {
  return Object.freeze({
    ...result,
    criteria: Object.freeze(result.criteria.map((criterion) => Object.freeze({ ...criterion }))),
    rubricCriteria: Object.freeze(
      result.rubricCriteria.map((criterion) => Object.freeze({ ...criterion })),
    ),
  });
}

export function transitionEvaluationRun(
  run: Readonly<EvaluationRun>,
  event: EvaluationRunEvent,
): Readonly<EvaluationRun> {
  const updatedAt = normalizedTimestamp(event.at);

  if (event.type === "started" && run.state === "queued") {
    if (run.attempt >= run.maxAttempts) throw new Error("Evaluation retry limit reached");
    return Object.freeze({ ...run, state: "running", attempt: run.attempt + 1, updatedAt });
  }

  if (event.type === "completed" && run.state === "running") {
    return Object.freeze({
      ...run,
      state: event.result.state,
      result: freezeResult(event.result),
      updatedAt,
    });
  }

  if (event.type === "errored" && (run.state === "queued" || run.state === "running")) {
    const result = Object.freeze({
      state: "needs_review" as const,
      score: null,
      evaluatorVersion: run.evaluatorVersion,
      finalUrl: null,
      criteria: Object.freeze([]),
      rubricId: run.rubricId,
      rubricVersion: run.rubricVersion,
      rubricCriteria: Object.freeze([]),
      reviewReason: "The automated evaluator could not finish safely.",
    });
    return Object.freeze({
      ...run,
      state: "needs_review",
      errorCode: event.errorCode,
      result,
      updatedAt,
    });
  }

  if (event.type === "retry_requested" && run.state === "needs_review") {
    if (run.attempt >= run.maxAttempts) throw new Error("Evaluation retry limit reached");
    return Object.freeze({
      ...run,
      state: "queued",
      result: undefined,
      errorCode: undefined,
      updatedAt,
    });
  }

  if (
    event.type === "staff_override" &&
    (run.state === "passed" ||
      run.state === "failed" ||
      run.state === "needs_review" ||
      run.state === "error")
  ) {
    if (!event.staffUserId.trim()) throw new Error("A staff override requires a staff user");
    if (!event.reason.trim()) throw new Error("A staff override requires a reason");
    return Object.freeze({
      ...run,
      state: event.outcome,
      override: Object.freeze({
        staffUserId: event.staffUserId,
        reason: event.reason.trim(),
        previousState: run.state,
      }),
      updatedAt,
    });
  }

  throw new InvalidEvaluationTransitionError(run.state, event.type);
}
