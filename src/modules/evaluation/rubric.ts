import type { CriterionResult, RubricDefinition } from "./types";

export class RubricValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Invalid rubric: ${issues.join("; ")}`);
    this.name = "RubricValidationError";
    this.issues = Object.freeze([...issues]);
  }
}

export class RubricResultValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RubricResultValidationError";
  }
}

export function validateRubric(rubric: RubricDefinition): Readonly<RubricDefinition> {
  const issues: string[] = [];
  if (!rubric.id.trim()) issues.push("id is required");
  if (
    (typeof rubric.version === "string" && !rubric.version.trim()) ||
    (typeof rubric.version === "number" &&
      (!Number.isSafeInteger(rubric.version) || rubric.version < 1))
  ) {
    issues.push("version is required and must be positive");
  }
  if (!(rubric.passThreshold >= 0 && rubric.passThreshold <= 1)) {
    issues.push("passThreshold must be between 0 and 1");
  }
  if (rubric.criteria.length === 0) issues.push("at least one criterion is required");

  const ids = new Set<string>();
  let totalWeight = 0;
  for (const criterion of rubric.criteria) {
    if (!criterion.id.trim()) issues.push("criterion id is required");
    if (ids.has(criterion.id)) issues.push(`criterion id ${criterion.id} is duplicated`);
    ids.add(criterion.id);
    if (!criterion.label.trim()) issues.push(`criterion ${criterion.id} needs a label`);
    if (!criterion.evidenceDescription.trim()) {
      issues.push(`criterion ${criterion.id} needs an evidence description`);
    }
    if (!Number.isFinite(criterion.weight) || criterion.weight <= 0) {
      issues.push(`criterion ${criterion.id} weight must be greater than zero`);
    } else {
      totalWeight += criterion.weight;
    }
  }
  if (Math.abs(totalWeight - 1) > 0.000_001) issues.push("criterion weights must total 1");
  if (issues.length > 0) throw new RubricValidationError(issues);

  return Object.freeze({
    ...rubric,
    criteria: Object.freeze(rubric.criteria.map((criterion) => Object.freeze({ ...criterion }))),
  });
}

export function scoreRubric(
  rubric: RubricDefinition,
  results: readonly CriterionResult[],
): { readonly state: "passed" | "failed" | "needs_review"; readonly score: number | null } {
  validateRubric(rubric);
  const expectedIds = new Set(rubric.criteria.map(({ id }) => id));
  const resultById = new Map<string, CriterionResult>();
  for (const result of results) {
    if (!expectedIds.has(result.criterionId)) {
      throw new RubricResultValidationError(`Unknown criterion result ${result.criterionId}`);
    }
    if (resultById.has(result.criterionId)) {
      throw new RubricResultValidationError(`Duplicate criterion result ${result.criterionId}`);
    }
    resultById.set(result.criterionId, result);
  }

  if (
    rubric.criteria.some(
      (criterion) =>
        !resultById.has(criterion.id) || resultById.get(criterion.id)?.status === "needs_review",
    )
  ) {
    return { state: "needs_review", score: null };
  }

  const score = rubric.criteria.reduce(
    (sum, criterion) =>
      sum + (resultById.get(criterion.id)?.status === "passed" ? criterion.weight : 0),
    0,
  );
  const requiredFailed = rubric.criteria.some(
    (criterion) => criterion.required && resultById.get(criterion.id)?.status !== "passed",
  );
  return {
    state: !requiredFailed && score + Number.EPSILON >= rubric.passThreshold ? "passed" : "failed",
    score,
  };
}
