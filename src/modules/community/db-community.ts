import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";

import { db, type Database } from "@/db";
import {
  contentReports,
  cohorts,
  enrollments,
  featureFlags,
  galleryComments,
  galleryStars,
  moderationActions,
  organizations,
  peerFeedback,
  profiles,
  programs,
  programVersions,
  submissions,
  user,
} from "@/db/schema";
import { requirePermission } from "@/modules/authorization/service";
import type { AuthorizationContext } from "@/modules/authorization/policy";
import { listCurriculumWeeks } from "@/modules/curriculum";
import { getEnvironment } from "@/shared/env";
import { AuthorizationDeniedError, ResourceNotFoundError } from "@/shared/errors";

import type {
  CommunityClock,
  CommunityIdGenerator,
  ContentReportRepository,
  GalleryRepository,
  PeerFeedbackRepository,
} from "./repositories";
import type {
  CommunityFeatureFlags,
  ContentReport,
  GalleryEntry,
  GalleryViewer,
  ModerationStatus,
  PeerFeedback,
  ReportReason,
  ReportStatus,
} from "./types";
import { CommunityDomainError } from "./types";
import { decideGalleryAccess } from "./visibility";

export interface GalleryListItem {
  id: string;
  title: string;
  tagline: string | null;
  author: string;
  authorBio: string | null;
  authorGithubUsername: string | null;
  week: number;
  description: string;
  technology: string;
  isDemo: boolean;
  reviewCount: number;
  starCount: number;
  commentCount: number;
  viewerHasStarred: boolean;
  visibility: GalleryEntry["visibility"];
}

export interface GalleryCommentView {
  id: string;
  body: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
  canDelete: boolean;
}

export interface GalleryProjectDetail extends GalleryListItem {
  ownerId: string;
  repositoryUrl: string;
  deploymentUrl: string | null;
  commitSha: string;
  submittedAt: Date;
  rubricVersionId: string;
  rubricCriteria: readonly { id: string; title: string; description: string }[];
  feedback: readonly PeerFeedback[];
  comments: readonly GalleryCommentView[];
}

export interface CommunityRequestContext {
  organizationId: string;
  authorization: AuthorizationContext;
  viewer: GalleryViewer;
  flags: CommunityFeatureFlags;
}

function projectMetadata(projectId: string) {
  const week = listCurriculumWeeks({ locale: "es-MX" }).find(
    (item) => item.project.id === projectId,
  );
  return week
    ? {
        week: week.week,
        title: week.project.title,
        description: week.project.summary,
        technology: week.week <= 1 ? "HTML" : week.week <= 3 ? "CSS / JS" : "Web",
        rubricVersionId: week.project.rubric.id,
        rubricCriteria: week.project.rubric.criteria.map(({ id, title, description }) => ({
          id,
          title,
          description,
        })),
      }
    : {
        week: 0,
        title: projectId,
        description: "Proyecto entregado",
        technology: "Web",
        rubricVersionId: "unknown-rubric",
        rubricCriteria: [],
      };
}

function extractRubricVersion(snapshot: Record<string, unknown>, fallback: string): string {
  return typeof snapshot.rubricVersion === "string" ? snapshot.rubricVersion : fallback;
}

function galleryDisplayFromSnapshot(
  projectId: string,
  snapshot: Record<string, unknown>,
) {
  const metadata = projectMetadata(projectId);
  const isDemo = snapshot.isDemo === true;
  return {
    ...metadata,
    isDemo,
    title:
      isDemo && typeof snapshot.galleryTitle === "string"
        ? snapshot.galleryTitle
        : metadata.title,
    tagline:
      isDemo && typeof snapshot.galleryTagline === "string"
        ? snapshot.galleryTagline
        : null,
    description:
      isDemo && typeof snapshot.galleryDescription === "string"
        ? snapshot.galleryDescription
        : metadata.description,
    technology:
      isDemo && typeof snapshot.galleryTechnology === "string"
        ? snapshot.galleryTechnology
        : metadata.technology,
    rubricVersionId: extractRubricVersion(snapshot, metadata.rubricVersionId),
  };
}

function moderationStatusFor(
  actions: readonly { action: string }[],
): ModerationStatus {
  if (actions.some(({ action }) => action === "content_removed")) return "removed";
  if (actions.some(({ action }) => action === "content_hidden")) return "hidden";
  return "visible";
}

