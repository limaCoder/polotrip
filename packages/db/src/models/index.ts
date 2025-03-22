import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { albums } from '../schema/albums';
import { photos } from '../schema/photos';
import { payments } from '../schema/payments';
import { users, sessions, accounts, verifications } from '../schema/auth-schema';

export type User = InferSelectModel<typeof users>;
export type Album = InferSelectModel<typeof albums>;
export type Photo = InferSelectModel<typeof photos>;
export type Payment = InferSelectModel<typeof payments>;

export type Session = InferSelectModel<typeof sessions>;
export type Account = InferSelectModel<typeof accounts>;
export type Verification = InferSelectModel<typeof verifications>;

export type NewUser = InferInsertModel<typeof users>;
export type NewAlbum = InferInsertModel<typeof albums>;
export type NewPhoto = InferInsertModel<typeof photos>;
export type NewPayment = InferInsertModel<typeof payments>;

export interface AlbumWithPhotos extends Album {
  photos?: Photo[];
}

export interface UserWithAlbums extends User {
  albums?: Album[];
}

export interface PhotoWithAlbum extends Photo {
  album?: Album;
}

export interface PaymentWithUser extends Payment {
  user?: User;
  album?: Album;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'pix';
export type PaymentGateway = 'stripe' | 'mercadopago';

export type AlbumStatus = 'draft' | 'published';
