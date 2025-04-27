CREATE INDEX "album_id_idx" ON "photos" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX "date_taken_idx" ON "photos" USING btree ("date_taken");--> statement-breakpoint
CREATE INDEX "album_date_idx" ON "photos" USING btree ("album_id","date_taken");--> statement-breakpoint
CREATE INDEX "geo_idx" ON "photos" USING btree ("latitude","longitude");