function mapViewer(userId: string, authorization: AuthorizationContext): GalleryViewer {
  const roles: GalleryViewer["roles"] = authorization.organizationRoles.includes(
    "developer_administrator",
  ) || authorization.organizationRoles.includes("administrator")
    ? ["administrator"]
    : authorization.organizationRoles.includes("instructor")
      ? ["facilitator"]
      : ["learner"];
  return {
    userId,
    emailVerified: authorization.verified,
    memberCohortIds: authorization.memberCohortIds ?? [],
    staffedCohortIds: authorization.staffedCohortIds ?? [],
    roles,
  };
}

export async function resolveDefaultOrganizationId(
  database: Database = db,
): Promise<string> {
  const [organization] = await database
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, getEnvironment().DEFAULT_ORGANIZATION_SLUG))
    .limit(1);
  if (!organization) throw new ResourceNotFoundError("Organization");
  return organization.id;
}

export async function loadCommunityFlags(
  database: Database = db,
): Promise<CommunityFeatureFlags> {
  const [flag] = await database
    .select({ enabled: featureFlags.enabled })
    .from(featureFlags)
    .where(eq(featureFlags.key, "social_features"))
    .limit(1);
  const enabled = getEnvironment().SOCIAL_FEATURES_ENABLED && flag?.enabled === true;
  return { galleryEnabled: enabled, peerFeedbackEnabled: enabled };
}

export async function requireCommunityContext(
  userId: string,
  permission: "gallery:read" | "peer-feedback:create" | "moderation:manage",
  database: Database = db,
): Promise<CommunityRequestContext> {
  const organizationId = await resolveDefaultOrganizationId(database);
  const authorization = await requirePermission(
    userId,
    organizationId,
    permission,
    database,
  );
  const candidateCohortIds = [
    ...(authorization.memberCohortIds ?? []),
    ...(authorization.staffedCohortIds ?? []),
  ];
  const scopedCohorts = candidateCohortIds.length
    ? await database
        .select({ id: cohorts.id })
        .from(cohorts)
        .where(
          and(
            eq(cohorts.organizationId, organizationId),
            inArray(cohorts.id, candidateCohortIds),
          ),
        )
    : [];
  const scopedIds = new Set(scopedCohorts.map(({ id }) => id));
  const scopedAuthorization: AuthorizationContext = {
    ...authorization,
    memberCohortIds: (authorization.memberCohortIds ?? []).filter((id) =>
      scopedIds.has(id),
    ),
    staffedCohortIds: (authorization.staffedCohortIds ?? []).filter((id) =>
      scopedIds.has(id),
    ),
  };
  return {
    organizationId,
    authorization: scopedAuthorization,
    viewer: mapViewer(userId, scopedAuthorization),
    flags: await loadCommunityFlags(database),
  };
}

type SubmissionGalleryRow = {
  id: string;
  ownerId: string;
  projectId: string;
  snapshot: Record<string, unknown>;
  cohortId: string | null;
  repositoryUrl: string;
  deploymentUrl: string | null;
  commitSha: string;
  submittedAt: Date;
  profileVisible: boolean | null;
  chosenName: string | null;
  accountName: string;
  ownerVerified: boolean;
  ownerIsMinor: boolean | null;
  bio: string | null;
  githubUsername: string | null;
};

async function loadSubmissionRows(
  database: Database,
  organizationId: string,
  submissionIds?: readonly string[],
): Promise<SubmissionGalleryRow[]> {
  if (submissionIds?.length === 0) return [];
  const where = and(
    eq(submissions.status, "passed"),
    eq(programs.organizationId, organizationId),
    submissionIds ? inArray(submissions.id, [...submissionIds]) : undefined,
  );
  return database
    .select({
      id: submissions.id,
      ownerId: enrollments.userId,
      projectId: submissions.projectId,
      snapshot: submissions.snapshot,
      cohortId: enrollments.cohortId,
      repositoryUrl: submissions.repositoryUrl,
      deploymentUrl: submissions.deploymentUrl,
      commitSha: submissions.commitSha,
      submittedAt: submissions.submittedAt,
      profileVisible: profiles.profileVisible,
      chosenName: profiles.chosenName,
      accountName: user.name,
      ownerVerified: user.emailVerified,
      ownerIsMinor: profiles.isMinor,
      bio: profiles.bio,
      githubUsername: profiles.githubUsername,
    })
    .from(submissions)
    .innerJoin(enrollments, eq(enrollments.id, submissions.enrollmentId))
    .innerJoin(
      programVersions,
      eq(programVersions.id, enrollments.programVersionId),
    )
    .innerJoin(programs, eq(programs.id, programVersions.programId))
    .innerJoin(user, eq(user.id, enrollments.userId))
    .leftJoin(profiles, eq(profiles.userId, user.id))
    .where(where)
    .orderBy(desc(submissions.submittedAt));
}

