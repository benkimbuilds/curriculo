import type { EvaluationResult, EvaluationRun, EvaluationState } from "./types";

export interface CreateEvaluationRun {
  readonly id: string;
  readonly submissionId: string;
  readonly rubricId: string;
  readonly rubricVersion: string;
  readonly evaluatorVersion: string;
  readonly idempotencyKey: string;
  readonly maxAttempts: number;
  readonly now: string;
}

export interface EvaluationRunRepository {
  createQueued(input: CreateEvaluationRun): Promise<Readonly<EvaluationRun>>;
  findById(id: string): Promise<Readonly<EvaluationRun> | null>;
  findByIdempotencyKey(key: string): Promise<Readonly<EvaluationRun> | null>;
  claimQueued(id: string, expectedAttempt: number): Promise<Readonly<EvaluationRun> | null>;
  complete(
    id: string,
    expectedState: Extract<EvaluationState, "running">,
    result: Readonly<EvaluationResult>,
  ): Promise<boolean>;
  markNeedsReview(
    id: string,
    expectedState: "queued" | "running",
    errorCode: string,
  ): Promise<boolean>;
  saveOverride(run: Readonly<EvaluationRun>): Promise<void>;
}
