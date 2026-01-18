CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE INDEX description_gin_idx ON photos USING gin(description gin_trgm_ops);--> statement-breakpoint
CREATE INDEX location_name_gin_idx ON photos USING gin(location_name gin_trgm_ops);
