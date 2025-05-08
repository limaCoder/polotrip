DO $$ BEGIN
    CREATE TYPE "album_plan" AS ENUM ('basic', 'standard', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "photo_limit" integer DEFAULT 100 NOT NULL;
--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "plan" "album_plan" DEFAULT 'standard' NOT NULL;
