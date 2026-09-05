export const EVALUATION_STATES = [
  "queued",
  "running",
  "passed",
  "failed",
  "needs_review",
  "error",
] as const;

export type EvaluationState = (typeof EVALUATION_STATES)[number];
export type EvaluationTerminalState = Extract<
  EvaluationState,
  "passed" | "failed" | "needs_review" | "error"
>;

export interface RubricCriterion {
  readonly id: string;
  readonly label: string;
  readonly kind: "deterministic" | "human";
  readonly weight: number;
  readonly required: boolean;
  readonly evidenceDescription: string;
}

export interface RubricDefinition {
  readonly id: string;
  readonly version: string | number;
  readonly passThreshold: number;
  readonly criteria: readonly Readonly<RubricCriterion>[];
}

export interface CriterionResult {
  readonly criterionId: string;
  readonly status: "passed" | "failed" | "needs_review";
  readonly evidence: string;
}

export interface EvaluationResult {
  readonly state: Exclude<EvaluationTerminalState, "error">;
  readonly score: number | null;
  readonly evaluatorVersion: string;
  readonly finalUrl: string | null;
  readonly criteria: readonly Readonly<CriterionResult>[];
  readonly rubricId: string;
  readonly rubricVersion: string;
  readonly rubricCriteria: readonly Readonly<CriterionResult>[];
  readonly reviewReason?: string;
}

export interface EvaluationRun {
  readonly id: string;
  readonly submissionId: string;
  readonly rubricId: string;
  readonly rubricVersion: string;
  readonly evaluatorVersion: string;
  readonly idempotencyKey: string;
  readonly attempt: number;
  readonly maxAttempts: number;
  readonly state: EvaluationState;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly result?: Readonly<EvaluationResult>;
  readonly errorCode?: string;
  readonly override?: {
    readonly staffUserId: string;
    readonly reason: string;
    readonly previousState: EvaluationTerminalState;
  };
}

export type EvaluationRunEvent =
  | { readonly type: "started"; readonly at: string }
  | { readonly type: "completed"; readonly at: string; readonly result: EvaluationResult }
  | { readonly type: "errored"; readonly at: string; readonly errorCode: string }
  | { readonly type: "retry_requested"; readonly at: string }
  | {
      readonly type: "staff_override";
      readonly at: string;
      readonly staffUserId: string;
      readonly reason: string;
      readonly outcome: "passed" | "failed";
    };
