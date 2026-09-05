"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireCurrentSession } from "@/modules/auth/session";

import { addInterventionNote, reviewSubmission } from "./db-staff";

export async function addInterventionNoteAction(
  cohortId: string,
  learnerId: string,
  formData: FormData,
): Promise<void> {
  const session = await requireCurrentSession();
  const parsed = z
    .object({
      category: z.enum([
        "academic_support",
        "attendance_follow_up",
        "technical_support",
        "wellbeing_check_in",
        "accommodation",
        "other",
      ]),
      note: z.string().trim().min(3).max(2_000),
      followUpAt: z
        .string()
        .optional()
        .refine(
          (value) => value === undefined || !Number.isNaN(Date.parse(value)),
          "La fecha de seguimiento no es válida.",
        ),
    })
    .parse({
      category: formData.get("category"),
      note: formData.get("note"),
      followUpAt: formData.get("followUpAt") || undefined,
    });
  await addInterventionNote(session.user.id, {
    cohortId,
    learnerId,
    category: parsed.category,
    note: parsed.note,
    followUpAt: parsed.followUpAt ? new Date(parsed.followUpAt) : null,
  });
  const path = `/staff/cohortes/${cohortId}/estudiantes/${learnerId}`;
  revalidatePath(path);
  redirect(`${path}?nota=1`);
}

export async function reviewSubmissionAction(
  cohortId: string,
  learnerId: string,
  evaluationRunId: string,
  formData: FormData,
): Promise<void> {
  const session = await requireCurrentSession();
  const parsed = z.object({
    outcome: z.enum(["passed", "failed"]),
    reason: z.string().trim().min(10).max(1_000),
  }).parse({ outcome: formData.get("outcome"), reason: formData.get("reason") });
  await reviewSubmission(session.user.id, {
    cohortId,
    learnerId,
    evaluationRunId,
    outcome: parsed.outcome,
    reason: parsed.reason,
  });
  const path = `/staff/cohortes/${cohortId}/estudiantes/${learnerId}`;
  revalidatePath(path);
  redirect(`${path}?evaluacion=1`);
}
