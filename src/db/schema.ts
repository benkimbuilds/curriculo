import { sql } from "drizzle-orm";
import {
  boolean,
  bigint,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const platformRoleEnum = pgEnum("platform_role", [
  "student",
  "instructor",
  "administrator",
  "curriculum_editor",
  "developer_administrator",
]);
export const enrollmentModeEnum = pgEnum("enrollment_mode", ["self_paced", "facilitated"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "completed",
  "paused",
  "withdrawn",
]);
export const cohortMembershipStatusEnum = pgEnum("cohort_membership_status", [
  "invited",
  "active",
  "completed",
  "withdrawn",
]);
export const cohortInvitationStatusEnum = pgEnum("cohort_invitation_status", [
  "pending",
  "accepted",
  "revoked",
  "expired",
]);
export const progressStateEnum = pgEnum("progress_state", [
  "not_started",
  "viewed",
  "attempted",
  "submitted",
  "passed",
  "needs_revision",
  "completed",
]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "draft",
  "submitted",
  "evaluating",
  "passed",
  "needs_revision",
  "withdrawn",
]);
export const evaluationStatusEnum = pgEnum("evaluation_status", [
  "queued",
  "running",
  "passed",
  "failed",
  "needs_review",
  "error",
]);
export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "reviewing",
  "resolved",
  "dismissed",
]);
export const mailStatusEnum = pgEnum("mail_status", [
  "pending",
  "processing",
  "sent",
  "failed",
]);

// Better Auth core schema. Export names intentionally match Better Auth model names.
export const user = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    ...timestamps,
  },
  (table) => [uniqueIndex("user_email_unique").on(sql`lower(${table.email})`)],
);

export const session = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [index("session_user_id_idx").on(table.userId), index("session_expiry_idx").on(table.expiresAt)],
);

export const account = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    issuer: text("issuer").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    unique("account_issuer_account_unique").on(table.issuer, table.accountId),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const rateLimit = pgTable("rate_limit", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  chosenName: varchar("chosen_name", { length: 120 }),
  bio: text("bio"),
  githubUsername: varchar("github_username", { length: 80 }),
  locale: varchar("locale", { length: 10 }).default("es-MX").notNull(),
  isMinor: boolean("is_minor").default(true).notNull(),
  profileVisible: boolean("profile_visible").default(false).notNull(),
  ...timestamps,
});

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  ...timestamps,
});

export const programs = pgTable("programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 100 }).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
}, (table) => [unique("program_org_slug_unique").on(table.organizationId, table.slug)]);

export const programVersions = pgTable("program_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  version: varchar("version", { length: 40 }).notNull(),
  contentCommit: varchar("content_commit", { length: 64 }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  isDefault: boolean("is_default").default(false).notNull(),
  ...timestamps,
}, (table) => [unique("program_version_unique").on(table.programId, table.version)]);

export const roleAssignments = pgTable(
  "role_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: platformRoleEnum("role").notNull(),
    grantedByUserId: uuid("granted_by_user_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("role_assignment_unique").on(table.userId, table.organizationId, table.role),
    index("role_assignment_user_idx").on(table.userId),
  ],
);

