CREATE TYPE current_step_after_payment AS ENUM ('upload', 'organize', 'published');
--> statement-breakpoint
ALTER TABLE "albums" ALTER COLUMN "current_step_after_payment" SET DATA TYPE current_step_after_payment USING current_step_after_payment::text::current_step_after_payment;