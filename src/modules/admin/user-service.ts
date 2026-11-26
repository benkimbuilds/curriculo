import { randomInt } from "node:crypto";
import { and, count, desc, eq, ilike, inArray, ne, or, type SQL } from "drizzle-orm";

import { db } from "@/db";
import {
  account,
  announcements,
  cohortInvitations,
  enrollments,
  evaluationOverrides,
  evaluationRuns,
  interventionNotes,
  mentoringAssignments,
  moderationActions,
  roleAssignments,
  session as authSession,
  submissions,
  user,
} from "@/db/schema";
import { recordAuditEvent } from "@/modules/audit/service";
import { hashPassword } from "@/modules/auth/password";
import { requirePermission } from "@/modules/authorization/service";
import type { PlatformRole } from "@/modules/authorization/policy";
import { ApplicationError } from "@/shared/errors";

const LOWERCASE = "abcdefghijkmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%&*-_=+";
const ALL_CHARS = LOWERCASE + UPPERCASE + DIGITS + SYMBOLS;

export function generateTemporaryPassword(length = 16): string {
  const safeLength = Math.max(12, Math.min(length, 64));
  const chars: string[] = [
    LOWERCASE[randomInt(LOWERCASE.length)]!,
    UPPERCASE[randomInt(UPPERCASE.length)]!,
    DIGITS[randomInt(DIGITS.length)]!,
    SYMBOLS[randomInt(SYMBOLS.length)]!,
  ];

  while (chars.length < safeLength) {
    chars.push(ALL_CHARS[randomInt(ALL_CHARS.length)]!);
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }

  return chars.join("");
}

export type AdminPasswordResetInput = {
  actorUserId: string;
  organizationId: string;
  targetUserId: string;
  password?: string;
};

export type AdminPasswordResetResult = {
  userId: string;
  email: string;
  name: string;
  temporaryPassword: string;
};

export async function resetUserPasswordAsAdmin(
  input: AdminPasswordResetInput,
): Promise<AdminPasswordResetResult> {
  const actor = await requirePermission(input.actorUserId, input.organizationId, "role:manage");

  const [targetUser] = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, input.targetUserId))
    .limit(1);

  if (!targetUser) {
    throw new ApplicationError("USER_NOT_FOUND", "La cuenta ya no existe.", 404);
  }

  const targetRoles = await db
    .select({ role: roleAssignments.role })
    .from(roleAssignments)
    .where(
      and(
        eq(roleAssignments.organizationId, input.organizationId),
        eq(roleAssignments.userId, input.targetUserId),
      ),
    );

  if (
    targetRoles.some(({ role }) => role === "developer_administrator") &&
    !actor.organizationRoles.includes("developer_administrator")
  ) {
    throw new ApplicationError(
      "AUTHORIZATION_DENIED",
      "Solo una administración técnica puede reiniciar la contraseña de esta cuenta.",
      403,
    );
  }

  const plainPassword = input.password?.trim() || generateTemporaryPassword(16);
  if (plainPassword.length < 10 || plainPassword.length > 128) {
    throw new ApplicationError(
      "INVALID_PASSWORD",
      "La contraseña debe tener entre 10 y 128 caracteres.",
      400,
    );
  }

  const passwordHash = await hashPassword(plainPassword);
  const now = new Date();

  await db.transaction(async (tx) => {
    const [existingCredential] = await tx
      .select({ id: account.id })
      .from(account)
      .where(and(eq(account.userId, input.targetUserId), eq(account.providerId, "credential")))
      .limit(1);

    if (existingCredential) {
      await tx
        .update(account)
        .set({ password: passwordHash, updatedAt: now })
        .where(eq(account.id, existingCredential.id));
    } else {
      await tx.insert(account).values({
        accountId: input.targetUserId,
        providerId: "credential",
        issuer: "credential",
        userId: input.targetUserId,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      });
    }

    await tx.delete(authSession).where(eq(authSession.userId, input.targetUserId));

    await recordAuditEvent(tx, {
      actorUserId: input.actorUserId,
      organizationId: input.organizationId,
      eventType: "organization.user_password_reset",
      subjectType: "user",
      subjectId: input.targetUserId,
      metadata: { mode: input.password ? "custom" : "generated" },
    });
  });

  return {
    userId: targetUser.id,
    email: targetUser.email,
    name: targetUser.name,
    temporaryPassword: plainPassword,
  };
}

