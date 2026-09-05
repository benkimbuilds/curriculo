export type CommunityRole = "learner" | "facilitator" | "administrator";

export type GalleryVisibility = "private" | "cohort" | "verified_users";

export type ModerationStatus = "visible" | "hidden" | "removed";

export interface CommunityFeatureFlags {
  galleryEnabled: boolean;
  peerFeedbackEnabled: boolean;
}

export const DEFAULT_COMMUNITY_FEATURE_FLAGS: Readonly<CommunityFeatureFlags> =
  Object.freeze({
    galleryEnabled: false,
    peerFeedbackEnabled: false,
  });

export interface GalleryViewer {
  userId: string;
  emailVerified: boolean;
  memberCohortIds: readonly string[];
  staffedCohortIds: readonly string[];
  roles: readonly CommunityRole[];
}

export interface GalleryEntry {
  id: string;
  ownerId: string;
  cohortIds: readonly string[];
  visibility: GalleryVisibility;
  moderationStatus: ModerationStatus;
  published: boolean;
  rubricVersionId: string;
  rubricCriterionIds: readonly string[];
}

export type GalleryAccessReason =
  | "allowed"
  | "owner_preview"
  | "staff_moderation"
  | "feature_disabled"
  | "unverified_viewer"
  | "not_published"
  | "private"
  | "different_cohort"
  | "moderated";

export interface GalleryAccessDecision {
  allowed: boolean;
  reason: GalleryAccessReason;
}

export type RubricFeedbackMark =
  | "demonstrated"
  | "partially_demonstrated"
  | "not_yet_demonstrated"
  | "not_observed";

export interface RubricCriterionFeedback {
  criterionId: string;
  mark: RubricFeedbackMark;
}

export type FeedbackNextStep =
  | "review_requirements"
  | "improve_accessibility"
  | "improve_responsiveness"
  | "improve_code_clarity"
  | "test_edge_cases"
  | "ready_for_resubmission";

export interface PeerFeedback {
  id: string;
  galleryEntryId: string;
  rubricVersionId: string;
  authorId: string;
  criteria: readonly RubricCriterionFeedback[];
  nextSteps: readonly FeedbackNextStep[];
  createdAt: Date;
}

export type ReportReason =
  | "harassment"
  | "hate_or_discrimination"
  | "sexual_content"
  | "personal_information"
  | "spam"
  | "copyright"
  | "other_safety_concern";

export type ReportStatus = "open" | "under_review" | "actioned" | "dismissed";

export interface ContentReport {
  id: string;
  galleryEntryId: string;
  reporterId: string;
  reason: ReportReason;
  status: ReportStatus;
  createdAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  resolution: "content_hidden" | "content_removed" | "no_action" | null;
}

export class CommunityDomainError extends Error {
  constructor(
    public readonly code:
      | "forbidden"
      | "feature_disabled"
      | "entry_not_found"
      | "invalid_feedback"
      | "invalid_transition"
      | "report_not_found",
    message: string,
  ) {
    super(message);
    this.name = "CommunityDomainError";
  }
}
