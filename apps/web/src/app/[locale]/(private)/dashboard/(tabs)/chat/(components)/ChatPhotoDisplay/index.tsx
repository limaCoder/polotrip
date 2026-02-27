"use client";

import { AlbumWithPhotos } from "./album-with-photos";
import { AlbumsGrid } from "./albums-grid";
import { PhotosWithContext } from "./photos-with-context";
import { SearchResults } from "./search-results";
import { TripStats } from "./trip-stats";
import type { ChatPhotoDisplayProps } from "./types";
import { isAlbumLike, isRecord } from "./utils";

export function ChatPhotoDisplay({ data }: ChatPhotoDisplayProps) {
  const isAlbumsArray =
    Array.isArray(data) && data.length > 0 && isAlbumLike(data[0]);

  if (isAlbumsArray) {
    return <AlbumsGrid albums={data} />;
  }

  const isAlbumWithPhotos =
    isRecord(data) &&
    isRecord(data.album) &&
    typeof data.album.title === "string" &&
    typeof data.album.photoCount === "number" &&
    Array.isArray(data.photos);

  if (isAlbumWithPhotos) {
    return <AlbumWithPhotos data={data} />;
  }

  const hasPhotosWithContext =
    isRecord(data) &&
    Array.isArray(data.photos) &&
    data.photos.length > 0 &&
    (typeof data.date === "string" ||
      typeof data.location === "string" ||
      data.date == null ||
      data.location == null);

  if (hasPhotosWithContext) {
    return <PhotosWithContext data={data} />;
  }

  const isTripStats =
    isRecord(data) &&
    isRecord(data.stats) &&
    isRecord(data.album) &&
    typeof data.album.title === "string";

  if (isTripStats) {
    return <TripStats data={data} />;
  }

  const isSearchResults =
    isRecord(data) &&
    Array.isArray(data.albums) &&
    typeof data.query === "string";

  if (isSearchResults) {
    return <SearchResults data={data} />;
  }

  return null;
}
