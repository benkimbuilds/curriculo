export const SUBMISSION_ATTEMPT_STATES = [
  "submitted",
  "evaluating",
  "passed",
  "needs_revision",
  "needs_review",
] as const;

export type SubmissionAttemptState = (typeof SUBMISSION_ATTEMPT_STATES)[number];

export interface SubmissionArtifactSnapshot {
  readonly repositoryUrl: string;
  readonly commitSha: string;
  readonly deploymentUrl: string;
}

export interface SubmissionSnapshot {
  readonly id: string;
  readonly studentId: string;
  readonly projectId: string;
  readonly projectVersion: string;
  readonly rubricVersion: string;
  readonly attemptNumber: number;
  readonly submittedAt: string;
  readonly artifact: Readonly<SubmissionArtifactSnapshot>;
}

export interface SubmissionAttempt {
  readonly submission: Readonly<SubmissionSnapshot>;
  readonly state: SubmissionAttemptState;
  readonly updatedAt: string;
}

export type SubmissionAttemptEvent =
  | { readonly type: "evaluation_started"; readonly at: string }
  | { readonly type: "evaluation_passed"; readonly at: string }
  | { readonly type: "evaluation_failed"; readonly at: string }
  | { readonly type: "evaluation_needs_review"; readonly at: string }
  | {
      readonly type: "staff_resolved";
      readonly at: string;
      readonly outcome: "passed" | "needs_revision";
      readonly reason: string;
    };

