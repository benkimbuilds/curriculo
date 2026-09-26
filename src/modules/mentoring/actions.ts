"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentSession } from "@/modules/auth/session";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { assignCohortDirectMentor, assignDirectMentor, endDirectMentorAssignment } from "./service";

export type MentoringActionState = { status: "idle" | "success" | "error"; message: string };

export async function assignDirectMentorAction(
  _previous: MentoringActionState,
  formData: FormData,
): Promise<MentoringActionState> {
  try {
    const input = z.object({
      studentUserId: z.uuid(),
      mentorUserId: z.uuid(),
    }).parse(Object.fromEntries(formData));
    const session = await requireCurrentSession();
    const organizationId = await resolveDefaultOrganizationId();
    await assignDirectMentor(organizationId, input.studentUserId, input.mentorUserId, session.user.id);
    revalidatePath("/staff/mentoria");
    revalidatePath(`/admin/usuarios/${input.studentUserId}`);
    return { status: "success", message: "Mentor directo asignado." };
  } catch (error) {
    if (error instanceof z.ZodError) return { status: "error", message: "Selecciona un estudiante y un mentor válidos." };
    if (error instanceof Error && error.message === "SELF_PACED_ENROLLMENT_REQUIRED") return { status: "error", message: "El estudiante no tiene una inscripción autodidacta activa." };
    if (error instanceof Error && error.message === "MENTOR_STUDENT_SAME_USER") return { status: "error", message: "Una persona no puede ser su propio mentor." };
    return { status: "error", message: "No pudimos asignar el mentor. Inténtalo de nuevo." };
  }
}

export async function assignCohortDirectMentorAction(cohortId: string, formData: FormData): Promise<void> {
  const input = z.object({ studentUserId: z.uuid(), mentorUserId: z.uuid() }).parse(Object.fromEntries(formData));
  const session = await requireCurrentSession();
  await assignCohortDirectMentor(cohortId, input.studentUserId, input.mentorUserId, session.user.id);
  revalidatePath(`/staff/cohortes/${cohortId}`);
}
export async function endDirectMentorAction(formData: FormData): Promise<void> {
  const assignmentId = z.uuid().parse(formData.get("assignmentId"));
  const session = await requireCurrentSession();
  const organizationId = await resolveDefaultOrganizationId();
  await endDirectMentorAssignment(organizationId, assignmentId, session.user.id);
  revalidatePath("/staff/mentoria");
}
