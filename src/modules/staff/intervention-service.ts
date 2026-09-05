import { assertCohortAccess } from "./authorization";
import type {
  InterventionNoteRepository,
  RosterRepository,
  StaffClock,
  StaffIdGenerator,
} from "./repositories";
import {
  StaffDomainError,
  type InterventionCategory,
  type InterventionNote,
  type StaffActor,
} from "./types";

export interface AddInterventionNoteInput {
  cohortId: string;
  learnerId: string;
  category: InterventionCategory;
  note: string;
  followUpAt?: Date | null;
}

export class InterventionService {
  constructor(
    private readonly roster: RosterRepository,
    private readonly notes: InterventionNoteRepository,
    private readonly clock: StaffClock,
    private readonly ids: StaffIdGenerator,
  ) {}

  async add(
    actor: StaffActor,
    input: AddInterventionNoteInput,
  ): Promise<InterventionNote> {
    assertCohortAccess(actor, input.cohortId);
    const noteText = input.note.trim();
    if (noteText.length < 3 || noteText.length > 2_000) {
      throw new StaffDomainError(
        "invalid_note",
        "Intervention notes must contain between 3 and 2,000 characters.",
      );
    }
    if (
      !(await this.roster.isLearnerInCohort(input.learnerId, input.cohortId))
    ) {
      throw new StaffDomainError(
        "learner_not_found",
        "The learner is not enrolled in this cohort.",
      );
    }

    const note: InterventionNote = {
      id: this.ids.nextId(),
      cohortId: input.cohortId,
      learnerId: input.learnerId,
      authorId: actor.userId,
      category: input.category,
      note: noteText,
      followUpAt: input.followUpAt ?? null,
      createdAt: this.clock.now(),
    };
    await this.notes.append(note);
    return note;
  }

  async list(
    actor: StaffActor,
    cohortId: string,
    learnerId: string,
  ): Promise<readonly InterventionNote[]> {
    assertCohortAccess(actor, cohortId);
    if (!(await this.roster.isLearnerInCohort(learnerId, cohortId))) {
      throw new StaffDomainError(
        "learner_not_found",
        "The learner is not enrolled in this cohort.",
      );
    }
    return this.notes.listForLearner(cohortId, learnerId);
  }
}
