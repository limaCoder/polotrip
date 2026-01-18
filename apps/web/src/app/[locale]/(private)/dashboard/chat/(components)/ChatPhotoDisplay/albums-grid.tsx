"use client";

import { useTranslations } from "next-intl";
import { AlbumCard } from "@/components/AlbumCard";
import type { AlbumsGridProps } from "./types";
import { isAlbumLike } from "./utils";

export function AlbumsGrid({ albums }: AlbumsGridProps) {
  const t = useTranslations("Chat.photo_display");

  const isValidAlbumsArray =
    Array.isArray(albums) && albums.length > 0 && isAlbumLike(albums[0]);
  if (!isValidAlbumsArray) {
    return null;
  }

  const validAlbums = albums?.filter(isAlbumLike);

  if (validAlbums?.length === 0) {
    return null;
  }

  return (
    <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
      {validAlbums?.slice(0, 6)?.map((album) => {
        const albumDate: string = (album?.date ??
          album?.createdAt ??
          "") as string;
        return (
          <AlbumCard
            date={albumDate}
            id={album?.id}
            imageUrl={album?.coverImageUrl || ""}
            key={album?.id}
            photosCount={album?.photoCount || 0}
            stepAfterPayment={album?.isPublished ? "published" : "upload"}
            title={album?.title}
          />
        );
      })}
      {albums.length > 6 && (
        <p className="col-span-full text-center text-muted-foreground text-sm">
          {t("more_albums", { count: albums.length - 6 })}
        </p>
      )}
    </div>
  );
}
