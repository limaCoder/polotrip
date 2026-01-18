"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { AlbumWithPhotosProps } from "./types";
import { isPhotoLike, isRecord } from "./utils";

export function AlbumWithPhotos({ data }: AlbumWithPhotosProps) {
  const t = useTranslations("Chat.photo_display");

  const isValidData = isRecord(data);
  const hasAlbum = isValidData && "album" in data && isRecord(data.album);
  const hasValidAlbumTitle =
    hasAlbum &&
    typeof (data as { album: { title?: unknown } }).album.title === "string";
  const hasValidPhotoCount =
    hasAlbum &&
    typeof (data as { album: { photoCount?: unknown } }).album.photoCount ===
      "number";
  const hasPhotosArray =
    isValidData &&
    "photos" in data &&
    Array.isArray((data as { photos?: unknown }).photos);

  const isValidAlbumWithPhotos =
    isValidData &&
    hasAlbum &&
    hasValidAlbumTitle &&
    hasValidPhotoCount &&
    hasPhotosArray;

  if (!isValidAlbumWithPhotos) {
    return null;
  }

  const dataWithPhotos = data as { photos: unknown[] };
  const photos = dataWithPhotos.photos.filter(isPhotoLike);

  const dataWithAlbum = data as {
    album: { title: string; photoCount: number };
    photos: unknown[];
  };

  return (
    <div className="max-w-4xl space-y-4">
      <div className="border-b pb-3">
        <h3 className="font-semibold text-lg">{dataWithAlbum.album.title}</h3>
        <p className="text-muted-foreground text-sm">
          {t("photos_in_album", {
            count: dataWithAlbum.album.photoCount,
          })}
        </p>
      </div>
      {photos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {photos.slice(0, 12).map((photo) => (
              <div
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-primary"
                key={photo.id}
              >
                <Image
                  alt={photo?.description || photo?.locationName || "Image"}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  src={photo?.thumbnailUrl || photo?.imageUrl}
                />
                {photo?.locationName && (
                  <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-2">
                    <p className="truncate text-white text-xs">
                      {photo?.locationName}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {dataWithAlbum.photos.length > 12 && (
            <p className="text-center text-muted-foreground text-sm">
              {t("more_photos", { count: dataWithAlbum.photos.length - 12 })}
            </p>
          )}
        </>
      ) : (
        <p className="py-4 text-center text-muted-foreground text-sm">
          {t("no_photos_found")}
        </p>
      )}
    </div>
  );
}
