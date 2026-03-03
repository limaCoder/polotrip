import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { albumVideos } from "../schema/album-videos";
import type { albums } from "../schema/albums";
import type {
  accounts,
  sessions,
  users,
  verifications,
} from "../schema/auth-schema";
import type { payments } from "../schema/payments";
import type { photoEmbeddings } from "../schema/photo-embeddings";
import type { photos } from "../schema/photos";

export type User = InferSelectModel<typeof users>;
export type Album = InferSelectModel<typeof albums>;
export type Photo = InferSelectModel<typeof photos>;
export type Payment = InferSelectModel<typeof payments>;
export type AlbumVideo = InferSelectModel<typeof albumVideos>;
export type PhotoEmbedding = InferSelectModel<typeof photoEmbeddings>;

export type Session = InferSelectModel<typeof sessions>;
export type Account = InferSelectModel<typeof accounts>;
export type Verification = InferSelectModel<typeof verifications>;

export type NewUser = InferInsertModel<typeof users>;
export type NewAlbum = InferInsertModel<typeof albums>;
export type NewPhoto = InferInsertModel<typeof photos>;
export type NewPayment = InferInsertModel<typeof payments>;
export type NewAlbumVideo = InferInsertModel<typeof albumVideos>;
export type NewPhotoEmbedding = InferInsertModel<typeof photoEmbeddings>;

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

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";
export type PaymentMethod = "credit_card" | "pix";
export type PaymentGateway = "stripe" | "mercadopago";

export type AlbumStatus = "draft" | "published";

export type VideoStatus = "pending" | "processing" | "success" | "failed";
export type VideoStyle = "emotional" | "documentary" | "fun";

export interface AlbumVideoWithAlbum extends AlbumVideo {
  album?: Album;
}

export interface PhotoEmbeddingWithPhoto extends PhotoEmbedding {
  photo?: Photo;
}
