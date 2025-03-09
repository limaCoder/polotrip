import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { albums } from './albums';
import { doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const photos = pgTable('photos', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  albumId: text('album_id')
    .notNull()
    .references(() => albums.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  originalFileName: text('original_file_name'),
  dateTaken: text('date_taken'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  locationName: text('location_name'),
  description: text('description'),
  order: text('order'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const photosRelations = relations(photos, ({ one }) => ({
  album: one(albums, {
    fields: [photos.albumId],
    references: [albums.id],
  }),
}));

export { photos, photosRelations };
