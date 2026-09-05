import type { RosterRepository, StaffClock } from "./repositories";
import { assertCohortAccess } from "./authorization";
import {
  StaffDomainError,
  type ActivityStatus,
  type AttentionReason,
  type EvaluationStatus,
  type LearnerRosterEvidence,
  type PaceStatus,
  type RosterAggregates,
  type RosterFilters,
  type RosterResult,
  type RosterRow,
  type StaffActor,
  type SubmissionStatus,
} from "./types";

const PACE_STATUSES: readonly PaceStatus[] = [
  "self_paced",
  "ahead",
  "on_track",
  "behind",
  "complete",
];
const ACTIVITY_STATUSES: readonly ActivityStatus[] = [
  "active",
  "inactive",
  "no_activity",
];
const SUBMISSION_STATUSES: readonly SubmissionStatus[] = [
  "not_started",
  "draft",
  "submitted",
  "resubmitted",
  "accepted",
];
const EVALUATION_STATUSES: readonly EvaluationStatus[] = [
  "not_applicable",
  "pending",
  "running",
  "passed",
  "failed",
  "needs_review",
  "error",
  "overridden",
];

function countBy<T extends string>(values: readonly T[], keys: readonly T[]): Record<T, number> {
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;
  for (const value of values) counts[value] += 1;
  return counts;
}

export function derivePaceStatus(evidence: LearnerRosterEvidence): PaceStatus {
  if (
    evidence.completedRequiredItems < 0 ||
    evidence.totalRequiredItems < 0 ||
    evidence.completedRequiredItems > evidence.totalRequiredItems ||
    (evidence.expectedCompletedItems !== null &&
      (evidence.expectedCompletedItems < 0 ||
        evidence.expectedCompletedItems > evidence.totalRequiredItems))
  ) {
    throw new StaffDomainError(
      "invalid_evidence",
      "Roster completion counts must be within the curriculum total.",
    );
  }

  if (evidence.totalRequiredItems > 0 && evidence.completedRequiredItems === evidence.totalRequiredItems) {
    return "complete";
  }
  if (evidence.expectedCompletedItems === null) return "self_paced";
  if (evidence.completedRequiredItems > evidence.expectedCompletedItems) return "ahead";
  if (evidence.completedRequiredItems === evidence.expectedCompletedItems) return "on_track";
  return "behind";
}

export function deriveActivityStatus(
  lastActivityAt: Date | null,
  now: Date,
  inactiveAfterDays: number,
): ActivityStatus {
  if (!lastActivityAt) return "no_activity";
  const inactiveAfterMs = inactiveAfterDays * 24 * 60 * 60 * 1000;
  return now.getTime() - lastActivityAt.getTime() > inactiveAfterMs
    ? "inactive"
    : "active";
}

function deriveAttentionReasons(row: Omit<RosterRow, "attentionReasons">): AttentionReason[] {
  const reasons: AttentionReason[] = [];
  if (row.paceStatus === "behind") reasons.push("behind");
  if (row.activityStatus === "inactive" || row.activityStatus === "no_activity") {
    reasons.push("inactive");
  }
  if (row.hasOverdueRequiredWork) reasons.push("overdue_work");
  if (row.evaluationStatus === "failed" || row.evaluationStatus === "error") {
    reasons.push("evaluation_failed");
  }
  if (row.evaluationStatus === "needs_review") reasons.push("needs_review");
  return reasons;
}

function matchesFilters(row: RosterRow, filters: RosterFilters): boolean {
  const search = filters.search?.trim().toLocaleLowerCase("es-MX");
  return (
    (!search ||
      row.displayName.toLocaleLowerCase("es-MX").includes(search) ||
      row.email.toLocaleLowerCase("es-MX").includes(search)) &&
    (!filters.pace?.length || filters.pace.includes(row.paceStatus)) &&
    (!filters.activity?.length || filters.activity.includes(row.activityStatus)) &&
    (!filters.submission?.length || filters.submission.includes(row.submissionStatus)) &&
    (!filters.evaluation?.length || filters.evaluation.includes(row.evaluationStatus)) &&
    (filters.needsAttention === undefined ||
      (row.attentionReasons.length > 0) === filters.needsAttention)
  );
}

function aggregate(rows: readonly RosterRow[]): RosterAggregates {
  return {
    total: rows.length,
    pace: countBy(
      rows.map(({ paceStatus }) => paceStatus),
      PACE_STATUSES,
    ),
    activity: countBy(
      rows.map(({ activityStatus }) => activityStatus),
      ACTIVITY_STATUSES,
    ),
    submission: countBy(
      rows.map(({ submissionStatus }) => submissionStatus),
      SUBMISSION_STATUSES,
    ),
    evaluation: countBy(
      rows.map(({ evaluationStatus }) => evaluationStatus),
      EVALUATION_STATUSES,
    ),
    needingAttention: rows.filter(({ attentionReasons }) => attentionReasons.length > 0)
      .length,
  };
}

export class RosterService {
  constructor(
    private readonly roster: RosterRepository,
    private readonly clock: StaffClock,
    private readonly inactiveAfterDays = 7,
  ) {
    if (!Number.isFinite(inactiveAfterDays) || inactiveAfterDays < 1) {
      throw new RangeError("inactiveAfterDays must be at least one day.");
    }
  }

  async list(
    actor: StaffActor,
    cohortId: string,
    filters: RosterFilters = {},
  ): Promise<RosterResult> {
    assertCohortAccess(actor, cohortId);
    const now = this.clock.now();
    const rows = (await this.roster.listEvidenceByCohort(cohortId))
      .map((evidence): RosterRow => {
        const base = {
          ...evidence,
          paceStatus: derivePaceStatus(evidence),
          activityStatus: deriveActivityStatus(
            evidence.lastActivityAt,
            now,
            this.inactiveAfterDays,
          ),
        };
        return { ...base, attentionReasons: deriveAttentionReasons(base) };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName, "es-MX"));

    const filteredRows = rows.filter((row) => matchesFilters(row, filters));
    return {
      rows: filteredRows,
      aggregates: aggregate(rows),
      filteredCount: filteredRows.length,
    };
  }
}
