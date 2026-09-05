import type { InterventionNote, LearnerRosterEvidence } from "./types";

export interface RosterRepository {
  listEvidenceByCohort(cohortId: string): Promise<readonly LearnerRosterEvidence[]>;
  isLearnerInCohort(learnerId: string, cohortId: string): Promise<boolean>;
}

export interface InterventionNoteRepository {
  append(note: InterventionNote): Promise<void>;
  listForLearner(
    cohortId: string,
    learnerId: string,
  ): Promise<readonly InterventionNote[]>;
}

export interface StaffClock {
  now(): Date;
}

export interface StaffIdGenerator {
  nextId(): string;
}
