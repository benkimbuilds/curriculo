CREATE TYPE "public"."mentoring_assignment_status" AS ENUM('active', 'ended');--> statement-breakpoint
CREATE TABLE "mentoring_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"mentor_user_id" uuid NOT NULL,
	"student_user_id" uuid NOT NULL,
	"cohort_id" uuid,
	"enrollment_id" uuid,
	"status" "mentoring_assignment_status" DEFAULT 'active' NOT NULL,
	"assigned_by_user_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentoring_different_users" CHECK ("mentoring_assignments"."mentor_user_id" <> "mentoring_assignments"."student_user_id")
);
--> statement-breakpoint
ALTER TABLE "mentoring_assignments" ADD CONSTRAINT "mentoring_assignments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentoring_assignments" ADD CONSTRAINT "mentoring_assignments_mentor_user_id_user_id_fk" FOREIGN KEY ("mentor_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentoring_assignments" ADD CONSTRAINT "mentoring_assignments_student_user_id_user_id_fk" FOREIGN KEY ("student_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentoring_assignments" ADD CONSTRAINT "mentoring_assignments_cohort_id_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentoring_assignments" ADD CONSTRAINT "mentoring_assignments_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentoring_assignments" ADD CONSTRAINT "mentoring_assignments_assigned_by_user_id_user_id_fk" FOREIGN KEY ("assigned_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "mentoring_self_paced_active_unique" ON "mentoring_assignments" USING btree ("mentor_user_id","student_user_id") WHERE "mentoring_assignments"."cohort_id" is null and "mentoring_assignments"."status" = 'active';--> statement-breakpoint
CREATE UNIQUE INDEX "mentoring_cohort_active_unique" ON "mentoring_assignments" USING btree ("cohort_id","mentor_user_id","student_user_id") WHERE "mentoring_assignments"."cohort_id" is not null and "mentoring_assignments"."status" = 'active';--> statement-breakpoint
CREATE INDEX "mentoring_student_idx" ON "mentoring_assignments" USING btree ("student_user_id","status");--> statement-breakpoint
CREATE INDEX "mentoring_mentor_idx" ON "mentoring_assignments" USING btree ("mentor_user_id","status");