async function loadModerationByTarget(
  database: Database,
  ids: readonly string[],
): Promise<Map<string, ModerationStatus>> {
  if (!ids.length) return new Map();
  const rows = await database
    .select({ targetId: moderationActions.targetId, action: moderationActions.action })
    .from(moderationActions)
    .where(
      and(
        eq(moderationActions.targetType, "submission"),
        inArray(moderationActions.targetId, [...ids]),
      ),
    )
    .orderBy(desc(moderationActions.createdAt));
  const grouped = new Map<string, { action: string }[]>();
  for (const row of rows) grouped.set(row.targetId, [...(grouped.get(row.targetId) ?? []), row]);
  return new Map(
    [...grouped].map(([id, actions]) => [id, moderationStatusFor(actions)]),
  );
}

function toGalleryEntry(
  row: SubmissionGalleryRow,
  moderationStatus: ModerationStatus,
): GalleryEntry {
  const project = galleryDisplayFromSnapshot(row.projectId, row.snapshot);
  return {
    id: row.id,
    ownerId: row.ownerId,
    cohortIds: row.cohortId ? [row.cohortId] : [],
    visibility: row.profileVisible && row.ownerIsMinor === false
      ? row.cohortId
        ? "cohort"
        : "verified_users"
      : "private",
    moderationStatus,
    published: row.ownerVerified,
    rubricVersionId: project.rubricVersionId,
    rubricCriterionIds: project.rubricCriteria.map(({ id }) => id),
  };
}

function publicAuthorProfile(row: SubmissionGalleryRow): {
  authorBio: string | null;
  authorGithubUsername: string | null;
} {
  const visible = row.profileVisible === true && row.ownerIsMinor === false;
  if (!visible) return { authorBio: null, authorGithubUsername: null };
  const bio = row.bio?.trim() || null;
  const githubUsername = row.githubUsername?.trim() || null;
  return { authorBio: bio, authorGithubUsername: githubUsername };
}

async function loadEngagementForSubmissions(
  database: Database,
  submissionIds: readonly string[],
  viewerId?: string,
): Promise<{
  starCounts: Map<string, number>;
  commentCounts: Map<string, number>;
  starredByViewer: Set<string>;
}> {
  const starCounts = new Map<string, number>();
  const commentCounts = new Map<string, number>();
  const starredByViewer = new Set<string>();
  if (!submissionIds.length) return { starCounts, commentCounts, starredByViewer };

  const [starRows, commentRows, viewerStars] = await Promise.all([
    database
      .select({
        submissionId: galleryStars.submissionId,
        count: sql<number>`count(*)::int`,
      })
      .from(galleryStars)
      .where(inArray(galleryStars.submissionId, [...submissionIds]))
      .groupBy(galleryStars.submissionId),
    database
      .select({
        submissionId: galleryComments.submissionId,
        count: sql<number>`count(*)::int`,
      })
      .from(galleryComments)
      .where(
        and(
          inArray(galleryComments.submissionId, [...submissionIds]),
          eq(galleryComments.moderationStatus, "visible"),
        ),
      )
      .groupBy(galleryComments.submissionId),
    viewerId
      ? database
          .select({ submissionId: galleryStars.submissionId })
          .from(galleryStars)
          .where(
            and(
              inArray(galleryStars.submissionId, [...submissionIds]),
              eq(galleryStars.userId, viewerId),
            ),
          )
      : Promise.resolve([] as { submissionId: string }[]),
  ]);

  for (const row of starRows) starCounts.set(row.submissionId, Number(row.count));
  for (const row of commentRows) commentCounts.set(row.submissionId, Number(row.count));
  for (const row of viewerStars) starredByViewer.add(row.submissionId);
  return { starCounts, commentCounts, starredByViewer };
}

function assertCommentBody(raw: string): string {
  const body = raw.trim().replace(/\s+/g, " ");
  if (body.length < 2 || body.length > 600) {
    throw new CommunityDomainError("invalid_feedback", "COMMENT_LENGTH");
  }
  if (/(https?:\/\/|www\.|@[\w.-]+\.[a-z]{2,}|\+?\d[\d\s().-]{7,}\d)/i.test(body)) {
    throw new CommunityDomainError("invalid_feedback", "COMMENT_UNSAFE");
  }
  return body;
}

