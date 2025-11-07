ALTER TABLE "albums" ADD COLUMN "music_url" text;--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN "spotify_track_id";--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN "spotify_playlist_id";