CREATE TABLE "gallery_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"moderation_status" varchar(20) DEFAULT 'visible' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_comments_body_length" CHECK (char_length(btrim("gallery_comments"."body")) >= 2 and char_length(btrim("gallery_comments"."body")) <= 600),
	CONSTRAINT "gallery_comments_moderation_status" CHECK ("gallery_comments"."moderation_status" in ('visible', 'hidden', 'removed'))
);
--> statement-breakpoint
CREATE TABLE "gallery_stars" (
	"submission_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_stars_pk" PRIMARY KEY("submission_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "gallery_comments" ADD CONSTRAINT "gallery_comments_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_comments" ADD CONSTRAINT "gallery_comments_author_user_id_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_stars" ADD CONSTRAINT "gallery_stars_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_stars" ADD CONSTRAINT "gallery_stars_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_comments_submission_idx" ON "gallery_comments" USING btree ("submission_id","moderation_status","created_at");--> statement-breakpoint
CREATE INDEX "gallery_stars_submission_idx" ON "gallery_stars" USING btree ("submission_id");