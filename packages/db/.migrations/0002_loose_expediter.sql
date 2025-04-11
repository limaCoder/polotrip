ALTER TABLE "albums" ADD COLUMN "is_paid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "current_step_after_payment" text;