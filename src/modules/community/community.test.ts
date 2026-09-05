import { describe, expect, it } from "vitest";
import { PeerFeedbackService } from "./feedback-service";
import { ModerationService } from "./moderation-service";
import type {
  ContentReportRepository,
  GalleryRepository,
  PeerFeedbackRepository,
} from "./repositories";
import {
  CommunityDomainError,
  DEFAULT_COMMUNITY_FEATURE_FLAGS,
  type ContentReport,
  type GalleryEntry,
  type GalleryViewer,
  type ModerationStatus,
  type PeerFeedback,
} from "./types";
import { decideGalleryAccess } from "./visibility";

const enabled = { galleryEnabled: true, peerFeedbackEnabled: true };
const now = new Date("2026-09-05T12:00:00.000Z");
const clock = { now: () => now };
const ids = { nextId: () => "generated-id" };

const entry: GalleryEntry = {
  id: "entry-1",
  ownerId: "owner-1",
  cohortIds: ["cohort-a"],
  visibility: "cohort",
  moderationStatus: "visible",
  published: true,
  rubricVersionId: "rubric-v1",
  rubricCriterionIds: ["semantic-html"],
};

const cohortViewer: GalleryViewer = {
  userId: "peer-1",
  emailVerified: true,
  memberCohortIds: ["cohort-a"],
  staffedCohortIds: [],
  roles: ["learner"],
};

class GalleryMemory implements GalleryRepository {
  status: ModerationStatus = "visible";
  constructor(private readonly value: GalleryEntry | null = entry) {}
  async findById() {
    return this.value;
  }
  async updateModerationStatus(_id: string, status: ModerationStatus) {
    this.status = status;
  }
}

class FeedbackMemory implements PeerFeedbackRepository {
  saved: PeerFeedback | null = null;
  existing = false;
  async save(feedback: PeerFeedback) {
    this.saved = feedback;
  }
  async hasFeedbackFromAuthor() {
    return this.existing;
  }
}

class ReportMemory implements ContentReportRepository {
  reports = new Map<string, ContentReport>();
  async findById(id: string) {
    return this.reports.get(id) ?? null;
  }
  async hasOpenReport(galleryEntryId: string, reporterId: string) {
    return [...this.reports.values()].some(
      (report) =>
        report.galleryEntryId === galleryEntryId &&
        report.reporterId === reporterId &&
        (report.status === "open" || report.status === "under_review"),
    );
  }
  async save(report: ContentReport) {
    this.reports.set(report.id, report);
  }
}

describe("gallery visibility", () => {
  it("requires verified cohort membership when an entry is cohort scoped", () => {
    expect(decideGalleryAccess(cohortViewer, entry, enabled)).toEqual({
      allowed: true,
      reason: "allowed",
    });
    expect(
      decideGalleryAccess(
        { ...cohortViewer, memberCohortIds: ["cohort-b"] },
        entry,
        enabled,
      ),
    ).toEqual({ allowed: false, reason: "different_cohort" });
    expect(
      decideGalleryAccess(
        { ...cohortViewer, emailVerified: false },
        entry,
        enabled,
      ),
    ).toEqual({ allowed: false, reason: "unverified_viewer" });
  });

  it("keeps social discovery off behind the flag while allowing owner preview", () => {
    expect(
      decideGalleryAccess(cohortViewer, entry, DEFAULT_COMMUNITY_FEATURE_FLAGS)
        .reason,
    ).toBe(
      "feature_disabled",
    );
    expect(
      decideGalleryAccess(
        { ...cohortViewer, userId: entry.ownerId },
        entry,
        DEFAULT_COMMUNITY_FEATURE_FLAGS,
      ),
    ).toEqual({ allowed: true, reason: "owner_preview" });
  });

  it("limits facilitator moderation access to their assigned cohorts", () => {
    const facilitator = {
      ...cohortViewer,
      userId: "staff-1",
      memberCohortIds: [] as const,
      staffedCohortIds: ["cohort-a"] as const,
      roles: ["facilitator"] as const,
    };
    expect(decideGalleryAccess(facilitator, entry, enabled).reason).toBe(
      "staff_moderation",
    );
    expect(
      decideGalleryAccess(
        { ...facilitator, staffedCohortIds: ["cohort-b"] },
        entry,
        enabled,
      ).reason,
    ).toBe("different_cohort");
  });
});

