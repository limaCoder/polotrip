import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { photos } from "./photos";

const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    return value
      .slice(1, -1)
      .split(",")
      .map((v) => parseFloat(v));
  },
});

const photoEmbeddings = pgTable(
  "photo_embeddings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    photoId: text("photo_id")
      .notNull()
      .references(() => photos.id, { onDelete: "cascade" }),
    embedding: vector("embedding"),
    chunkText: text("chunk_text").notNull(),
    chunkIndex: integer("chunk_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("photo_embeddings_photo_id_idx").on(table.photoId),
    index("photo_embeddings_chunk_idx").on(table.photoId, table.chunkIndex),
    index("photo_embeddings_vector_idx").using(
      "ivfflat",
      sql`${table.embedding} vector_cosine_ops`
    ),
  ]
);

const photoEmbeddingsRelations = relations(photoEmbeddings, ({ one }) => ({
  photo: one(photos, {
    fields: [photoEmbeddings.photoId],
    references: [photos.id],
  }),
}));

export { photoEmbeddings, photoEmbeddingsRelations };
