import { createId } from '@paralleldrive/cuid2';
import { integer, pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { albums } from './albums';
import { relations } from 'drizzle-orm';

const payments = pgTable('payments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  albumId: text('album_id').references(() => albums.id),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default('BRL'),
  status: text('status').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentGateway: text('payment_gateway').notNull(),
  gatewayPaymentId: text('gateway_payment_id').notNull(),
  gatewayCheckoutUrl: text('gateway_checkout_url'),
  isAdditionalPhotos: boolean('is_additional_photos').notNull().default(false),
  additionalPhotosCount: integer('additional_photos_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  album: one(albums, {
    fields: [payments.albumId],
    references: [albums.id],
  }),
}));

export { payments, paymentsRelations };