export type AdminHardDeleteInput = {
  actorUserId: string;
  organizationId: string;
  targetUserId: string;
};

export type AdminHardDeleteResult = {
  userId: string;
  email: string;
  name: string;
};

export async function hardDeleteUserAsAdmin(
  input: AdminHardDeleteInput,
): Promise<AdminHardDeleteResult> {
  const actor = await requirePermission(input.actorUserId, input.organizationId, "role:manage");

  if (input.targetUserId === input.actorUserId) {
    throw new ApplicationError("CANNOT_DELETE_SELF", "No puedes eliminar tu propia cuenta.", 400);
  }

  const [targetUser] = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, input.targetUserId))
    .limit(1);

  if (!targetUser) {
    throw new ApplicationError("USER_NOT_FOUND", "La cuenta ya no existe.", 404);
  }

  const targetRoles = await db
    .select({ role: roleAssignments.role })
    .from(roleAssignments)
    .where(
      and(
        eq(roleAssignments.organizationId, input.organizationId),
        eq(roleAssignments.userId, input.targetUserId),
      ),
    );

  const isTargetDevAdmin = targetRoles.some(({ role }) => role === "developer_administrator");
  if (isTargetDevAdmin && !actor.organizationRoles.includes("developer_administrator")) {
    throw new ApplicationError(
      "AUTHORIZATION_DENIED",
      "Solo una administración técnica puede eliminar esta cuenta.",
      403,
    );
  }

  const isTargetAdmin = targetRoles.some(
    ({ role }) => role === "administrator" || role === "developer_administrator",
  );
  if (isTargetAdmin) {
    const remainingAdmins = await db
      .select({ userId: roleAssignments.userId })
      .from(roleAssignments)
      .where(
        and(
          eq(roleAssignments.organizationId, input.organizationId),
          ne(roleAssignments.userId, input.targetUserId),
          inArray(roleAssignments.role, ["administrator", "developer_administrator"]),
        ),
      )
      .limit(1);

    if (remainingAdmins.length === 0) {
      throw new ApplicationError(
        "LAST_ADMINISTRATOR",
        "No se puede eliminar la última cuenta con rol de administración.",
        400,
      );
    }
  }

  await db.transaction(async (tx) => {
    // Reassign non-cascading (onDelete: "restrict") authoring references to the actor
    await tx
      .update(announcements)
      .set({ authorUserId: input.actorUserId })
      .where(eq(announcements.authorUserId, input.targetUserId));
    await tx
      .update(mentoringAssignments)
      .set({ assignedByUserId: input.actorUserId })
      .where(eq(mentoringAssignments.assignedByUserId, input.targetUserId));
    await tx
      .update(cohortInvitations)
      .set({ invitedByUserId: input.actorUserId })
      .where(eq(cohortInvitations.invitedByUserId, input.targetUserId));
    await tx
      .update(evaluationOverrides)
      .set({ reviewerUserId: input.actorUserId })
      .where(eq(evaluationOverrides.reviewerUserId, input.targetUserId));
    await tx
      .update(moderationActions)
      .set({ actorUserId: input.actorUserId })
      .where(eq(moderationActions.actorUserId, input.targetUserId));
    await tx
      .update(interventionNotes)
      .set({ authorUserId: input.actorUserId })
      .where(eq(interventionNotes.authorUserId, input.targetUserId));

    // Clean up evaluationOverrides referencing evaluationRuns of the user's submissions (onDelete: "restrict")
    const userEnrollments = await tx
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(eq(enrollments.userId, input.targetUserId));

    if (userEnrollments.length > 0) {
      const userSubmissions = await tx
        .select({ id: submissions.id })
        .from(submissions)
        .where(inArray(submissions.enrollmentId, userEnrollments.map((e) => e.id)));

      if (userSubmissions.length > 0) {
        const runs = await tx
          .select({ id: evaluationRuns.id })
          .from(evaluationRuns)
          .where(inArray(evaluationRuns.submissionId, userSubmissions.map((s) => s.id)));

        if (runs.length > 0) {
          await tx
            .delete(evaluationOverrides)
            .where(inArray(evaluationOverrides.evaluationRunId, runs.map((r) => r.id)));
        }
      }
    }

    await tx.delete(user).where(eq(user.id, input.targetUserId));

    await recordAuditEvent(tx, {
      actorUserId: input.actorUserId,
      organizationId: input.organizationId,
      eventType: "organization.user_deleted",
      subjectType: "user",
      subjectId: input.targetUserId,
      metadata: {
        deletedEmail: targetUser.email,
        deletedName: targetUser.name,
        hardDelete: true,
      },
    });
  });

  return {
    userId: targetUser.id,
    email: targetUser.email,
    name: targetUser.name,
  };
}

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  roles: PlatformRole[];
  enrollment: { mode: "self_paced" | "facilitated"; status: string } | null;
};

