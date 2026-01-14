"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { AlbumCard } from "@/components/AlbumCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChatPhotoDisplayProps = {
  data: unknown;
};

type AlbumLike = {
  id: string;
  title: string;
  date?: string;
  createdAt?: string;
  coverImageUrl?: string;
  photoCount?: number;
  isPublished?: boolean;
};

type PhotoLike = {
  id: string;
  thumbnailUrl?: string;
  imageUrl: string;
  description?: string;
  locationName?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAlbumLike(value: unknown): value is AlbumLike {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string"
  );
}

function isPhotoLike(value: unknown): value is PhotoLike {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.imageUrl === "string"
  );
}

export function ChatPhotoDisplay({ data }: ChatPhotoDisplayProps) {
  const t = useTranslations("Chat.photo_display");

  // Handle albums array (from getUserAlbums or getAlbumByName)
  if (Array.isArray(data) && data.length > 0 && isAlbumLike(data[0])) {
    return (
      <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
        {data
          .filter(isAlbumLike)
          .slice(0, 6)
          .map((album) => {
            const albumDate: string = (album.date ??
              album.createdAt ??
              "") as string;
            return (
              <AlbumCard
                date={albumDate}
                id={album.id}
                imageUrl={album.coverImageUrl || ""}
                key={album.id}
                photosCount={album.photoCount || 0}
                stepAfterPayment={album.isPublished ? "published" : "upload"}
                title={album.title}
              />
            );
          })}
        {data.length > 6 && (
          <p className="col-span-full text-center text-muted-foreground text-sm">
            {t("more_albums", { count: data.length - 6 })}
          </p>
        )}
      </div>
    );
  }

  // Handle single album with photos (from getAlbumPhotos)
  if (
    isRecord(data) &&
    isRecord(data.album) &&
    typeof data.album.title === "string" &&
    typeof data.album.photoCount === "number" &&
    Array.isArray(data.photos)
  ) {
    return (
      <div className="max-w-4xl space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-semibold text-lg">{data.album.title}</h3>
          <p className="text-muted-foreground text-sm">
            {t("photos_in_album", {
              count: data.album.photoCount,
            })}
          </p>
        </div>
        {data.photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {data.photos
                .filter(isPhotoLike)
                .slice(0, 12)
                .map((photo) => (
                  <div
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-primary"
                    key={photo.id}
                  >
                    <Image
                      alt={photo.description || photo.locationName || "Image"}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                      src={photo.thumbnailUrl || photo.imageUrl}
                    />
                    {photo.locationName && (
                      <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-2">
                        <p className="truncate text-white text-xs">
                          {photo.locationName}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {data.photos.length > 12 && (
              <p className="text-center text-muted-foreground text-sm">
                {t("more_photos", { count: data.photos.length - 12 })}
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

  // Handle photos array with location/date context (from getPhotosByDate/Location)
  // This handles both cases: with album info (getPhotosByLocation) and without (getPhotosByDate)
  // Only render if there are actual photos (hide empty results)
  if (
    isRecord(data) &&
    Array.isArray(data.photos) &&
    data.photos.length > 0 &&
    (typeof data.date === "string" ||
      typeof data.location === "string" ||
      data.date == null ||
      data.location == null)
  ) {
    let context = "";
    let contextKey = "";
    if (typeof data.location === "string") {
      context = t("photos_at_location", { location: data.location });
      contextKey = `at ${data.location}`;
    } else if (typeof data.date === "string") {
      context = t("photos_on_date", { date: data.date });
      contextKey = `on ${data.date}`;
    }

    // If album info is present, include it in the context
    if (isRecord(data.album) && typeof data.album.title === "string") {
      context = context ? `${data.album.title} - ${context}` : data.album.title;
    }
    return (
      <div className="max-w-4xl space-y-4">
        {context && (
          <div className="border-b pb-3">
            <h3 className="font-semibold text-lg">{context}</h3>
            <p className="text-muted-foreground text-sm">
              {t("photos_found", { count: data.photos.length })}
            </p>
          </div>
        )}
        {data.photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {data.photos
                .filter(isPhotoLike)
                .slice(0, 12)
                .map((photo) => (
                  <div
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-primary"
                    key={photo.id}
                  >
                    <Image
                      alt={photo.description || photo.locationName || "Image"}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                      src={photo.thumbnailUrl || photo.imageUrl}
                    />
                    {photo.locationName && (
                      <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-2">
                        <p className="truncate text-white text-xs">
                          {photo.locationName}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {data.photos.length > 12 && (
              <p className="text-center text-muted-foreground text-sm">
                {t("more_photos", { count: data.photos.length - 12 })}
              </p>
            )}
          </>
        ) : (
          <p className="py-4 text-center text-muted-foreground text-sm">
            {t("no_photos_found_context", { context: contextKey })}
          </p>
        )}
      </div>
    );
  }

  // Handle trip statistics
  if (
    isRecord(data) &&
    isRecord(data.stats) &&
    isRecord(data.album) &&
    typeof data.album.title === "string"
  ) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">
            {String(t("trip_statistics", { title: data.album.title }))}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between border-b py-2">
            <span className="font-medium text-sm">
              {String(t("total_photos"))}
            </span>
            <span className="font-bold text-lg text-primary">
              {typeof data.stats.totalPhotos === "number"
                ? data.stats.totalPhotos
                : 0}
            </span>
          </div>
          <div className="flex items-center justify-between border-b py-2">
            <span className="font-medium text-sm">
              {String(t("with_location_data"))}
            </span>
            <span className="font-bold text-lg text-primary">
              {typeof data.stats.photosWithLocation === "number"
                ? data.stats.photosWithLocation
                : 0}
            </span>
          </div>
          <div className="flex items-center justify-between border-b py-2">
            <span className="font-medium text-sm">
              {String(t("unique_locations"))}
            </span>
            <span className="font-bold text-lg text-primary">
              {typeof data.stats.uniqueLocations === "number"
                ? data.stats.uniqueLocations
                : 0}
            </span>
          </div>
          {(() => {
            const dateRange = data.stats.dateRange;
            if (!isRecord(dateRange)) return null;
            return (
              <div className="space-y-1 pt-2">
                <p className="font-medium text-muted-foreground text-xs">
                  {String(t("date_range"))}
                </p>
                <p className="text-sm">
                  {typeof dateRange.start === "string"
                    ? new Date(dateRange.start).toLocaleDateString()
                    : "N/A"}{" "}
                  -{" "}
                  {typeof dateRange.end === "string"
                    ? new Date(dateRange.end).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    );
  }

  // Handle search results with count
  if (
    isRecord(data) &&
    Array.isArray(data.albums) &&
    typeof data.query === "string"
  ) {
    return (
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-semibold text-lg">
            {t("search_results", { query: data.query })}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t("albums_found", {
              count:
                typeof data.count === "number"
                  ? data.count
                  : data.albums.length,
            })}
          </p>
        </div>
        {data.albums.length > 0 ? (
          <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            {data.albums
              .filter(isAlbumLike)
              .slice(0, 6)
              .map((album) => {
                const albumDate: string = (album.date ??
                  album.createdAt ??
                  "") as string;
                return (
                  <AlbumCard
                    date={albumDate}
                    id={album.id}
                    imageUrl={album.coverImageUrl || ""}
                    key={album.id}
                    photosCount={album.photoCount || 0}
                    stepAfterPayment={
                      album.isPublished ? "published" : "upload"
                    }
                    title={album.title}
                  />
                );
              })}
          </div>
        ) : (
          <p className="py-4 text-center text-muted-foreground text-sm">
            {t("no_albums_found", { query: data.query })}
          </p>
        )}
      </div>
    );
  }

  // Fallback: don't display anything for unstructured data
  // The AI will provide text explanation instead
  return null;
}
