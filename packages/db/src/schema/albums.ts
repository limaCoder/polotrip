import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./auth-schema";
import { photos } from "./photos";

const currentStepAfterPaymentEnum = pgEnum("current_step_after_payment", [
  "upload",
  "organize",
  "published",
]);

const albumPlanEnum = pgEnum("album_plan", ["basic", "standard", "premium"]);

const LIMIT_PHOTOS_STANDARD = 100;

const albums = pgTable("albums", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  date: date("date").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  musicUrl: text("music_url"),
  isPublished: boolean("is_published").notNull().default(false),
  isPaid: boolean("is_paid").notNull().default(false),
  currentStepAfterPayment: currentStepAfterPaymentEnum(
    "current_step_after_payment"
  ),
  shareableLink: text("shareable_link").notNull().unique(),
  photoCount: integer("photo_count").notNull().default(0),
  photoLimit: integer("photo_limit").notNull().default(LIMIT_PHOTOS_STANDARD),
  plan: albumPlanEnum("plan").notNull().default("standard"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

const albumsRelations = relations(albums, ({ one, many }) => ({
  user: one(users, {
    fields: [albums.userId],
    references: [users.id],
  }),
  photos: many(photos),
}));

export { albums, albumsRelations, albumPlanEnum };
