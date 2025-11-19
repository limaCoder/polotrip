import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { PhotoTimeline } from "@/components/PhotoTimeline";
import { albumKeys } from "@/hooks/network/keys/albumKeys";
import { getPublicAlbumPhotos } from "@/http/get-public-album-photos";
import { getCurrentUser } from "@/lib/auth/server";
import type { PageProps } from "@/types/next";
import { AlbumCoverSection } from "../(components)/AlbumCoverSection";
import { AlbumOwnerTopBar } from "../(components)/AlbumOwnerTopBar";
import { AlbumSharedTopBar } from "../(components)/AlbumSharedTopBar";
import { LocationsSection } from "../(components)/LocationsSection";
import { MusicPlayerSection } from "../(components)/MusicPlayerSection";
import { MusicSection } from "../(components)/MusicSection";
import { generateAlbumMetadata } from "./metadata";

export const generateMetadata = generateAlbumMetadata;

export default async function AlbumViewPage({
  params,
  searchParams,
}: PageProps) {
  const { id: albumId, locale } = await params;
  const { share } = (await searchParams) || {};

  const user = await getCurrentUser();

  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then((rows) => rows[0]);

  if (!album) {
    notFound();
  }

  const isOwner = user?.id === album.userId;
  const isShared = share === "true" && !isOwner;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: albumKeys.publicPhotosList(albumId),
    queryFn: () =>
      getPublicAlbumPhotos({
        albumId,
        limit: 20,
      }),
    initialPageParam: null,
  });

  return (
    <div data-is-owner={isOwner} data-is-shared={isShared}>
      {isOwner && <AlbumOwnerTopBar />}
      {isShared && <AlbumSharedTopBar />}
      <main className="flex min-h-screen flex-col bg-background">
        <AlbumCoverSection albumId={albumId} locale={locale} />

        <LocationsSection albumId={albumId} locale={locale} />

        <MusicSection albumId={albumId} locale={locale} />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="flex w-full items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            }
          >
            <PhotoTimeline albumId={albumId} />
          </Suspense>
        </HydrationBoundary>
      </main>
      <Footer />
      <MusicPlayerSection albumId={albumId} />
    </div>
  );
}
