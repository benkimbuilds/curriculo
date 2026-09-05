import { and, eq, sql } from "drizzle-orm";

import { db, type Database } from "@/db";
import { evaluationResults, evaluationRuns, submissions } from "@/db/schema";
import { evaluateWeekOneDeployment, WEEK_ONE_EVALUATOR_VERSION, type EvaluationResult } from "@/modules/evaluation";
import { logger } from "@/shared/logger";

type ClaimedEvaluation = {
  id: string;
  submissionId: string;
  deploymentUrl: string;
  leaseToken: string;
  attempt: number;
};

async function claimNextEvaluation(database: Database): Promise<ClaimedEvaluation | null> {
  return database.transaction(async (transaction) => {
    const result = await transaction.execute<{
      id: string;
      submission_id: string;
      deployment_url: string;
      attempt: number;
    }>(sql`
      select evaluation_runs.id, evaluation_runs.submission_id,
             submissions.deployment_url, evaluation_runs.attempt
      from evaluation_runs
      join submissions on submissions.id = evaluation_runs.submission_id
      where (
        evaluation_runs.status = 'queued'
        or (evaluation_runs.status = 'running' and evaluation_runs.locked_at < now() - interval '5 minutes')
      )
        and evaluation_runs.attempt < evaluation_runs.max_attempts
        and evaluation_runs.evaluator_version = ${WEEK_ONE_EVALUATOR_VERSION}
      order by evaluation_runs.created_at asc
      for update of evaluation_runs skip locked
      limit 1
    `);
    const row = result.rows[0];
    if (!row) return null;
    const leaseToken = crypto.randomUUID();
    await transaction
      .update(evaluationRuns)
      .set({
        status: "running",
        leaseToken,
        lockedAt: new Date(),
        startedAt: new Date(),
        attempt: row.attempt + 1,
        errorCode: null,
        errorMessage: null,
      })
      .where(eq(evaluationRuns.id, row.id));
    return {
      id: row.id,
      submissionId: row.submission_id,
      deploymentUrl: row.deployment_url,
      leaseToken,
      attempt: row.attempt + 1,
    };
  });
}

type DeploymentEvaluator = (url: string) => Promise<Readonly<EvaluationResult>>;

export async function processOneEvaluation(
  database: Database = db,
  evaluator: DeploymentEvaluator = evaluateWeekOneDeployment,
): Promise<boolean> {
  const claimed = await claimNextEvaluation(database);
  if (!claimed) return false;

  try {
    const result = await evaluator(claimed.deploymentUrl);
    // The Week 1 curriculum rubric also contains human criteria. A successful
    // deterministic inspection supplies evidence but never approves the whole project.
    const finalState = result.state === "passed" ? "needs_review" : result.state;
    await database.transaction(async (transaction) => {
      const [leased] = await transaction
        .select({ id: evaluationRuns.id })
        .from(evaluationRuns)
        .where(and(
          eq(evaluationRuns.id, claimed.id),
          eq(evaluationRuns.status, "running"),
          eq(evaluationRuns.leaseToken, claimed.leaseToken),
        ))
        .limit(1);
      if (!leased) return;

      await transaction.delete(evaluationResults).where(eq(evaluationResults.evaluationRunId, claimed.id));
      if (result.rubricCriteria.length > 0) {
        await transaction.insert(evaluationResults).values(result.rubricCriteria.map((criterion) => ({
          evaluationRunId: claimed.id,
          criterionId: criterion.criterionId,
          passed: criterion.status === "passed" ? true : criterion.status === "failed" ? false : null,
          score: criterion.status === "passed" ? 100 : criterion.status === "failed" ? 0 : null,
          requiresHumanReview: criterion.status === "needs_review",
          evidence: {
            message: criterion.evidence,
            finalUrl: result.finalUrl,
            deterministicScore: result.score,
            checks: result.criteria,
          },
        })));
      }

      await transaction
        .update(evaluationRuns)
        .set({
          status: finalState,
          finishedAt: new Date(),
          lockedAt: null,
          leaseToken: null,
          errorCode: result.reviewReason ?? null,
          errorMessage: null,
        })
        .where(eq(evaluationRuns.id, claimed.id));
      await transaction
        .update(submissions)
        .set({
          status: finalState === "failed"
              ? "needs_revision"
              : "submitted",
          updatedAt: new Date(),
        })
        .where(eq(submissions.id, claimed.submissionId));
    });
    logger.info({ evaluationRunId: claimed.id, state: finalState }, "Evaluation completed");
  } catch (error) {
    await database.transaction(async (transaction) => {
      await transaction
        .update(evaluationRuns)
        .set({
          status: "needs_review",
          finishedAt: new Date(),
          lockedAt: null,
          leaseToken: null,
          errorCode: "evaluator_unavailable",
          errorMessage: "Automated evaluation failed safely and requires staff review.",
        })
        .where(and(eq(evaluationRuns.id, claimed.id), eq(evaluationRuns.leaseToken, claimed.leaseToken)));
      await transaction
        .update(submissions)
        .set({ status: "submitted", updatedAt: new Date() })
        .where(eq(submissions.id, claimed.submissionId));
    });
    logger.warn({
      evaluationRunId: claimed.id,
      errorType: error instanceof Error ? error.name : "UnknownError",
    }, "Evaluation requires human review");
  }
  return true;
}
