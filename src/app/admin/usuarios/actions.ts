"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentSession } from "@/modules/auth/session";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { grantOrganizationRole, revokeOrganizationRole } from "@/modules/cohorts/service";
import { recordAuditEvent } from "@/modules/audit/service";
import { requirePermission } from "@/modules/authorization/service";
import { db } from "@/db";
import { roleAssignments, session as authSession, user } from "@/db/schema";
import { ApplicationError } from "@/shared/errors";

const roleSchema = z.enum(["student", "instructor", "administrator", "curriculum_editor", "developer_administrator"]);
export type UserRoleActionState = { status: "idle" | "success" | "error"; message: string };
export type QuickUserActionState = UserRoleActionState;

export async function manageUserRoleAction(
  _previous: UserRoleActionState,
  formData: FormData,
): Promise<UserRoleActionState> {
  try {
    const input = z.object({
      userId: z.string().uuid(),
      role: roleSchema,
      operation: z.enum(["grant", "revoke"]),
      confirmed: z.literal("true").optional(),
    }).parse(Object.fromEntries(formData));
    if (input.operation === "revoke" && input.confirmed !== "true") {
      return { status: "error", message: "Confirma la revocación antes de continuar." };
    }
    const session = await requireCurrentSession();
    const organizationId = await resolveDefaultOrganizationId();
    if (input.operation === "grant") {
      await grantOrganizationRole(organizationId, input.userId, input.role, session.user.id);
    } else {
      await revokeOrganizationRole(organizationId, input.userId, input.role, session.user.id);
    }
    revalidatePath("/admin/usuarios");
    revalidatePath(`/admin/usuarios/${input.userId}`);
    return { status: "success", message: input.operation === "grant" ? "Rol asignado." : "Rol revocado." };
  } catch (error) {
    if (error instanceof ApplicationError && error.code === "AUTHORIZATION_DENIED") return { status: "error", message: "No tienes permiso para administrar roles." };
    if (error instanceof z.ZodError) return { status: "error", message: "La solicitud no es válida." };
    if (error instanceof Error && error.message === "LAST_ADMINISTRATOR") return { status: "error", message: "No se puede quitar el último rol de administración." };
    return { status: "error", message: "No pudimos actualizar el rol. Inténtalo de nuevo." };
  }
}

export async function quickUserAction(
  _previous: QuickUserActionState,
  formData: FormData,
): Promise<QuickUserActionState> {
  try {
    const input = z.object({
      userId: z.string().uuid(),
      operation: z.enum(["update", "toggle"]),
      name: z.string().trim().min(2).max(120).optional(),
      active: z.enum(["true", "false"]).optional(),
    }).parse(Object.fromEntries(formData));
    const requestedRoles = z.array(roleSchema).parse(formData.getAll("roles"));
    const session = await requireCurrentSession();
    const organizationId = await resolveDefaultOrganizationId();
    const actor = await requirePermission(session.user.id, organizationId, "role:manage");
    const [account] = await db.select({ id: user.id, email: user.email, isActive: user.isActive }).from(user).where(eq(user.id, input.userId)).limit(1);
    if (!account) return { status: "error", message: "La cuenta ya no existe." };
    const currentRoles = await db.select({ role: roleAssignments.role }).from(roleAssignments).where(and(eq(roleAssignments.organizationId, organizationId), eq(roleAssignments.userId, input.userId)));

    if (input.operation === "toggle") {
      if (input.userId === session.user.id) return { status: "error", message: "No puedes desactivar tu propia cuenta." };
      if (currentRoles.some(({ role }) => role === "developer_administrator") && !actor.organizationRoles.includes("developer_administrator")) {
        return { status: "error", message: "Solo una administración técnica puede cambiar esta cuenta." };
      }
      const isActive = input.active === "true";
      await db.transaction(async (transaction) => {
        await transaction.update(user).set({ isActive, updatedAt: new Date() }).where(eq(user.id, input.userId));
        if (!isActive) await transaction.delete(authSession).where(eq(authSession.userId, input.userId));
        await recordAuditEvent(transaction, { actorUserId: session.user.id, organizationId, eventType: isActive ? "organization.user_activated" : "organization.user_deactivated", subjectType: "user", subjectId: input.userId });
      });
      revalidatePath("/admin/usuarios");
      revalidatePath(`/admin/usuarios/${input.userId}`);
      return { status: "success", message: isActive ? "Cuenta reactivada." : "Cuenta desactivada y sesiones cerradas." };
    }

    const name = input.name?.trim();
    if (!name) return { status: "error", message: "Escribe un nombre válido." };
    const existingRoles = currentRoles.map(({ role }) => role);
    for (const role of requestedRoles.filter((role) => !existingRoles.includes(role))) await grantOrganizationRole(organizationId, input.userId, role, session.user.id);
    for (const role of existingRoles.filter((role) => !requestedRoles.includes(role))) await revokeOrganizationRole(organizationId, input.userId, role, session.user.id);
    await db.transaction(async (transaction) => {
      await transaction.update(user).set({ name, updatedAt: new Date() }).where(eq(user.id, input.userId));
      await recordAuditEvent(transaction, { actorUserId: session.user.id, organizationId, eventType: "organization.user_updated", subjectType: "user", subjectId: input.userId, metadata: { fields: ["name", "roles"] } });
    });
    revalidatePath("/admin/usuarios");
    revalidatePath(`/admin/usuarios/${input.userId}`);
    return { status: "success", message: "Cuenta actualizada." };
  } catch (error) {
    if (error instanceof ApplicationError && error.code === "AUTHORIZATION_DENIED") return { status: "error", message: "No tienes permiso para administrar esta cuenta." };
    if (error instanceof z.ZodError) return { status: "error", message: "Revisa los datos de la cuenta." };
    if (error instanceof Error && error.message === "LAST_ADMINISTRATOR") return { status: "error", message: "No se puede quitar el último rol de administración." };
    return { status: "error", message: "No pudimos actualizar la cuenta. Inténtalo de nuevo." };
  }
}
