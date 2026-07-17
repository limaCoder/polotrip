import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { albums } from "./albums";

const videoStatusEnum = pgEnum("video_status", [
  "pending",
  "processing",
  "success",
  "failed",
]);

const videoStyleEnum = pgEnum("video_style", [
  "emotional",
  "documentary",
  "fun",
]);

const albumVideos = pgTable("album_videos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  albumId: text("album_id")
    .notNull()
    .references(() => albums.id, { onDelete: "cascade" }),
  status: videoStatusEnum("status").notNull().default("pending"),
  style: videoStyleEnum("style").notNull().default("emotional"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  durationSeconds: integer("duration_seconds"),
  scriptText: text("script_text"),
  narrationUrl: text("narration_url"),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").notNull().default(0),
  queueJobId: text("queue_job_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

const albumVideosRelations = relations(albumVideos, ({ one }) => ({
  album: one(albums, {
    fields: [albumVideos.albumId],
    references: [albums.id],
  }),
}));

export { albumVideos, albumVideosRelations, videoStatusEnum, videoStyleEnum };
