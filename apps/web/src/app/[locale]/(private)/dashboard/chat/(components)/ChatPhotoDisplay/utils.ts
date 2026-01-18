import type { AlbumLike, PhotoLike } from "./types";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isAlbumLike(value: unknown): value is AlbumLike {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string"
  );
}

export function isPhotoLike(value: unknown): value is PhotoLike {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.imageUrl === "string"
  );
}
