"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TripStatsProps } from "./types";
import { isRecord } from "./utils";

export function TripStats({ data }: TripStatsProps) {
  const t = useTranslations("Chat.photo_display");

  const isValidData = isRecord(data);
  const hasStatsProperty =
    isValidData &&
    "stats" in data &&
    isRecord((data as { stats?: unknown }).stats);
  const hasAlbumProperty =
    isValidData &&
    "album" in data &&
    isRecord((data as { album?: unknown }).album);
  const albumData = hasAlbumProperty
    ? (data as { album: unknown }).album
    : null;
  const hasAlbumTitle =
    albumData !== null &&
    isRecord(albumData) &&
    typeof (albumData as { title?: unknown }).title === "string";

  const isValidTripStats =
    isValidData && hasStatsProperty && hasAlbumProperty && hasAlbumTitle;

  if (!isValidTripStats) {
    return null;
  }

  const dataWithStatsAndAlbum = data as {
    stats: {
      totalPhotos?: number;
      photosWithLocation?: number;
      uniqueLocations?: number;
      dateRange?: { start?: string; end?: string };
    };
    album: { title: string };
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-base">
          {String(
            t("trip_statistics", { title: dataWithStatsAndAlbum.album.title })
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between border-b py-2">
          <span className="font-medium text-sm">
            {String(t("total_photos"))}
          </span>
          <span className="font-bold text-lg text-primary">
            {typeof dataWithStatsAndAlbum.stats.totalPhotos === "number"
              ? dataWithStatsAndAlbum.stats.totalPhotos
              : 0}
          </span>
        </div>
        <div className="flex items-center justify-between border-b py-2">
          <span className="font-medium text-sm">
            {String(t("with_location_data"))}
          </span>
          <span className="font-bold text-lg text-primary">
            {typeof dataWithStatsAndAlbum.stats.photosWithLocation === "number"
              ? dataWithStatsAndAlbum.stats.photosWithLocation
              : 0}
          </span>
        </div>
        <div className="flex items-center justify-between border-b py-2">
          <span className="font-medium text-sm">
            {String(t("unique_locations"))}
          </span>
          <span className="font-bold text-lg text-primary">
            {typeof dataWithStatsAndAlbum.stats.uniqueLocations === "number"
              ? dataWithStatsAndAlbum.stats.uniqueLocations
              : 0}
          </span>
        </div>
        {(() => {
          const dateRange = dataWithStatsAndAlbum.stats.dateRange;
          if (!dateRange) return null;
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
