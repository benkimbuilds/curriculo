import { describe, expect, it } from "vitest";
import { InterventionService } from "./intervention-service";
import type {
  InterventionNoteRepository,
  RosterRepository,
} from "./repositories";
import {
  deriveActivityStatus,
  derivePaceStatus,
  RosterService,
} from "./roster-service";
import type {
  InterventionNote,
  LearnerRosterEvidence,
  StaffActor,
} from "./types";

const now = new Date("2026-09-05T12:00:00.000Z");
const clock = { now: () => now };
const staff: StaffActor = {
  userId: "staff-1",
  roles: ["facilitator"],
  assignedCohortIds: ["cohort-a"],
};

const evidence: LearnerRosterEvidence[] = [
  {
    userId: "learner-1",
    cohortId: "cohort-a",
    displayName: "Ana",
    email: "ana@example.com",
    completedRequiredItems: 8,
    expectedCompletedItems: 6,
    totalRequiredItems: 20,
    lastActivityAt: new Date("2026-09-04T12:00:00.000Z"),
    lastSubmissionAt: new Date("2026-09-04T10:00:00.000Z"),
    submissionStatus: "submitted",
    evaluationStatus: "pending",
    hasOverdueRequiredWork: false,
  },
  {
    userId: "learner-2",
    cohortId: "cohort-a",
    displayName: "Bruno",
    email: "bruno@example.com",
    completedRequiredItems: 3,
    expectedCompletedItems: 6,
    totalRequiredItems: 20,
    lastActivityAt: new Date("2026-08-20T12:00:00.000Z"),
    lastSubmissionAt: null,
    submissionStatus: "draft",
    evaluationStatus: "needs_review",
    hasOverdueRequiredWork: true,
  },
];

class RosterMemory implements RosterRepository {
  constructor(private readonly records = evidence) {}
  async listEvidenceByCohort(cohortId: string) {
    return this.records.filter((record) => record.cohortId === cohortId);
  }
  async isLearnerInCohort(learnerId: string, cohortId: string) {
    return this.records.some(
      (record) => record.userId === learnerId && record.cohortId === cohortId,
    );
  }
}

class NoteMemory implements InterventionNoteRepository {
  notes: InterventionNote[] = [];
  async append(note: InterventionNote) {
    this.notes.push(note);
  }
  async listForLearner(cohortId: string, learnerId: string) {
    return this.notes.filter(
      (note) => note.cohortId === cohortId && note.learnerId === learnerId,
    );
  }
}

describe("transparent roster status derivation", () => {
  it("derives pace and activity directly from evidence", () => {
    expect(derivePaceStatus(evidence[0])).toBe("ahead");
    expect(derivePaceStatus(evidence[1])).toBe("behind");
    expect(deriveActivityStatus(null, now, 7)).toBe("no_activity");
    expect(deriveActivityStatus(evidence[1].lastActivityAt, now, 7)).toBe(
      "inactive",
    );
  });

  it("filters rows while aggregates continue to describe the full cohort", async () => {
    const service = new RosterService(new RosterMemory(), clock, 7);
    const result = await service.list(staff, "cohort-a", {
      needsAttention: true,
      evaluation: ["needs_review"],
    });

    expect(result.rows.map(({ displayName }) => displayName)).toEqual(["Bruno"]);
    expect(result.rows[0].attentionReasons).toEqual([
      "behind",
      "inactive",
      "overdue_work",
      "needs_review",
    ]);
    expect(result.aggregates).toMatchObject({
      total: 2,
      needingAttention: 1,
      pace: { ahead: 1, behind: 1 },
      activity: { active: 1, inactive: 1 },
    });
  });

  it("prevents facilitators from reading unassigned cohorts", async () => {
    const service = new RosterService(new RosterMemory(), clock);
    await expect(service.list(staff, "cohort-b")).rejects.toMatchObject({
      code: "forbidden",
    });
  });
});

describe("intervention notes", () => {
  it("appends trimmed, staff-only notes for an enrolled learner", async () => {
    const notes = new NoteMemory();
    const service = new InterventionService(
      new RosterMemory(),
      notes,
      clock,
      { nextId: () => "note-1" },
    );
    const note = await service.add(staff, {
      cohortId: "cohort-a",
      learnerId: "learner-2",
      category: "technical_support",
      note: "  Helped configure Git credentials.  ",
    });

    expect(note).toMatchObject({
      id: "note-1",
      authorId: "staff-1",
      note: "Helped configure Git credentials.",
    });
    await expect(service.list(staff, "cohort-a", "learner-2")).resolves.toEqual([
      note,
    ]);
  });

  it("rejects blank notes and non-members", async () => {
    const service = new InterventionService(
      new RosterMemory(),
      new NoteMemory(),
      clock,
      { nextId: () => "note-1" },
    );
    await expect(
      service.add(staff, {
        cohortId: "cohort-a",
        learnerId: "learner-1",
        category: "other",
        note: " ",
      }),
    ).rejects.toMatchObject({ code: "invalid_note" });
    await expect(
      service.add(staff, {
        cohortId: "cohort-a",
        learnerId: "missing",
        category: "other",
        note: "Attempted follow-up.",
      }),
    ).rejects.toMatchObject({ code: "learner_not_found" });
  });
});
