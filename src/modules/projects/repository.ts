import type { SubmissionAttempt, SubmissionAttemptState, SubmissionSnapshot } from "./types";

export interface SubmissionRepository {
  nextAttemptNumber(studentId: string, projectId: string): Promise<number>;
  create(snapshot: Readonly<SubmissionSnapshot>): Promise<Readonly<SubmissionAttempt>>;
  findById(id: string): Promise<Readonly<SubmissionAttempt> | null>;
  listAttempts(studentId: string, projectId: string): Promise<readonly Readonly<SubmissionAttempt>[]>;
  transitionState(
    id: string,
    expectedState: SubmissionAttemptState,
    nextState: SubmissionAttemptState,
    updatedAt: string,
  ): Promise<boolean>;
}
