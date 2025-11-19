import { Suspense } from "react";
import { MusicContent } from "./music-content";
import { MusicSkeleton } from "./music-skeleton";
import type { MusicSectionProps } from "./types";

export function MusicSection({ albumId, locale }: MusicSectionProps) {
  return (
    <Suspense fallback={<MusicSkeleton />}>
      <MusicContent albumId={albumId} locale={locale} />
    </Suspense>
  );
}
