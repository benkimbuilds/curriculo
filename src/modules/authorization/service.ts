import { and, eq } from "drizzle-orm";

import { db, type Database } from "@/db";
import {
  cohortMemberships,
  cohortStaffAssignments,
  roleAssignments,
  user,
} from "@/db/schema";
import {
  hasPermission,
  type AuthorizationContext,
  type Permission,
  type PlatformRole,
} from "@/modules/authorization/policy";
import { AuthorizationDeniedError } from "@/shared/errors";

export async function loadAuthorizationContext(
  userId: string,
  organizationId: string,
  database: Database = db,
): Promise<AuthorizationContext> {
  const [account, roles, staffedCohorts, memberCohorts] = await Promise.all([
    database
      .select({ emailVerified: user.emailVerified })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1),
    database
      .select({ role: roleAssignments.role })
      .from(roleAssignments)
      .where(
        and(
          eq(roleAssignments.userId, userId),
          eq(roleAssignments.organizationId, organizationId),
        ),
      ),
    database
      .select({ cohortId: cohortStaffAssignments.cohortId })
      .from(cohortStaffAssignments)
      .where(eq(cohortStaffAssignments.userId, userId)),
    database
      .select({ cohortId: cohortMemberships.cohortId })
      .from(cohortMemberships)
      .where(
        and(
          eq(cohortMemberships.userId, userId),
          eq(cohortMemberships.status, "active"),
        ),
      ),
  ]);

  return {
    verified: account[0]?.emailVerified === true,
    organizationRoles: roles.map(({ role }) => role as PlatformRole),
    staffedCohortIds: staffedCohorts.map(({ cohortId }) => cohortId),
    memberCohortIds: memberCohorts.map(({ cohortId }) => cohortId),
  };
}

export async function requirePermission(
  userId: string,
  organizationId: string,
  permission: Permission,
  database: Database = db,
): Promise<AuthorizationContext> {
  const context = await loadAuthorizationContext(userId, organizationId, database);
  if (!hasPermission(context, permission)) throw new AuthorizationDeniedError(permission);
  return context;
}