export class DrizzleGalleryRepository implements GalleryRepository {
  constructor(
    private readonly organizationId: string,
    private readonly database: Database = db,
    private readonly actorId?: string,
  ) {}

  async findById(id: string): Promise<GalleryEntry | null> {
    const [row] = await loadSubmissionRows(this.database, this.organizationId, [id]);
    if (!row) return null;
    const moderation = await loadModerationByTarget(this.database, [id]);
    return toGalleryEntry(row, moderation.get(id) ?? "visible");
  }

  async updateModerationStatus(id: string, status: ModerationStatus): Promise<void> {
    if (!this.actorId) throw new Error("A moderation actor is required.");
    await this.database.insert(moderationActions).values({
      actorUserId: this.actorId,
      action: status === "removed" ? "content_removed" : "content_hidden",
      targetType: "submission",
      targetId: id,
      reason: "Resolved from the moderation queue",
    });
  }
}

export class DrizzlePeerFeedbackRepository implements PeerFeedbackRepository {
  constructor(private readonly database: Database = db) {}

  async save(feedback: PeerFeedback): Promise<void> {
    await this.database.insert(peerFeedback).values({
      id: feedback.id,
      submissionId: feedback.galleryEntryId,
      reviewerUserId: feedback.authorId,
      rubricVersion: feedback.rubricVersionId,
      responses: { criteria: feedback.criteria, nextSteps: feedback.nextSteps },
      submittedAt: feedback.createdAt,
    });
  }

  async hasFeedbackFromAuthor(galleryEntryId: string, authorId: string): Promise<boolean> {
    const [existing] = await this.database
      .select({ id: peerFeedback.id })
      .from(peerFeedback)
      .where(
        and(
          eq(peerFeedback.submissionId, galleryEntryId),
          eq(peerFeedback.reviewerUserId, authorId),
        ),
      )
      .limit(1);
    return Boolean(existing);
  }
}

function fromDatabaseReport(row: typeof contentReports.$inferSelect): ContentReport {
  const statuses: Record<typeof row.status, ReportStatus> = {
    open: "open",
    reviewing: "under_review",
    resolved: "actioned",
    dismissed: "dismissed",
  };
  return {
    id: row.id,
    galleryEntryId: row.targetId,
    reporterId: row.reporterUserId,
    reason: row.reasonCode as ReportReason,
    status: statuses[row.status],
    createdAt: row.createdAt,
    reviewedAt: row.resolvedAt,
    reviewedBy: row.assignedToUserId,
    resolution: row.resolution as ContentReport["resolution"],
  };
}

export class DrizzleContentReportRepository implements ContentReportRepository {
  constructor(private readonly database: Database = db) {}

  async findById(id: string): Promise<ContentReport | null> {
    const [report] = await this.database
      .select()
      .from(contentReports)
      .where(and(eq(contentReports.id, id), eq(contentReports.targetType, "submission")))
      .limit(1);
    return report ? fromDatabaseReport(report) : null;
  }

  async hasOpenReport(galleryEntryId: string, reporterId: string): Promise<boolean> {
    const [report] = await this.database
      .select({ id: contentReports.id })
      .from(contentReports)
      .where(
        and(
          eq(contentReports.targetType, "submission"),
          eq(contentReports.targetId, galleryEntryId),
          eq(contentReports.reporterUserId, reporterId),
          or(eq(contentReports.status, "open"), eq(contentReports.status, "reviewing")),
        ),
      )
      .limit(1);
    return Boolean(report);
  }

  async save(report: ContentReport): Promise<void> {
    const statuses: Record<ReportStatus, typeof contentReports.$inferInsert.status> = {
      open: "open",
      under_review: "reviewing",
      actioned: "resolved",
      dismissed: "dismissed",
    };
    await this.database
      .insert(contentReports)
      .values({
        id: report.id,
        reporterUserId: report.reporterId,
        targetType: "submission",
        targetId: report.galleryEntryId,
        reasonCode: report.reason,
        status: statuses[report.status],
        assignedToUserId: report.reviewedBy,
        resolution: report.resolution,
        resolvedAt: report.status === "under_review" ? null : report.reviewedAt,
      })
      .onConflictDoUpdate({
        target: contentReports.id,
        set: {
          status: statuses[report.status],
          assignedToUserId: report.reviewedBy,
          resolution: report.resolution,
          resolvedAt: report.status === "under_review" ? null : report.reviewedAt,
          updatedAt: new Date(),
        },
      });
  }
}

export const systemCommunityClock: CommunityClock = { now: () => new Date() };
export const cryptoCommunityIds: CommunityIdGenerator = { nextId: () => crypto.randomUUID() };

