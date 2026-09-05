export const permissions = [
  "curriculum:read",
  "curriculum:audit",
  "curriculum:edit",
  "curriculum:publish",
  "submission:create",
  "submission:read-own",
  "submission:evaluate",
  "peer-feedback:create",
  "gallery:read",
  "cohort:read-own",
  "cohort:manage",
  "roster:read",
  "intervention:manage",
  "moderation:manage",
  "role:manage",
  "system:diagnose",
] as const;

export type Permission = (typeof permissions)[number];
export type PlatformRole =
  | "student"
  | "instructor"
  | "administrator"
  | "curriculum_editor"
  | "developer_administrator";

const rolePermissions: Record<PlatformRole, ReadonlySet<Permission>> = {
  student: new Set([
    "curriculum:read",
    "submission:create",
    "submission:read-own",
    "peer-feedback:create",
    "gallery:read",
    "cohort:read-own",
  ]),
  instructor: new Set([
    "curriculum:read",
    "submission:evaluate",
    "gallery:read",
    "cohort:read-own",
    "roster:read",
    "intervention:manage",
    "moderation:manage",
  ]),
  administrator: new Set([
    "curriculum:read",
    "submission:evaluate",
    "gallery:read",
    "cohort:read-own",
    "cohort:manage",
    "roster:read",
    "intervention:manage",
    "moderation:manage",
    "role:manage",
  ]),
  curriculum_editor: new Set([
    "curriculum:read",
    "curriculum:audit",
    "curriculum:edit",
    "curriculum:publish",
  ]),
  developer_administrator: new Set(permissions),
};

export type AuthorizationContext = {
  verified: boolean;
  organizationRoles: readonly PlatformRole[];
  staffedCohortIds?: readonly string[];
  memberCohortIds?: readonly string[];
};

export function hasPermission(
  context: AuthorizationContext,
  permission: Permission,
): boolean {
  if (!context.verified) return false;
  return context.organizationRoles.some((role) => rolePermissions[role].has(permission));
}

export function canAccessCohort(
  context: AuthorizationContext,
  cohortId: string,
): boolean {
  if (!context.verified) return false;
  if (context.organizationRoles.includes("administrator") || context.organizationRoles.includes("developer_administrator")) {
    return true;
  }
  return (
    context.staffedCohortIds?.includes(cohortId) === true ||
    context.memberCohortIds?.includes(cohortId) === true
  );
}

export function canManageCohort(
  context: AuthorizationContext,
  cohortId: string,
): boolean {
  if (!hasPermission(context, "cohort:manage") && !hasPermission(context, "roster:read")) {
    return false;
  }
  if (context.organizationRoles.includes("administrator") || context.organizationRoles.includes("developer_administrator")) {
    return true;
  }
  return context.staffedCohortIds?.includes(cohortId) === true;
}