export const cohorts = pgTable(
  "cohorts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    programVersionId: uuid("program_version_id")
      .notNull()
      .references(() => programVersions.id, { onDelete: "restrict" }),
    slug: varchar("slug", { length: 100 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    timezone: varchar("timezone", { length: 80 }).default("America/Mexico_City").notNull(),
    capacity: integer("capacity").default(100).notNull(),
    active: boolean("active").default(true).notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    archivedByUserId: uuid("archived_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (table) => [
    unique("cohort_org_slug_unique").on(table.organizationId, table.slug),
    check("cohort_dates_valid", sql`${table.endsAt} > ${table.startsAt}`),
    check("cohort_capacity_valid", sql`${table.capacity} > 0`),
  ],
);

export const cohortSchedules = pgTable(
  "cohort_schedules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cohortId: uuid("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    weekId: varchar("week_id", { length: 100 }).notNull(),
    opensAt: timestamp("opens_at", { withTimezone: true }),
    dueAt: timestamp("due_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [unique("cohort_week_schedule_unique").on(table.cohortId, table.weekId)],
);

export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  cohortId: uuid("cohort_id").references(() => cohorts.id, { onDelete: "cascade" }),
  authorUserId: uuid("author_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  ...timestamps,
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    programVersionId: uuid("program_version_id")
      .notNull()
      .references(() => programVersions.id, { onDelete: "restrict" }),
    cohortId: uuid("cohort_id").references(() => cohorts.id, { onDelete: "restrict" }),
    mode: enrollmentModeEnum("mode").default("self_paced").notNull(),
    status: enrollmentStatusEnum("status").default("active").notNull(),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("enrollment_self_paced_unique")
      .on(table.userId, table.programVersionId)
      .where(sql`${table.mode} = 'self_paced'`),
    uniqueIndex("enrollment_facilitated_unique")
      .on(table.userId, table.cohortId)
      .where(sql`${table.mode} = 'facilitated'`),
    check(
      "enrollment_mode_cohort_valid",
      sql`(${table.mode} = 'self_paced' and ${table.cohortId} is null) or (${table.mode} = 'facilitated' and ${table.cohortId} is not null)`,
    ),
  ],
);

export const cohortMemberships = pgTable(
  "cohort_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cohortId: uuid("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollments.id, { onDelete: "cascade" }),
    status: cohortMembershipStatusEnum("status").default("active").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (table) => [
    unique("cohort_member_unique").on(table.cohortId, table.userId),
    unique("cohort_enrollment_unique").on(table.cohortId, table.enrollmentId),
  ],
);

export const cohortStaffAssignments = pgTable(
  "cohort_staff_assignments",
  {
    cohortId: uuid("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: platformRoleEnum("role").notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.cohortId, table.userId, table.role] }),
    check("cohort_staff_role_valid", sql`${table.role} <> 'student'`),
  ],
);

export const cohortInvitations = pgTable(
  "cohort_invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cohortId: uuid("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    status: cohortInvitationStatusEnum("status").default("pending").notNull(),
    invitedByUserId: uuid("invited_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    acceptedByUserId: uuid("accepted_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("cohort_invitation_pending_unique")
      .on(table.cohortId, sql`lower(${table.email})`)
      .where(sql`${table.status} = 'pending'`),
    index("cohort_invitation_email_idx").on(table.email),
    index("cohort_invitation_expiry_idx").on(table.status, table.expiresAt),
  ],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollments.id, { onDelete: "cascade" }),
    lessonId: varchar("lesson_id", { length: 140 }).notNull(),
    contentVersion: varchar("content_version", { length: 64 }).notNull(),
    state: progressStateEnum("state").default("not_started").notNull(),
    viewedAt: timestamp("viewed_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    resumePosition: integer("resume_position").default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    unique("lesson_progress_version_unique").on(table.enrollmentId, table.lessonId, table.contentVersion),
    index("lesson_progress_enrollment_idx").on(table.enrollmentId),
  ],
);

export const weekProgress = pgTable(
  "week_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollments.id, { onDelete: "cascade" }),
    weekId: varchar("week_id", { length: 100 }).notNull(),
    contentVersion: varchar("content_version", { length: 64 }).notNull(),
    state: progressStateEnum("state").default("not_started").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [unique("week_progress_version_unique").on(table.enrollmentId, table.weekId, table.contentVersion)],
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollments.id, { onDelete: "restrict" }),
    projectId: varchar("project_id", { length: 140 }).notNull(),
    projectVersion: varchar("project_version", { length: 64 }).notNull(),
    attempt: integer("attempt").notNull(),
    status: submissionStatusEnum("status").default("submitted").notNull(),
    repositoryUrl: text("repository_url").notNull(),
    commitSha: varchar("commit_sha", { length: 64 }).notNull(),
    deploymentUrl: text("deployment_url"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().default({}).notNull(),
    ...timestamps,
  },
  (table) => [
    unique("submission_attempt_unique").on(table.enrollmentId, table.projectId, table.attempt),
    check("submission_attempt_positive", sql`${table.attempt} > 0`),
    check(
      "submission_commit_sha_valid",
      sql`${table.commitSha} ~ '^(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})$'`,
    ),
  ],
);

export const submissionArtifacts = pgTable("submission_artifacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 40 }).notNull(),
  url: text("url").notNull(),
  sha256: varchar("sha256", { length: 64 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const evaluationRuns = pgTable(
  "evaluation_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "restrict" }),
    rubricId: varchar("rubric_id", { length: 140 }).notNull(),
    rubricVersion: varchar("rubric_version", { length: 64 }).notNull(),
    evaluatorVersion: varchar("evaluator_version", { length: 64 }).notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 180 }).notNull().unique(),
    status: evaluationStatusEnum("status").default("queued").notNull(),
    attempt: integer("attempt").default(0).notNull(),
    maxAttempts: integer("max_attempts").default(3).notNull(),
    leaseToken: uuid("lease_token"),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    errorCode: varchar("error_code", { length: 80 }),
    errorMessage: text("error_message"),
    ...timestamps,
  },
  (table) => [
    index("evaluation_run_queue_idx").on(table.status, table.createdAt),
    check(
      "evaluation_run_attempts_valid",
      sql`${table.attempt} >= 0 and ${table.maxAttempts} > 0 and ${table.attempt} <= ${table.maxAttempts}`,
    ),
  ],
);

