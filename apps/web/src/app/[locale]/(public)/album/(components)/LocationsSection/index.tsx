import { Suspense } from "react";
import { LocationsContent } from "./locations-content";
import { LocationsSkeleton } from "./locations-skeleton";
import type { LocationsSectionProps } from "./types";

export function LocationsSection({ albumId, locale }: LocationsSectionProps) {
  return (
    <Suspense fallback={<LocationsSkeleton />}>
      <LocationsContent albumId={albumId} locale={locale} />
    </Suspense>
  );
}
