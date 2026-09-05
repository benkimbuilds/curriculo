import type {
  CommunityClock,
  CommunityIdGenerator,
  ContentReportRepository,
  GalleryRepository,
} from "./repositories";
import {
  CommunityDomainError,
  type CommunityFeatureFlags,
  type ContentReport,
  type GalleryViewer,
  type ReportReason,
  type ReportStatus,
} from "./types";
import { decideGalleryAccess } from "./visibility";

export interface ModerateReportInput {
  reportId: string;
  nextStatus: Exclude<ReportStatus, "open">;
  resolution?: "content_hidden" | "content_removed" | "no_action";
}

const ALLOWED_TRANSITIONS: Record<ReportStatus, readonly ReportStatus[]> = {
  open: ["under_review", "actioned", "dismissed"],
  under_review: ["actioned", "dismissed"],
  actioned: [],
  dismissed: [],
};

function canModerate(actor: GalleryViewer, cohortIds: readonly string[]): boolean {
  return (
    actor.roles.includes("administrator") ||
    (actor.roles.includes("facilitator") &&
      cohortIds.some((cohortId) => actor.staffedCohortIds.includes(cohortId)))
  );
}

export class ModerationService {
  constructor(
    private readonly galleries: GalleryRepository,
    private readonly reports: ContentReportRepository,
    private readonly clock: CommunityClock,
    private readonly ids: CommunityIdGenerator,
    private readonly flags: CommunityFeatureFlags,
  ) {}

  async report(
    actor: GalleryViewer,
    galleryEntryId: string,
    reason: ReportReason,
  ): Promise<ContentReport> {
    const entry = await this.galleries.findById(galleryEntryId);
    if (!entry) {
      throw new CommunityDomainError("entry_not_found", "Gallery entry not found.");
    }

    const access = decideGalleryAccess(actor, entry, this.flags);
    if (!access.allowed || actor.userId === entry.ownerId) {
      throw new CommunityDomainError(
        "forbidden",
        "Only viewers of another learner's project may report it.",
      );
    }

    if (await this.reports.hasOpenReport(entry.id, actor.userId)) {
      throw new CommunityDomainError(
        "invalid_transition",
        "This viewer already has an unresolved report for the project.",
      );
    }

    const report: ContentReport = {
      id: this.ids.nextId(),
      galleryEntryId: entry.id,
      reporterId: actor.userId,
      reason,
      status: "open",
      createdAt: this.clock.now(),
      reviewedAt: null,
      reviewedBy: null,
      resolution: null,
    };
    await this.reports.save(report);
    return report;
  }

  async moderate(
    actor: GalleryViewer,
    input: ModerateReportInput,
  ): Promise<ContentReport> {
    const report = await this.reports.findById(input.reportId);
    if (!report) {
      throw new CommunityDomainError("report_not_found", "Report not found.");
    }

    const entry = await this.galleries.findById(report.galleryEntryId);
    if (!entry) {
      throw new CommunityDomainError("entry_not_found", "Gallery entry not found.");
    }
    if (!canModerate(actor, entry.cohortIds)) {
      throw new CommunityDomainError(
        "forbidden",
        "Facilitators may only moderate their assigned cohorts.",
      );
    }

    if (!ALLOWED_TRANSITIONS[report.status].includes(input.nextStatus)) {
      throw new CommunityDomainError(
        "invalid_transition",
        `A ${report.status} report cannot transition to ${input.nextStatus}.`,
      );
    }

    if (input.nextStatus === "actioned" && !input.resolution) {
      throw new CommunityDomainError(
        "invalid_transition",
        "Actioned reports require a resolution.",
      );
    }
    if (input.nextStatus === "dismissed" && input.resolution !== "no_action") {
      throw new CommunityDomainError(
        "invalid_transition",
        "Dismissed reports must use the no_action resolution.",
      );
    }
    if (input.nextStatus === "under_review" && input.resolution) {
      throw new CommunityDomainError(
        "invalid_transition",
        "Reports under review cannot have a final resolution.",
      );
    }

    if (input.resolution === "content_hidden") {
      await this.galleries.updateModerationStatus(report.galleryEntryId, "hidden");
    } else if (input.resolution === "content_removed") {
      await this.galleries.updateModerationStatus(report.galleryEntryId, "removed");
    }

    const reviewed: ContentReport = {
      ...report,
      status: input.nextStatus,
      resolution: input.resolution ?? null,
      reviewedAt: this.clock.now(),
      reviewedBy: actor.userId,
    };
    await this.reports.save(reviewed);
    return reviewed;
  }
}