function parseFeedback(row: typeof peerFeedback.$inferSelect): PeerFeedback | null {
  const responses = row.responses as {
    criteria?: PeerFeedback["criteria"];
    nextSteps?: PeerFeedback["nextSteps"];
  };
  if (!Array.isArray(responses.criteria) || !Array.isArray(responses.nextSteps)) return null;
  return {
    id: row.id,
    galleryEntryId: row.submissionId,
    rubricVersionId: row.rubricVersion,
    authorId: row.reviewerUserId,
    criteria: responses.criteria,
    nextSteps: responses.nextSteps,
    createdAt: row.submittedAt,
  };
}

export async function listGalleryForViewer(
  userId: string,
  database: Database = db,
): Promise<{ enabled: boolean; entries: GalleryListItem[] }> {
  const context = await requireCommunityContext(userId, "gallery:read", database);
  if (!context.flags.galleryEnabled) return { enabled: false, entries: [] };
  const allRows = await loadSubmissionRows(database, context.organizationId);
  const seenProjects = new Set<string>();
  const rows = allRows.filter((row) => {
    const key = `${row.ownerId}:${row.projectId}`;
    if (seenProjects.has(key)) return false;
    seenProjects.add(key);
    return true;
  });
  const moderation = await loadModerationByTarget(database, rows.map(({ id }) => id));
  const visibleRows = rows.filter((row) =>
    decideGalleryAccess(
      context.viewer,
      toGalleryEntry(row, moderation.get(row.id) ?? "visible"),
      context.flags,
    ).allowed,
  );
  const ids = visibleRows.map(({ id }) => id);
  const feedbackRows = ids.length
    ? await database
        .select({ submissionId: peerFeedback.submissionId })
        .from(peerFeedback)
        .where(inArray(peerFeedback.submissionId, ids))
    : [];
  const reviewCounts = new Map<string, number>();
  for (const row of feedbackRows) {
    reviewCounts.set(row.submissionId, (reviewCounts.get(row.submissionId) ?? 0) + 1);
  }
  const engagement = await loadEngagementForSubmissions(database, ids, userId);
  return {
    enabled: true,
    entries: visibleRows.map((row) => {
      const metadata = galleryDisplayFromSnapshot(row.projectId, row.snapshot);
      const authorProfile = publicAuthorProfile(row);
      return {
        id: row.id,
        title: metadata.title,
        tagline: metadata.tagline,
        author: row.chosenName || row.accountName,
        authorBio: authorProfile.authorBio,
        authorGithubUsername: authorProfile.authorGithubUsername,
        week: metadata.week,
        description: metadata.description,
        technology: metadata.technology,
        isDemo: metadata.isDemo,
        reviewCount: reviewCounts.get(row.id) ?? 0,
        starCount: engagement.starCounts.get(row.id) ?? 0,
        commentCount: engagement.commentCounts.get(row.id) ?? 0,
        viewerHasStarred: engagement.starredByViewer.has(row.id),
        visibility: toGalleryEntry(row, moderation.get(row.id) ?? "visible").visibility,
      };
    }),
  };
}

