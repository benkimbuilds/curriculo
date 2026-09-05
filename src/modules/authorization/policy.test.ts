import { describe, expect, it } from "vitest";

import {
  canAccessCohort,
  canManageCohort,
  hasPermission,
  type AuthorizationContext,
} from "./policy";

const verifiedStudent: AuthorizationContext = {
  verified: true,
  organizationRoles: ["student"],
  memberCohortIds: ["cohort-a"],
};

describe("authorization policy", () => {
  it("never authorizes an unverified account", () => {
    expect(
      hasPermission(
        { verified: false, organizationRoles: ["developer_administrator"] },
        "system:diagnose",
      ),
    ).toBe(false);
  });

  it("gives students learning permissions without staff permissions", () => {
    expect(hasPermission(verifiedStudent, "curriculum:read")).toBe(true);
    expect(hasPermission(verifiedStudent, "cohort:manage")).toBe(false);
    expect(hasPermission(verifiedStudent, "curriculum:audit")).toBe(false);
  });

  it("isolates learners to their own cohort", () => {
    expect(canAccessCohort(verifiedStudent, "cohort-a")).toBe(true);
    expect(canAccessCohort(verifiedStudent, "cohort-b")).toBe(false);
  });

  it("lets instructors manage only assigned cohorts", () => {
    const instructor: AuthorizationContext = {
      verified: true,
      organizationRoles: ["instructor"],
      staffedCohortIds: ["cohort-a"],
    };
    expect(canManageCohort(instructor, "cohort-a")).toBe(true);
    expect(canManageCohort(instructor, "cohort-b")).toBe(false);
  });

  it("combines overlapping roles", () => {
    const editorInstructor: AuthorizationContext = {
      verified: true,
      organizationRoles: ["instructor", "curriculum_editor"],
    };
    expect(hasPermission(editorInstructor, "submission:evaluate")).toBe(true);
    expect(hasPermission(editorInstructor, "curriculum:publish")).toBe(true);
  });
});
