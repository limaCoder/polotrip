import { Suspense } from "react";
import { AlbumCoverContent } from "./album-cover-content";
import { AlbumCoverSkeleton } from "./album-cover-skeleton";
import type { AlbumCoverSectionProps } from "./types";

export function AlbumCoverSection({ albumId, locale }: AlbumCoverSectionProps) {
  return (
    <Suspense fallback={<AlbumCoverSkeleton />}>
      <AlbumCoverContent albumId={albumId} locale={locale} />
    </Suspense>
  );
}
