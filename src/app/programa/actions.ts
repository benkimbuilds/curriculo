"use server";

import { revalidatePath } from "next/cache";

import { requireVerifiedSession } from "@/modules/auth/session";
import { completeStudentLesson, recordStudentLessonView } from "./student-service";

export type LessonActionState = { status: "idle" | "success" | "error"; message: string };

export async function completeLessonAction(
  _previousState: LessonActionState,
  formData: FormData,
): Promise<LessonActionState> {
  const currentSession = await requireVerifiedSession().catch(() => null);
  if (!currentSession) return { status: "error", message: "Verifica tu correo o inicia sesión de nuevo." };
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const contentVersion = String(formData.get("contentVersion") ?? "");
  const week = Number(formData.get("week"));
  try {
    await completeStudentLesson({ userId: currentSession.user.id, enrollmentId, lessonId, week, contentVersion });
    revalidatePath("/dashboard");
    revalidatePath("/programa");
    revalidatePath(`/programa/semana/${week}`);
    revalidatePath(`/programa/semana/${week}/leccion/${lessonId}`);
    return { status: "success", message: "Lección completada" };
  } catch {
    return { status: "error", message: "No pudimos guardar tu avance. Intenta de nuevo." };
  }
}

export async function recordLessonViewAction(input: { enrollmentId: string; lessonId: string; week: number; contentVersion: string; resumePosition?: number }) {
  try {
    const currentSession = await requireVerifiedSession();
    await recordStudentLessonView({ ...input, userId: currentSession.user.id });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
