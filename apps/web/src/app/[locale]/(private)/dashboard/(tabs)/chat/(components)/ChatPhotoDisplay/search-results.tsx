"use client";

import { useTranslations } from "next-intl";
import { AlbumCard } from "@/components/AlbumCard";
import type { SearchResultsProps } from "./types";
import { isAlbumLike, isRecord } from "./utils";

export function SearchResults({ data }: SearchResultsProps) {
  const t = useTranslations("Chat.photo_display");

  const isValidData = isRecord(data);
  const hasAlbumsProperty =
    isValidData &&
    "albums" in data &&
    Array.isArray((data as { albums?: unknown })?.albums ?? []);
  const hasQuery =
    isValidData &&
    "query" in data &&
    typeof (data as { query?: unknown })?.query === "string";

  const isValidSearchResults = hasAlbumsProperty && hasQuery;

  if (!isValidSearchResults) {
    return null;
  }

  const dataWithAlbums = data as {
    albums: unknown[];
    query: string;
    count?: number;
  };

  const albums = dataWithAlbums?.albums?.filter(isAlbumLike) ?? [];

  if (albums?.length === 0) {
    return null;
  }

  return (
    <div className="h-full w-full min-w-[300px] space-y-4 sm:min-w-[400px]">
      <div className="border-b pb-3">
        <h3 className="font-semibold text-lg">
          {t("search_results", { query: dataWithAlbums?.query ?? "" })}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t("albums_found", {
            count:
              typeof dataWithAlbums?.count === "number"
                ? dataWithAlbums?.count
                : albums?.length,
          })}
        </p>
      </div>
      {albums?.length > 0 ? (
        <div className="grid h-full w-full min-w-[300px] max-w-4xl grid-cols-1 gap-4 sm:min-w-[400px] md:grid-cols-2 xl:grid-cols-3">
          {albums?.slice(0, 6)?.map((album) => {
            const albumDate: string = (album?.date ??
              album?.createdAt ??
              "") as string;
            return (
              <AlbumCard
                date={albumDate}
                id={album?.id ?? ""}
                imageUrl={album?.coverImageUrl || ""}
                key={album?.id ?? ""}
                photosCount={album?.photoCount || 0}
                stepAfterPayment={album?.isPublished ? "published" : "upload"}
                title={album?.title ?? ""}
              />
            );
          })}
        </div>
      ) : (
        <p className="py-4 text-center text-muted-foreground text-sm">
          {t("no_albums_found", { query: dataWithAlbums.query })}
        </p>
      )}
    </div>
  );
}