export async function getGalleryProjectForViewer(
  userId: string,
  submissionId: string,
  database: Database = db,
): Promise<{ enabled: boolean; project: GalleryProjectDetail | null }> {
  const context = await requireCommunityContext(userId, "gallery:read", database);
  if (!context.flags.galleryEnabled) return { enabled: false, project: null };
  const [row] = await loadSubmissionRows(
    database,
    context.organizationId,
    [submissionId],
  );
  if (!row) return { enabled: true, project: null };
  const moderation = await loadModerationByTarget(database, [submissionId]);
  const entry = toGalleryEntry(row, moderation.get(row.id) ?? "visible");
  if (!decideGalleryAccess(context.viewer, entry, context.flags).allowed) {
    throw new AuthorizationDeniedError("gallery:read");
  }
  const storedFeedback = await database
    .select()
    .from(peerFeedback)
    .where(eq(peerFeedback.submissionId, submissionId))
    .orderBy(asc(peerFeedback.submittedAt));
  const metadata = galleryDisplayFromSnapshot(row.projectId, row.snapshot);
  const authorProfile = publicAuthorProfile(row);
  const engagement = await loadEngagementForSubmissions(database, [submissionId], userId);
  const commentRows = await database
    .select({
      id: galleryComments.id,
      body: galleryComments.body,
      createdAt: galleryComments.createdAt,
      authorId: galleryComments.authorUserId,
      chosenName: profiles.chosenName,
      accountName: user.name,
      profileVisible: profiles.profileVisible,
      isMinor: profiles.isMinor,
    })
    .from(galleryComments)
    .innerJoin(user, eq(user.id, galleryComments.authorUserId))
    .leftJoin(profiles, eq(profiles.userId, galleryComments.authorUserId))
    .where(
      and(
        eq(galleryComments.submissionId, submissionId),
        eq(galleryComments.moderationStatus, "visible"),
      ),
    )
    .orderBy(asc(galleryComments.createdAt));
  return {
    enabled: true,
    project: {
      id: row.id,
      ownerId: row.ownerId,
      title: metadata.title,
      tagline: metadata.tagline,
      author: row.chosenName || row.accountName,
      authorBio: authorProfile.authorBio,
      authorGithubUsername: authorProfile.authorGithubUsername,
      week: metadata.week,
      description: metadata.description,
      technology: metadata.technology,
      isDemo: metadata.isDemo,
      reviewCount: storedFeedback.length,
      starCount: engagement.starCounts.get(row.id) ?? 0,
      commentCount: engagement.commentCounts.get(row.id) ?? 0,
      viewerHasStarred: engagement.starredByViewer.has(row.id),
      visibility: entry.visibility,
      repositoryUrl: row.repositoryUrl,
      deploymentUrl: row.deploymentUrl,
      commitSha: row.commitSha,
      submittedAt: row.submittedAt,
      rubricVersionId: entry.rubricVersionId,
      rubricCriteria: metadata.rubricCriteria,
      feedback: storedFeedback.flatMap((item) => {
        const parsed = parseFeedback(item);
        return parsed ? [parsed] : [];
      }),
      comments: commentRows.map((comment) => {
        const identityVisible = comment.profileVisible === true && comment.isMinor === false;
        return {
          id: comment.id,
          body: comment.body,
          createdAt: comment.createdAt,
          authorId: comment.authorId,
          authorName: identityVisible
            ? comment.chosenName || comment.accountName
            : "Miembro verificado",
          canDelete: comment.authorId === userId,
        };
      }),
    },
  };
}

function isPublicShowcaseCandidate(
  row: SubmissionGalleryRow,
  moderationStatus: ModerationStatus,
): boolean {
  if (moderationStatus !== "visible") return false;
  if (!row.ownerVerified) return false;
  if (row.profileVisible !== true || row.ownerIsMinor !== false) return false;
  return galleryDisplayFromSnapshot(row.projectId, row.snapshot).isDemo;
}

function mapListItem(
  row: SubmissionGalleryRow,
  moderationStatus: ModerationStatus,
  engagement: {
    starCounts: Map<string, number>;
    commentCounts: Map<string, number>;
    starredByViewer: Set<string>;
  },
  reviewCount = 0,
): GalleryListItem {
  const metadata = galleryDisplayFromSnapshot(row.projectId, row.snapshot);
  const authorProfile = publicAuthorProfile(row);
  return {
    id: row.id,
    title: metadata.title,
    tagline: metadata.tagline,
    author: row.chosenName || row.accountName,
    authorBio: authorProfile.authorBio,
    authorGithubUsername: authorProfile.authorGithubUsername,
    week: metadata.week,
    description: metadata.description,
    technology: metadata.technology,
    isDemo: metadata.isDemo,
    reviewCount,
    starCount: engagement.starCounts.get(row.id) ?? 0,
    commentCount: engagement.commentCounts.get(row.id) ?? 0,
    viewerHasStarred: engagement.starredByViewer.has(row.id),
    visibility: toGalleryEntry(row, moderationStatus).visibility,
  };
}

async function loadVisibleComments(
  database: Database,
  submissionId: string,
  viewerId?: string,
): Promise<GalleryCommentView[]> {
  const commentRows = await database
    .select({
      id: galleryComments.id,
      body: galleryComments.body,
      createdAt: galleryComments.createdAt,
      authorId: galleryComments.authorUserId,
      chosenName: profiles.chosenName,
      accountName: user.name,
      profileVisible: profiles.profileVisible,
      isMinor: profiles.isMinor,
    })
    .from(galleryComments)
    .innerJoin(user, eq(user.id, galleryComments.authorUserId))
    .leftJoin(profiles, eq(profiles.userId, galleryComments.authorUserId))
    .where(
      and(
        eq(galleryComments.submissionId, submissionId),
        eq(galleryComments.moderationStatus, "visible"),
      ),
    )
    .orderBy(asc(galleryComments.createdAt));

  return commentRows.map((comment) => {
    const identityVisible = comment.profileVisible === true && comment.isMinor === false;
    return {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      authorId: comment.authorId,
      authorName: identityVisible
        ? comment.chosenName || comment.accountName
        : "Miembro verificado",
      canDelete: Boolean(viewerId && comment.authorId === viewerId),
    };
  });
}

