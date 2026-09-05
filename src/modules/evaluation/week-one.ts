import { fetchPublicHtml, PublicHttpSafetyError, type PublicHttpDependencies, type PublicHttpPolicy } from "./public-http";
import { scoreRubric, validateRubric } from "./rubric";
import type { CriterionResult, EvaluationResult, RubricDefinition } from "./types";

export const WEEK_ONE_EVALUATOR_VERSION = "week-one-public-html@1";
export const WEEK_ONE_CURRICULUM_RUBRIC = Object.freeze({
  id: "week-01-rubric-v1",
  version: "1",
  functionalityCriterionId: "week-01-criterion-functionality",
});

export const WEEK_ONE_RUBRIC: Readonly<RubricDefinition> = validateRubric({
  id: "week-01-public-deployment-checks",
  version: 1,
  passThreshold: 1,
  criteria: [
    {
      id: "successful-http-response",
      label: "La pagina publica responde correctamente",
      kind: "deterministic",
      weight: 0.1,
      required: true,
      evidenceDescription: "The final deployment returns an HTTP 2xx response.",
    },
    {
      id: "secure-deployment",
      label: "La pagina esta publicada con HTTPS",
      kind: "deterministic",
      weight: 0.1,
      required: true,
      evidenceDescription: "The final deployment uses HTTPS.",
    },
    {
      id: "html-document",
      label: "La respuesta es un documento HTML",
      kind: "deterministic",
      weight: 0.1,
      required: true,
      evidenceDescription: "The response declares HTML content and contains an html element.",
    },
    {
      id: "descriptive-title",
      label: "El documento tiene un titulo descriptivo",
      kind: "deterministic",
      weight: 0.15,
      required: true,
      evidenceDescription: "A non-empty title element identifies the page.",
    },
    {
      id: "primary-heading",
      label: "La pagina tiene un encabezado principal",
      kind: "deterministic",
      weight: 0.15,
      required: true,
      evidenceDescription: "The page contains exactly one non-empty h1 element.",
    },
    {
      id: "main-landmark",
      label: "El contenido principal usa main",
      kind: "deterministic",
      weight: 0.2,
      required: true,
      evidenceDescription: "The page contains exactly one main landmark.",
    },
    {
      id: "semantic-structure",
      label: "La pagina usa estructura semantica",
      kind: "deterministic",
      weight: 0.2,
      required: true,
      evidenceDescription: "The page contains header, nav, section, and footer elements.",
    },
  ],
});

function removeIgnoredHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
}

function elementContents(html: string, tag: string): string[] {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, "gi");
  return [...html.matchAll(pattern)].map((match) =>
    match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
}

function countOpeningTags(html: string, tag: string): number {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].length;
}

function criterion(
  criterionId: string,
  passed: boolean,
  passedEvidence: string,
  failedEvidence: string,
): Readonly<CriterionResult> {
  return Object.freeze({
    criterionId,
    status: passed ? "passed" : "failed",
    evidence: passed ? passedEvidence : failedEvidence,
  });
}

