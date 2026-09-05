ALTER TABLE "submissions" DROP CONSTRAINT "submission_commit_sha_valid";--> statement-breakpoint
ALTER TABLE "evaluation_runs" ALTER COLUMN "attempt" SET DEFAULT 0;--> statement-breakpoint
UPDATE "evaluation_runs" SET "attempt" = 0 WHERE "status" = 'queued' AND "started_at" IS NULL;--> statement-breakpoint
ALTER TABLE "evaluation_runs" ADD COLUMN "rubric_id" varchar(140);--> statement-breakpoint
ALTER TABLE "evaluation_runs" ADD COLUMN "rubric_version" varchar(64);--> statement-breakpoint
ALTER TABLE "evaluation_runs" ADD COLUMN "max_attempts" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "evaluation_runs" ADD COLUMN "lease_token" uuid;--> statement-breakpoint
ALTER TABLE "evaluation_runs" ADD COLUMN "locked_at" timestamp with time zone;--> statement-breakpoint
UPDATE "evaluation_runs" AS "run"
SET
	"rubric_id" = coalesce("submission"."snapshot" ->> 'rubricId', regexp_replace("submission"."project_id", '-project$', '-rubric-v1')),
	"rubric_version" = coalesce("submission"."snapshot" ->> 'rubricVersion', '1')
FROM "submissions" AS "submission"
WHERE "submission"."id" = "run"."submission_id";--> statement-breakpoint
UPDATE "evaluation_runs" SET "rubric_id" = 'unknown-rubric' WHERE "rubric_id" IS NULL;--> statement-breakpoint
UPDATE "evaluation_runs" SET "rubric_version" = 'unknown' WHERE "rubric_version" IS NULL;--> statement-breakpoint
ALTER TABLE "evaluation_runs" ALTER COLUMN "rubric_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "evaluation_runs" ALTER COLUMN "rubric_version" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "evaluation_runs" ADD CONSTRAINT "evaluation_run_attempts_valid" CHECK ("evaluation_runs"."attempt" >= 0 and "evaluation_runs"."max_attempts" > 0 and "evaluation_runs"."attempt" <= "evaluation_runs"."max_attempts");--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submission_commit_sha_valid" CHECK ("submissions"."commit_sha" ~ '^(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})$') NOT VALID;
