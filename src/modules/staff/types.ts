export type StaffRole = "facilitator" | "administrator";

export interface StaffActor {
  userId: string;
  roles: readonly StaffRole[];
  assignedCohortIds: readonly string[];
}

export type PaceStatus =
  | "self_paced"
  | "ahead"
  | "on_track"
  | "behind"
  | "complete";

export type ActivityStatus = "active" | "inactive" | "no_activity";

export type SubmissionStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "resubmitted"
  | "accepted";

export type EvaluationStatus =
  | "not_applicable"
  | "pending"
  | "running"
  | "passed"
  | "failed"
  | "needs_review"
  | "error"
  | "overridden";

export type AttentionReason =
  | "behind"
  | "inactive"
  | "overdue_work"
  | "evaluation_failed"
  | "needs_review";

export interface LearnerRosterEvidence {
  userId: string;
  cohortId: string;
  displayName: string;
  email: string;
  completedRequiredItems: number;
  expectedCompletedItems: number | null;
  totalRequiredItems: number;
  lastActivityAt: Date | null;
  lastSubmissionAt: Date | null;
  submissionStatus: SubmissionStatus;
  evaluationStatus: EvaluationStatus;
  hasOverdueRequiredWork: boolean;
}

export interface RosterRow extends LearnerRosterEvidence {
  paceStatus: PaceStatus;
  activityStatus: ActivityStatus;
  attentionReasons: readonly AttentionReason[];
}

export interface RosterFilters {
  search?: string;
  pace?: readonly PaceStatus[];
  activity?: readonly ActivityStatus[];
  submission?: readonly SubmissionStatus[];
  evaluation?: readonly EvaluationStatus[];
  needsAttention?: boolean;
}

export interface RosterAggregates {
  total: number;
  pace: Record<PaceStatus, number>;
  activity: Record<ActivityStatus, number>;
  submission: Record<SubmissionStatus, number>;
  evaluation: Record<EvaluationStatus, number>;
  needingAttention: number;
}

export interface RosterResult {
  rows: readonly RosterRow[];
  aggregates: RosterAggregates;
  filteredCount: number;
}

export type InterventionCategory =
  | "academic_support"
  | "attendance_follow_up"
  | "technical_support"
  | "wellbeing_check_in"
  | "accommodation"
  | "other";

export interface InterventionNote {
  id: string;
  cohortId: string;
  learnerId: string;
  authorId: string;
  category: InterventionCategory;
  note: string;
  followUpAt: Date | null;
  createdAt: Date;
}

export class StaffDomainError extends Error {
  constructor(
    public readonly code:
      | "forbidden"
      | "learner_not_found"
      | "invalid_note"
      | "invalid_evidence",
    message: string,
  ) {
    super(message);
    this.name = "StaffDomainError";
  }
}
