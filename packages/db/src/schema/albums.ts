import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

import { users } from './auth-schema';
import { photos } from './photos';

const albums = pgTable('albums', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  spotifyTrackId: text('spotify_track_id'),
  spotifyPlaylistId: text('spotify_playlist_id'),
  isPublished: boolean('is_published').notNull().default(false),
  isPaid: boolean('is_paid').notNull().default(false),
  currentStepAfterPayment: text('current_step_after_payment'),
  shareableLink: text('shareable_link').notNull().unique(),
  photoCount: integer('photo_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const albumsRelations = relations(albums, ({ one, many }) => ({
  user: one(users, {
    fields: [albums.userId],
    references: [users.id],
  }),
  photos: many(photos),
}));

export { albums, albumsRelations };
