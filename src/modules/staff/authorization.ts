import { StaffDomainError, type StaffActor } from "./types";

export function assertCohortAccess(actor: StaffActor, cohortId: string): void {
  if (actor.roles.includes("administrator")) {
    return;
  }

  if (
    actor.roles.includes("facilitator") &&
    actor.assignedCohortIds.includes(cohortId)
  ) {
    return;
  }

  throw new StaffDomainError(
    "forbidden",
    "Staff access is limited to assigned cohorts.",
  );
}
