import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "@/db";
import {
  enrollments,
  evaluationResults,
  evaluationRuns,
  programVersions,
  submissions,
  user,
} from "@/db/schema";
import { WEEK_ONE_EVALUATOR_VERSION, type EvaluationResult } from "@/modules/evaluation";

import { processOneEvaluation } from "./evaluation-worker";

const integrationTest = process.env.TEST_DATABASE_URL ? it : it.skip;

async function queuedEvaluation() {
  const [version] = await db.select().from(programVersions).where(eq(programVersions.isDefault, true)).limit(1);
  if (!version) throw new Error("Seeded program version is required");
  const [learner] = await db.insert(user).values({
    name: "Evaluator learner",
    email: `${crypto.randomUUID()}@example.test`,
    emailVerified: true,
  }).returning();
  if (!learner) throw new Error("Learner was not created");
  const [enrollment] = await db.insert(enrollments).values({
    userId: learner.id,
    programVersionId: version.id,
    mode: "self_paced",
    status: "active",
  }).returning();
  if (!enrollment) throw new Error("Enrollment was not created");
  const [submission] = await db.insert(submissions).values({
    enrollmentId: enrollment.id,
    projectId: "week-01-project",
    projectVersion: "2026.1",
    attempt: 1,
    status: "evaluating",
    repositoryUrl: "https://github.com/example/project",
    deploymentUrl: "https://example.com",
    commitSha: "a".repeat(40),
    snapshot: { rubricVersion: "1" },
  }).returning();
  if (!submission) throw new Error("Submission was not created");
  const [run] = await db.insert(evaluationRuns).values({
    submissionId: submission.id,
    rubricId: "week-01-rubric-v1",
    rubricVersion: "1",
    evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
    idempotencyKey: `${submission.id}:${WEEK_ONE_EVALUATOR_VERSION}`,
  }).returning();
  if (!run) throw new Error("Evaluation was not created");
  return { submission, run };
}

const passedResult: Readonly<EvaluationResult> = {
  state: "passed",
  score: 1,
  evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
  finalUrl: "https://example.com/",
  criteria: [],
  rubricId: "week-01-rubric-v1",
  rubricVersion: "1",
  rubricCriteria: [{
    criterionId: "week-01-criterion-functionality",
    status: "passed",
    evidence: "All bounded deployment checks passed.",
  }],
};

async function processUntilFinished(
  runId: string,
  evaluator: Parameters<typeof processOneEvaluation>[1],
) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const [run] = await db.select().from(evaluationRuns).where(eq(evaluationRuns.id, runId));
    if (run && run.status !== "queued" && run.status !== "running") return;
    if (!(await processOneEvaluation(db, evaluator))) break;
  }
}

describe("evaluation worker persistence", () => {
  integrationTest("publishes machine evidence and waits for human rubric review", async () => {
    const { submission, run } = await queuedEvaluation();
    await processUntilFinished(run.id, async () => passedResult);

    const [storedRun] = await db.select().from(evaluationRuns).where(eq(evaluationRuns.id, run.id));
    const [storedSubmission] = await db.select().from(submissions).where(eq(submissions.id, submission.id));
    const results = await db.select().from(evaluationResults).where(eq(evaluationResults.evaluationRunId, run.id));
    expect(storedRun).toMatchObject({ status: "needs_review", attempt: 1, leaseToken: null });
    expect(storedSubmission?.status).toBe("submitted");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      criterionId: "week-01-criterion-functionality",
      passed: true,
      requiresHumanReview: false,
    });
  });

  integrationTest("fails unexpected evaluator errors safely to staff review", async () => {
    const { submission, run } = await queuedEvaluation();
    await processUntilFinished(run.id, async () => { throw new Error("provider detail must not leak"); });

    const [storedRun] = await db.select().from(evaluationRuns).where(eq(evaluationRuns.id, run.id));
    const [storedSubmission] = await db.select().from(submissions).where(eq(submissions.id, submission.id));
    expect(storedRun).toMatchObject({
      status: "needs_review",
      errorCode: "evaluator_unavailable",
      errorMessage: "Automated evaluation failed safely and requires staff review.",
    });
    expect(storedSubmission?.status).toBe("submitted");
  });
});
