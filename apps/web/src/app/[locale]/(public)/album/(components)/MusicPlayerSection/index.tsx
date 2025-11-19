import { Suspense } from "react";
import { MusicPlayerContent } from "./music-player-content";
import type { MusicPlayerSectionProps } from "./types";

export function MusicPlayerSection({ albumId }: MusicPlayerSectionProps) {
  return (
    <Suspense fallback={null}>
      <MusicPlayerContent albumId={albumId} />
    </Suspense>
  );
}
