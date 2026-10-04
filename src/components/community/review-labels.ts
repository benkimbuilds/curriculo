import type { FeedbackNextStep, GalleryVisibility, RubricFeedbackMark } from "@/modules/community/types";

export const RUBRIC_MARK_OPTIONS = [
  ["demonstrated", "Logrado"],
  ["partially_demonstrated", "Parcialmente logrado"],
  ["not_yet_demonstrated", "Aún no"],
  ["not_observed", "No se observa"],
] as const satisfies ReadonlyArray<readonly [RubricFeedbackMark, string]>;

export const NEXT_STEP_OPTIONS = [
  ["review_requirements", "Revisar requisitos"],
  ["improve_accessibility", "Mejorar accesibilidad"],
  ["improve_responsiveness", "Mejorar adaptación a pantallas"],
  ["improve_code_clarity", "Aclarar el código"],
  ["test_edge_cases", "Probar casos límite"],
  ["ready_for_resubmission", "Listo para volver a entregar"],
] as const satisfies ReadonlyArray<readonly [FeedbackNextStep, string]>;

const visibilityLabels: Record<GalleryVisibility, string> = {
  private: "Solo tú",
  cohort: "Solo tu cohorte",
  verified_users: "Comunidad verificada",
};

const markLabels = Object.fromEntries(RUBRIC_MARK_OPTIONS) as Record<RubricFeedbackMark, string>;
const nextStepLabels = Object.fromEntries(NEXT_STEP_OPTIONS) as Record<FeedbackNextStep, string>;

export function visibilityLabel(visibility: GalleryVisibility): string {
  return visibilityLabels[visibility];
}

export function rubricMarkLabel(mark: RubricFeedbackMark): string {
  return markLabels[mark] ?? mark;
}

export function nextStepLabel(step: FeedbackNextStep): string {
  return nextStepLabels[step] ?? step;
}

export function reviewCountLabel(count: number): string {
  return count === 1 ? "1 revisión" : `${count} revisiones`;
}

export function projectCountLabel(count: number): string {
  return count === 1 ? "1 proyecto" : `${count} proyectos`;
}