export async function listPublicGalleryProjects(
  database: Database = db,
): Promise<{ entries: GalleryListItem[] }> {
  const organizationId = await resolveDefaultOrganizationId(database);
  const allRows = await loadSubmissionRows(database, organizationId);
  const seenProjects = new Set<string>();
  const rows = allRows.filter((row) => {
    const key = `${row.ownerId}:${row.projectId}`;
    if (seenProjects.has(key)) return false;
    seenProjects.add(key);
    return true;
  });
  const moderation = await loadModerationByTarget(database, rows.map(({ id }) => id));
  const visibleRows = rows.filter((row) =>
    isPublicShowcaseCandidate(row, moderation.get(row.id) ?? "visible"),
  );
  const ids = visibleRows.map(({ id }) => id);
  const engagement = await loadEngagementForSubmissions(database, ids);
  return {
    entries: visibleRows.map((row) =>
      mapListItem(row, moderation.get(row.id) ?? "visible", engagement),
    ),
  };
}

export async function getPublicGalleryProject(
  submissionId: string,
  database: Database = db,
): Promise<{ project: GalleryProjectDetail | null }> {
  const organizationId = await resolveDefaultOrganizationId(database);
  const [row] = await loadSubmissionRows(database, organizationId, [submissionId]);
  if (!row) return { project: null };
  const moderation = await loadModerationByTarget(database, [submissionId]);
  const moderationStatus = moderation.get(row.id) ?? "visible";
  if (!isPublicShowcaseCandidate(row, moderationStatus)) return { project: null };

  const entry = toGalleryEntry(row, moderationStatus);
  const metadata = galleryDisplayFromSnapshot(row.projectId, row.snapshot);
  const authorProfile = publicAuthorProfile(row);
  const engagement = await loadEngagementForSubmissions(database, [submissionId]);
  const comments = await loadVisibleComments(database, submissionId);

  return {
    project: {
      id: row.id,
      ownerId: row.ownerId,
      title: metadata.title,
      tagline: metadata.tagline,
      author: row.chosenName || row.accountName,
      authorBio: authorProfile.authorBio,
      authorGithubUsername: authorProfile.authorGithubUsername,
      week: metadata.week,
      description: metadata.description,
      technology: metadata.technology,
      isDemo: metadata.isDemo,
      reviewCount: 0,
      starCount: engagement.starCounts.get(row.id) ?? 0,
      commentCount: engagement.commentCounts.get(row.id) ?? 0,
      viewerHasStarred: false,
      visibility: entry.visibility,
      repositoryUrl: row.repositoryUrl,
      deploymentUrl: row.deploymentUrl,
      commitSha: row.commitSha,
      submittedAt: row.submittedAt,
      rubricVersionId: entry.rubricVersionId,
      rubricCriteria: metadata.rubricCriteria,
      feedback: [],
      comments,
    },
  };
}

export async function toggleGalleryStar(
  userId: string,
  submissionId: string,
  database: Database = db,
): Promise<{ starred: boolean }> {
  const context = await requireCommunityContext(userId, "gallery:read", database);
  if (!context.flags.galleryEnabled) {
    throw new CommunityDomainError("feature_disabled", "Gallery disabled");
  }
  if (!context.viewer.emailVerified) {
    throw new AuthorizationDeniedError("gallery:interact");
  }
  const [row] = await loadSubmissionRows(database, context.organizationId, [submissionId]);
  if (!row) throw new ResourceNotFoundError("Gallery project");
  const moderation = await loadModerationByTarget(database, [submissionId]);
  const entry = toGalleryEntry(row, moderation.get(row.id) ?? "visible");
  if (!decideGalleryAccess(context.viewer, entry, context.flags).allowed) {
    throw new AuthorizationDeniedError("gallery:read");
  }
  if (row.ownerId === userId) {
    throw new CommunityDomainError("forbidden", "OWN_PROJECT_STAR");
  }
  const [existing] = await database
    .select({ submissionId: galleryStars.submissionId })
    .from(galleryStars)
    .where(and(eq(galleryStars.submissionId, submissionId), eq(galleryStars.userId, userId)))
    .limit(1);
  if (existing) {
    await database
      .delete(galleryStars)
      .where(and(eq(galleryStars.submissionId, submissionId), eq(galleryStars.userId, userId)));
    return { starred: false };
  }
  await database.insert(galleryStars).values({ submissionId, userId });
  return { starred: true };
}