describe("structured peer feedback", () => {
  it("pins feedback to the submission rubric and persists structured selections", async () => {
    const feedback = new FeedbackMemory();
    const service = new PeerFeedbackService(
      new GalleryMemory(),
      feedback,
      clock,
      ids,
      enabled,
    );

    const result = await service.submit(cohortViewer, {
      galleryEntryId: entry.id,
      rubricVersionId: "rubric-v1",
      criteria: [{ criterionId: "semantic-html", mark: "demonstrated" }],
      nextSteps: ["test_edge_cases"],
    });

    expect(result).toEqual(feedback.saved);
    expect(result).toMatchObject({
      authorId: "peer-1",
      rubricVersionId: "rubric-v1",
      nextSteps: ["test_edge_cases"],
    });
    expect(result).not.toHaveProperty("comment");
  });

  it("rejects self reviews and mismatched rubric versions", async () => {
    const service = new PeerFeedbackService(
      new GalleryMemory(),
      new FeedbackMemory(),
      clock,
      ids,
      enabled,
    );
    const input = {
      galleryEntryId: entry.id,
      rubricVersionId: "old-rubric",
      criteria: [{ criterionId: "semantic-html", mark: "demonstrated" as const }],
      nextSteps: [],
    };

    await expect(service.submit(cohortViewer, input)).rejects.toMatchObject({
      code: "invalid_feedback",
    });
    await expect(
      service.submit({ ...cohortViewer, userId: entry.ownerId }, input),
    ).rejects.toBeInstanceOf(CommunityDomainError);
  });
});

describe("report moderation", () => {
  it("does not treat learner cohort membership as a staff assignment", async () => {
    const reports = new ReportMemory();
    reports.reports.set("report-1", {
      id: "report-1",
      galleryEntryId: entry.id,
      reporterId: "peer-1",
      reason: "spam",
      status: "open",
      createdAt: now,
      reviewedAt: null,
      reviewedBy: null,
      resolution: null,
    });
    const service = new ModerationService(new GalleryMemory(), reports, clock, ids, enabled);
    const instructorEnrolledElsewhere: GalleryViewer = {
      userId: "staff-1",
      emailVerified: true,
      memberCohortIds: ["cohort-a"],
      staffedCohortIds: ["cohort-b"],
      roles: ["facilitator"],
    };

    await expect(service.moderate(instructorEnrolledElsewhere, {
      reportId: "report-1",
      nextStatus: "under_review",
    })).rejects.toMatchObject({ code: "forbidden" });
  });

  it("moves a report through review and hides actioned content", async () => {
    const galleries = new GalleryMemory();
    const reports = new ReportMemory();
    const service = new ModerationService(galleries, reports, clock, ids, enabled);
    const report = await service.report(cohortViewer, entry.id, "spam");
    const staff: GalleryViewer = {
      userId: "staff-1",
      emailVerified: true,
      memberCohortIds: [],
      staffedCohortIds: ["cohort-a"],
      roles: ["facilitator"],
    };

    const reviewing = await service.moderate(staff, {
      reportId: report.id,
      nextStatus: "under_review",
    });
    const actioned = await service.moderate(staff, {
      reportId: report.id,
      nextStatus: "actioned",
      resolution: "content_hidden",
    });

    expect(reviewing.status).toBe("under_review");
    expect(actioned).toMatchObject({
      status: "actioned",
      resolution: "content_hidden",
      reviewedBy: "staff-1",
    });
    expect(galleries.status).toBe("hidden");
    await expect(
      service.moderate(staff, {
        reportId: report.id,
        nextStatus: "dismissed",
        resolution: "no_action",
      }),
    ).rejects.toMatchObject({ code: "invalid_transition" });
  });
});
