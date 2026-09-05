"use server";

import { revalidatePath } from "next/cache";

import { requireVerifiedSession } from "@/modules/auth/session";
import { SubmissionValidationError } from "@/modules/projects";
import { createStudentSubmission } from "./submission-service";

export type SubmissionActionState = {
  status: "idle" | "success" | "error";
  message: string;
  attempt?: number;
};

export async function submitProjectAction(
  _previousState: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  const currentSession = await requireVerifiedSession().catch(() => null);
  if (!currentSession) return { status: "error", message: "Verifica tu correo o inicia sesión de nuevo." };
  const week = Number(formData.get("week"));
  if (formData.get("ownership") !== "on") {
    return { status: "error", message: "Confirma que el trabajo es tuyo y que no contiene datos sensibles." };
  }
  try {
    const submission = await createStudentSubmission({
      userId: currentSession.user.id,
      enrollmentId: String(formData.get("enrollmentId") ?? ""),
      week,
      repositoryUrl: String(formData.get("repositoryUrl") ?? ""),
      commitSha: String(formData.get("commitSha") ?? ""),
      deploymentUrl: String(formData.get("deploymentUrl") ?? ""),
      reflection: String(formData.get("reflection") ?? ""),
    });
    revalidatePath("/dashboard");
    revalidatePath("/programa");
    revalidatePath(`/programa/semana/${week}`);
    revalidatePath(`/proyectos/${week}/entrega`);
    return { status: "success", message: "Entrega recibida. Guardamos esta versión exacta de tu proyecto.", attempt: submission.attempt };
  } catch (error) {
    if (error instanceof SubmissionValidationError) {
      const message = error.issues.some((issue) => issue.includes("commitSha"))
        ? "Usa el SHA completo del commit (40 caracteres hexadecimales)."
        : error.issues.some((issue) => issue.includes("repositoryUrl"))
          ? "Comparte la URL HTTPS de un repositorio público de GitHub."
          : error.issues.some((issue) => issue.includes("reflection"))
            ? "Tu reflexión debe tener entre 20 y 1,000 caracteres."
            : "Revisa los enlaces y datos de tu entrega.";
      return { status: "error", message };
    }
    return { status: "error", message: "No pudimos guardar la entrega. Intenta de nuevo." };
  }
}
