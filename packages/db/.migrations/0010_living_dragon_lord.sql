CREATE TYPE "video_status" AS ENUM ('pending', 'processing', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "video_style" AS ENUM ('emotional', 'documentary', 'fun');--> statement-breakpoint
CREATE TABLE "album_videos" (
	"id" text PRIMARY KEY NOT NULL,
	"album_id" text NOT NULL,
	"status" "video_status" DEFAULT 'pending' NOT NULL,
	"style" "video_style" DEFAULT 'emotional' NOT NULL,
	"video_url" text,
	"thumbnail_url" text,
	"duration_seconds" integer,
	"script_text" text,
	"narration_url" text,
	"error_message" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"queue_job_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "photo_embeddings" (
	"id" text PRIMARY KEY NOT NULL,
	"photo_id" text NOT NULL,
	"embedding" vector(1536),
	"chunk_text" text NOT NULL,
	"chunk_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "album_videos" ADD CONSTRAINT "album_videos_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_embeddings" ADD CONSTRAINT "photo_embeddings_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "photo_embeddings_photo_id_idx" ON "photo_embeddings" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "photo_embeddings_chunk_idx" ON "photo_embeddings" USING btree ("photo_id","chunk_index");--> statement-breakpoint
CREATE INDEX "photo_embeddings_vector_idx" ON "photo_embeddings" USING ivfflat ("embedding" vector_cosine_ops);