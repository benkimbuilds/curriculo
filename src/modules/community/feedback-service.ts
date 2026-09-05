import type {
  CommunityClock,
  CommunityIdGenerator,
  GalleryRepository,
  PeerFeedbackRepository,
} from "./repositories";
import {
  CommunityDomainError,
  type CommunityFeatureFlags,
  type FeedbackNextStep,
  type GalleryViewer,
  type PeerFeedback,
  type RubricCriterionFeedback,
} from "./types";
import { decideGalleryAccess } from "./visibility";

export interface SubmitPeerFeedbackInput {
  galleryEntryId: string;
  rubricVersionId: string;
  criteria: readonly RubricCriterionFeedback[];
  nextSteps: readonly FeedbackNextStep[];
}

export class PeerFeedbackService {
  constructor(
    private readonly galleries: GalleryRepository,
    private readonly feedback: PeerFeedbackRepository,
    private readonly clock: CommunityClock,
    private readonly ids: CommunityIdGenerator,
    private readonly flags: CommunityFeatureFlags,
  ) {}

  async submit(
    actor: GalleryViewer,
    input: SubmitPeerFeedbackInput,
  ): Promise<PeerFeedback> {
    if (!this.flags.peerFeedbackEnabled) {
      throw new CommunityDomainError(
        "feature_disabled",
        "Peer feedback is not enabled.",
      );
    }

    const entry = await this.galleries.findById(input.galleryEntryId);
    if (!entry) {
      throw new CommunityDomainError("entry_not_found", "Gallery entry not found.");
    }

    const access = decideGalleryAccess(actor, entry, this.flags);
    if (!access.allowed || actor.userId === entry.ownerId) {
      throw new CommunityDomainError(
        "forbidden",
        "Feedback may only be submitted on another learner's visible project.",
      );
    }

    if (input.rubricVersionId !== entry.rubricVersionId) {
      throw new CommunityDomainError(
        "invalid_feedback",
        "Feedback must use the rubric version pinned to the submission.",
      );
    }

    const criterionIds = input.criteria.map(({ criterionId }) => criterionId.trim());
    const requiredCriterionIds = new Set(entry.rubricCriterionIds);
    if (
      criterionIds.length === 0 ||
      criterionIds.some((criterionId) => criterionId.length === 0) ||
      new Set(criterionIds).size !== criterionIds.length ||
      criterionIds.length !== requiredCriterionIds.size ||
      criterionIds.some((criterionId) => !requiredCriterionIds.has(criterionId))
    ) {
      throw new CommunityDomainError(
        "invalid_feedback",
        "Feedback must mark every distinct criterion in the pinned rubric.",
      );
    }

    if (new Set(input.nextSteps).size !== input.nextSteps.length) {
      throw new CommunityDomainError(
        "invalid_feedback",
        "Next-step selections must be distinct.",
      );
    }

    if (
      await this.feedback.hasFeedbackFromAuthor(input.galleryEntryId, actor.userId)
    ) {
      throw new CommunityDomainError(
        "invalid_feedback",
        "A learner may submit one structured review per project attempt.",
      );
    }

    const result: PeerFeedback = {
      id: this.ids.nextId(),
      galleryEntryId: entry.id,
      rubricVersionId: entry.rubricVersionId,
      authorId: actor.userId,
      criteria: input.criteria.map((criterion, index) => ({
        ...criterion,
        criterionId: criterionIds[index],
      })),
      nextSteps: [...input.nextSteps],
      createdAt: this.clock.now(),
    };

    await this.feedback.save(result);
    return result;
  }
}
