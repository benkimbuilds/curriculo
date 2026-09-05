CREATE TYPE "public"."cohort_invitation_status" AS ENUM('pending', 'accepted', 'revoked', 'expired');--> statement-breakpoint
CREATE TABLE "cohort_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cohort_id" uuid NOT NULL,
	"email" text NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"status" "cohort_invitation_status" DEFAULT 'pending' NOT NULL,
	"invited_by_user_id" uuid NOT NULL,
	"accepted_by_user_id" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cohort_invitations_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "cohorts" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "cohorts" ADD COLUMN "archived_by_user_id" uuid;--> statement-breakpoint
ALTER TABLE "cohort_invitations" ADD CONSTRAINT "cohort_invitations_cohort_id_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cohort_invitations" ADD CONSTRAINT "cohort_invitations_invited_by_user_id_user_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cohort_invitations" ADD CONSTRAINT "cohort_invitations_accepted_by_user_id_user_id_fk" FOREIGN KEY ("accepted_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cohort_invitation_pending_unique" ON "cohort_invitations" USING btree ("cohort_id",lower("email")) WHERE "cohort_invitations"."status" = 'pending';--> statement-breakpoint
CREATE INDEX "cohort_invitation_email_idx" ON "cohort_invitations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "cohort_invitation_expiry_idx" ON "cohort_invitations" USING btree ("status","expires_at");--> statement-breakpoint
ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_archived_by_user_id_user_id_fk" FOREIGN KEY ("archived_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;