export type PaginatedAdminUsersResult = {
  items: AdminUserListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function listPaginatedAdminUsers({
  organizationId,
  search,
  role,
  page = 1,
  pageSize = 10,
}: {
  organizationId: string;
  search?: string;
  role?: PlatformRole;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedAdminUsersResult> {
  const safePageSize = Math.max(1, Math.min(pageSize, 100));
  const requestedPage = Math.max(1, Math.floor(page));

  const conditions: SQL[] = [];
  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    const pattern = `%${trimmedSearch}%`;
    const searchCond = or(ilike(user.name, pattern), ilike(user.email, pattern));
    if (searchCond) conditions.push(searchCond);
  }

  if (role) {
    const matchingRoleUserIds = db
      .select({ userId: roleAssignments.userId })
      .from(roleAssignments)
      .where(
        and(
          eq(roleAssignments.organizationId, organizationId),
          eq(roleAssignments.role, role),
        ),
      );
    conditions.push(inArray(user.id, matchingRoleUserIds));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countRow] = await db
    .select({ value: count() })
    .from(user)
    .where(whereClause);

  const totalCount = countRow?.value ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
  const safePage = Math.min(requestedPage, totalPages);
  const offset = (safePage - 1) * safePageSize;

  const accounts = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(whereClause)
    .orderBy(desc(user.createdAt))
    .limit(safePageSize)
    .offset(offset);

  const userIds = accounts.map((a) => a.id);
  const [rolesRows, enrollmentRows] = userIds.length
    ? await Promise.all([
        db
          .select({ userId: roleAssignments.userId, role: roleAssignments.role })
          .from(roleAssignments)
          .where(
            and(
              eq(roleAssignments.organizationId, organizationId),
              inArray(roleAssignments.userId, userIds),
            ),
          ),
        db
          .select({
            userId: enrollments.userId,
            mode: enrollments.mode,
            status: enrollments.status,
          })
          .from(enrollments)
          .where(inArray(enrollments.userId, userIds)),
      ])
    : [[], []];

  const rolesByUser = new Map<string, PlatformRole[]>();
  for (const row of rolesRows) {
    const existing = rolesByUser.get(row.userId) ?? [];
    existing.push(row.role);
    rolesByUser.set(row.userId, existing);
  }

  const enrollmentByUser = new Map<string, { mode: "self_paced" | "facilitated"; status: string }>();
  for (const row of enrollmentRows) {
    if (!enrollmentByUser.has(row.userId)) {
      enrollmentByUser.set(row.userId, { mode: row.mode, status: row.status });
    }
  }

  return {
    items: accounts.map((accountItem) => ({
      ...accountItem,
      roles: rolesByUser.get(accountItem.id) ?? [],
      enrollment: enrollmentByUser.get(accountItem.id) ?? null,
    })),
    totalCount,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}