export async function createGalleryComment(
  userId: string,
  submissionId: string,
  rawBody: string,
  database: Database = db,
): Promise<{ id: string }> {
  const context = await requireCommunityContext(userId, "gallery:read", database);
  if (!context.flags.galleryEnabled) {
    throw new CommunityDomainError("feature_disabled", "Gallery disabled");
  }
  if (!context.viewer.emailVerified) {
    throw new AuthorizationDeniedError("gallery:interact");
  }
  const body = assertCommentBody(rawBody);
  const [row] = await loadSubmissionRows(database, context.organizationId, [submissionId]);
  if (!row) throw new ResourceNotFoundError("Gallery project");
  const moderation = await loadModerationByTarget(database, [submissionId]);
  const entry = toGalleryEntry(row, moderation.get(row.id) ?? "visible");
  if (!decideGalleryAccess(context.viewer, entry, context.flags).allowed) {
    throw new AuthorizationDeniedError("gallery:read");
  }
  const recent = await database
    .select({ id: galleryComments.id, body: galleryComments.body, createdAt: galleryComments.createdAt })
    .from(galleryComments)
    .where(
      and(
        eq(galleryComments.authorUserId, userId),
        eq(galleryComments.submissionId, submissionId),
      ),
    )
    .orderBy(desc(galleryComments.createdAt))
    .limit(5);
  if (recent[0]?.body.trim() === body) {
    throw new CommunityDomainError("invalid_feedback", "COMMENT_DUPLICATE");
  }
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentCount = recent.filter((item) => item.createdAt >= tenMinutesAgo).length;
  if (recentCount >= 5) {
    throw new CommunityDomainError("invalid_feedback", "COMMENT_RATE_LIMIT");
  }
  const id = crypto.randomUUID();
  await database.insert(galleryComments).values({
    id,
    submissionId,
    authorUserId: userId,
    body,
    moderationStatus: "visible",
  });
  return { id };
}

export async function removeOwnGalleryComment(
  userId: string,
  commentId: string,
  database: Database = db,
): Promise<{ submissionId: string }> {
  const [comment] = await database
    .select()
    .from(galleryComments)
    .where(eq(galleryComments.id, commentId))
    .limit(1);
  if (!comment) throw new ResourceNotFoundError("Comment");
  if (comment.authorUserId !== userId) {
    throw new AuthorizationDeniedError("gallery:comment-delete");
  }
  await database
    .update(galleryComments)
    .set({ moderationStatus: "removed", updatedAt: new Date() })
    .where(eq(galleryComments.id, commentId));
  return { submissionId: comment.submissionId };
}

export interface ModerationQueueItem {
  id: string;
  targetId: string;
  reason: ReportReason;
  status: ReportStatus;
  createdAt: Date;
  projectTitle: string;
  author: string;
}

export async function listModerationQueue(
  actorUserId: string,
  database: Database = db,
): Promise<ModerationQueueItem[]> {
  const context = await requireCommunityContext(
    actorUserId,
    "moderation:manage",
    database,
  );
  const reports = await database
    .select()
    .from(contentReports)
    .where(
      and(
        eq(contentReports.targetType, "submission"),
        or(eq(contentReports.status, "open"), eq(contentReports.status, "reviewing")),
      ),
    )
    .orderBy(asc(contentReports.createdAt));
  const rows = await loadSubmissionRows(
    database,
    context.organizationId,
    reports.map(({ targetId }) => targetId),
  );
  const scopedRows = context.viewer.roles.includes("administrator")
    ? rows
    : rows.filter(
        ({ cohortId }) =>
          cohortId !== null && context.viewer.staffedCohortIds.includes(cohortId),
      );
  const rowById = new Map(scopedRows.map((row) => [row.id, row]));
  return reports.flatMap((report) => {
    const row = rowById.get(report.targetId);
    if (!row) return [];
    const metadata = galleryDisplayFromSnapshot(row.projectId, row.snapshot);
    return [{
      id: report.id,
      targetId: report.targetId,
      reason: report.reasonCode as ReportReason,
      status: fromDatabaseReport(report).status,
      createdAt: report.createdAt,
      projectTitle: metadata.title,
      author: row.chosenName || row.accountName,
    }];
  });
}