export const evaluationResults = pgTable(
  "evaluation_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    evaluationRunId: uuid("evaluation_run_id")
      .notNull()
      .references(() => evaluationRuns.id, { onDelete: "cascade" }),
    criterionId: varchar("criterion_id", { length: 140 }).notNull(),
    passed: boolean("passed"),
    score: integer("score"),
    evidence: jsonb("evidence").$type<Record<string, unknown>>().default({}).notNull(),
    requiresHumanReview: boolean("requires_human_review").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique("evaluation_criterion_unique").on(table.evaluationRunId, table.criterionId)],
);

export const evaluationOverrides = pgTable("evaluation_overrides", {
  id: uuid("id").defaultRandom().primaryKey(),
  evaluationRunId: uuid("evaluation_run_id")
    .notNull()
    .references(() => evaluationRuns.id, { onDelete: "restrict" }),
  reviewerUserId: uuid("reviewer_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  status: evaluationStatusEnum("status").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const peerFeedback = pgTable(
  "peer_feedback",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    reviewerUserId: uuid("reviewer_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rubricVersion: varchar("rubric_version", { length: 64 }).notNull(),
    responses: jsonb("responses").$type<Record<string, unknown>>().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (table) => [unique("peer_feedback_reviewer_unique").on(table.submissionId, table.reviewerUserId)],
);

export const contentReports = pgTable("content_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterUserId: uuid("reporter_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  targetType: varchar("target_type", { length: 40 }).notNull(),
  targetId: varchar("target_id", { length: 140 }).notNull(),
  reasonCode: varchar("reason_code", { length: 60 }).notNull(),
  details: text("details"),
  status: reportStatusEnum("status").default("open").notNull(),
  assignedToUserId: uuid("assigned_to_user_id").references(() => user.id, { onDelete: "set null" }),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  ...timestamps,
});

export const moderationActions = pgTable("moderation_actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id").references(() => contentReports.id, { onDelete: "set null" }),
  actorUserId: uuid("actor_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  action: varchar("action", { length: 60 }).notNull(),
  targetType: varchar("target_type", { length: 40 }).notNull(),
  targetId: varchar("target_id", { length: 140 }).notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const interventionNotes = pgTable("intervention_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  cohortId: uuid("cohort_id")
    .notNull()
    .references(() => cohorts.id, { onDelete: "cascade" }),
  studentUserId: uuid("student_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  authorUserId: uuid("author_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  note: text("note").notNull(),
  followUpAt: timestamp("follow_up_at", { withTimezone: true }),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  ...timestamps,
});

export const featureFlags = pgTable("feature_flags", {
  key: varchar("key", { length: 100 }).primaryKey(),
  enabled: boolean("enabled").default(false).notNull(),
  description: text("description"),
  updatedByUserId: uuid("updated_by_user_id").references(() => user.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => user.id, { onDelete: "set null" }),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    subjectType: varchar("subject_type", { length: 80 }).notNull(),
    subjectId: varchar("subject_id", { length: 140 }),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "set null" }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    requestId: varchar("request_id", { length: 100 }),
    ipAddress: varchar("ip_address", { length: 80 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("audit_event_subject_idx").on(table.subjectType, table.subjectId), index("audit_event_created_idx").on(table.createdAt)],
);

export const mailOutbox = pgTable(
  "mail_outbox",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kind: varchar("kind", { length: 60 }).notNull(),
    recipient: text("recipient").notNull(),
    subject: text("subject").notNull(),
    textBody: text("text_body").notNull(),
    htmlBody: text("html_body"),
    status: mailStatusEnum("status").default("pending").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    availableAt: timestamp("available_at", { withTimezone: true }).defaultNow().notNull(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    lastError: text("last_error"),
    ...timestamps,
  },
  (table) => [index("mail_outbox_pending_idx").on(table.status, table.availableAt)],
);

export const schema = {
  user,
  session,
  account,
  verification,
  rateLimit,
  profiles,
  organizations,
  programs,
  programVersions,
  roleAssignments,
  cohorts,
  cohortSchedules,
  announcements,
  enrollments,
  cohortMemberships,
  cohortStaffAssignments,
  cohortInvitations,
  lessonProgress,
  weekProgress,
  submissions,
  submissionArtifacts,
  evaluationRuns,
  evaluationResults,
  evaluationOverrides,
  peerFeedback,
  contentReports,
  moderationActions,
  interventionNotes,
  featureFlags,
  auditEvents,
  mailOutbox,
};

export type User = typeof user.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Cohort = typeof cohorts.$inferSelect;
