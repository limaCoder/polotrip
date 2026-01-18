"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { formatDateReadable } from "@/utils/dates";
import type { PhotosWithContextProps } from "./types";
import { isPhotoLike, isRecord } from "./utils";

export function PhotosWithContext({ data }: PhotosWithContextProps) {
  const t = useTranslations("Chat.photo_display");
  const params = useParams();
  const locale = (params?.locale as "pt" | "en") || "pt";

  const isValidData = isRecord(data);
  const hasPhotosProperty =
    isValidData &&
    "photos" in data &&
    Array.isArray((data as { photos?: unknown }).photos);
  const dataWithPhotos = hasPhotosProperty
    ? (data as { photos: unknown[] })
    : null;
  const hasPhotos = dataWithPhotos !== null && dataWithPhotos.photos.length > 0;

  if (!hasPhotos) {
    return null;
  }

  const photos = dataWithPhotos.photos.filter(isPhotoLike);
  const hasValidPhotos = photos.length > 0;

  if (!hasValidPhotos) {
    return null;
  }

  const hasLocation =
    isValidData &&
    "location" in data &&
    typeof (data as { location?: unknown }).location === "string";
  const hasDate =
    isValidData &&
    "date" in data &&
    typeof (data as { date?: unknown }).date === "string";
  const albumData =
    isValidData && "album" in data ? (data as { album?: unknown }).album : null;
  const hasAlbumInfo =
    albumData !== null &&
    isRecord(albumData) &&
    typeof (albumData as { title?: unknown }).title === "string";

  const dataWithLocation = hasLocation ? (data as { location: string }) : null;
  const dataWithDate = hasDate ? (data as { date: string }) : null;
  const dataWithAlbum = hasAlbumInfo ? (albumData as { title: string }) : null;

  let context = "";
  if (hasLocation && dataWithLocation) {
    context = t("photos_at_location", { location: dataWithLocation.location });
  } else if (hasDate && dataWithDate) {
    const formattedDate = formatDateReadable(dataWithDate.date, locale);
    context = t("photos_on_date", { date: formattedDate });
  }

  if (hasAlbumInfo && dataWithAlbum) {
    context = context
      ? `${dataWithAlbum.title} - ${context}`
      : dataWithAlbum.title;
  }

  return (
    <div className="max-w-4xl space-y-4">
      {context && (
        <div className="border-b pb-3">
          <h3 className="font-semibold text-lg">{context}</h3>
          <p className="text-muted-foreground text-sm">
            {t("photos_found", { count: dataWithPhotos.photos.length })}
          </p>
        </div>
      )}
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
                  {photo.locationName}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {dataWithPhotos.photos.length > 12 && (
        <p className="text-center text-muted-foreground text-sm">
          {t("more_photos", { count: dataWithPhotos.photos.length - 12 })}
        </p>
      )}
    </div>
  );
}