function inspectHtml(
  finalUrl: string,
  status: number,
  contentType: string,
  source: string,
): readonly CriterionResult[] {
  const html = removeIgnoredHtml(source);
  const titles = elementContents(html, "title").filter(Boolean);
  const headings = elementContents(html, "h1").filter(Boolean);
  const mainCount = countOpeningTags(html, "main");
  const requiredSemanticTags = ["header", "nav", "section", "footer"];
  const missingSemanticTags = requiredSemanticTags.filter((tag) => countOpeningTags(html, tag) < 1);
  const isHtml = /^(?:text\/html|application\/xhtml\+xml)(?:\s*;|$)/i.test(contentType) &&
    /<html\b[^>]*>/i.test(html);

  return Object.freeze([
    criterion(
      "secure-deployment",
      new URL(finalUrl).protocol === "https:",
      "The final deployment uses HTTPS.",
      "Publish the final deployment with HTTPS.",
    ),
    criterion(
      "successful-http-response",
      status >= 200 && status < 300,
      `HTTP ${status}.`,
      `Expected HTTP 2xx but received ${status || "no status"}.`,
    ),
    criterion(
      "html-document",
      isHtml,
      `Content-Type is ${contentType.split(";")[0] || "text/html"} and an html element is present.`,
      "The response must declare HTML content and contain an html element.",
    ),
    criterion(
      "descriptive-title",
      titles.length > 0,
      "A non-empty title element is present.",
      "Add a non-empty title element.",
    ),
    criterion(
      "primary-heading",
      headings.length === 1,
      "Exactly one non-empty h1 is present.",
      `Expected exactly one non-empty h1; found ${headings.length}.`,
    ),
    criterion(
      "main-landmark",
      mainCount === 1,
      "Exactly one main landmark is present.",
      `Expected exactly one main landmark; found ${mainCount}.`,
    ),
    criterion(
      "semantic-structure",
      missingSemanticTags.length === 0,
      "The page contains header, nav, section, and footer elements.",
      `Missing semantic elements: ${missingSemanticTags.join(", ") || "none"}.`,
    ),
  ]);
}

export function mapWeekOneChecksToCurriculumRubric(
  checks: readonly CriterionResult[],
): readonly Readonly<CriterionResult>[] {
  const failed = checks.filter(({ status }) => status === "failed");
  const needsReview = checks.filter(({ status }) => status === "needs_review");
  const status = needsReview.length > 0 ? "needs_review" : failed.length > 0 ? "failed" : "passed";
  const evidence = checks
    .map(({ criterionId, status: checkStatus, evidence: detail }) =>
      `${criterionId}: ${checkStatus} (${detail})`,
    )
    .join(" ");
  return Object.freeze([
    Object.freeze({
      criterionId: WEEK_ONE_CURRICULUM_RUBRIC.functionalityCriterionId,
      status,
      evidence,
    }),
  ]);
}

function safeErrorCode(error: unknown): string {
  if (error instanceof PublicHttpSafetyError) return error.code;
  return "evaluator_unavailable";
}

export async function evaluateWeekOneDeployment(
  deploymentUrl: string,
  options: {
    readonly policy?: PublicHttpPolicy;
    readonly dependencies?: PublicHttpDependencies;
  } = {},
): Promise<Readonly<EvaluationResult>> {
  try {
    const response = await fetchPublicHtml(
      deploymentUrl,
      options.policy,
      options.dependencies,
    );
    const criteria = inspectHtml(
      response.finalUrl,
      response.status,
      response.headers["content-type"] ?? "",
      response.body,
    );
    const scored = scoreRubric(WEEK_ONE_RUBRIC, criteria);
    return Object.freeze({
      state: scored.state,
      score: scored.score,
      evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
      finalUrl: response.finalUrl,
      criteria,
      rubricId: WEEK_ONE_CURRICULUM_RUBRIC.id,
      rubricVersion: WEEK_ONE_CURRICULUM_RUBRIC.version,
      rubricCriteria: mapWeekOneChecksToCurriculumRubric(criteria),
    });
  } catch (error) {
    const reviewReason = safeErrorCode(error);
    return Object.freeze({
      state: "needs_review",
      score: null,
      evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
      finalUrl: null,
      criteria: Object.freeze([]),
      rubricId: WEEK_ONE_CURRICULUM_RUBRIC.id,
      rubricVersion: WEEK_ONE_CURRICULUM_RUBRIC.version,
      rubricCriteria: Object.freeze([
        Object.freeze({
          criterionId: WEEK_ONE_CURRICULUM_RUBRIC.functionalityCriterionId,
          status: "needs_review" as const,
          evidence: `Automated deployment inspection did not finish: ${reviewReason}.`,
        }),
      ]),
      reviewReason,
    });
  }
}
