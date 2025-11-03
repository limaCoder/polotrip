import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { PhotoTimeline } from "@/components/PhotoTimeline";
import { albumKeys } from "@/hooks/network/keys/albumKeys";
import { getPublicAlbum } from "@/http/get-public-album";
import { getPublicAlbumLocations } from "@/http/get-public-album-locations";
import { getPublicAlbumPhotos } from "@/http/get-public-album-photos";
import { getCurrentUser } from "@/lib/auth/server";
import type { PageProps } from "@/types/next";
import { AlbumOwnerTopBar } from "../(components)/AlbumOwnerTopBar";
import { AlbumSharedTopBar } from "../(components)/AlbumSharedTopBar";
import { HeaderAlbum } from "../(components)/HeaderAlbum";
import { PublicPhotoMap } from "../(components)/PublicPhotoMap";
import { generateAlbumMetadata } from "./metadata";

export const generateMetadata = generateAlbumMetadata;

export default async function AlbumViewPage({
  params,
  searchParams,
}: PageProps) {
  const { id: albumId, locale } = await params;
  const { share } = (await searchParams) || {};

  const t = await getTranslations({ locale, namespace: "PublicAlbum" });

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

  const albumData = await getPublicAlbum({ albumId });
  const locationsDataPromise = getPublicAlbumLocations({ albumId });

  const hasLocations = await locationsDataPromise.then(
    (data) => data.locations.length > 0,
    () => false
  );

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

  const coverImageUrl = albumData?.album?.coverImageUrl
    ? albumData?.album?.coverImageUrl
    : "/pages/album/album-cover-placeholder.jpg";

  const albumOwnerName = albumData?.user?.name?.split(" ")[0];

  return (
    <div data-is-owner={isOwner} data-is-shared={isShared}>
      {isOwner && <AlbumOwnerTopBar />}
      {isShared && <AlbumSharedTopBar />}
      <main className="flex min-h-screen flex-col bg-secondary-10">
        <div className="relative flex h-[430px] w-full flex-col justify-between md:h-[510px]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-text/70 via-transparent to-transparent" />
            <Image
              alt={t("cover_alt")}
              className="object-cover"
              fill
              priority
              sizes="100vw"
              src={coverImageUrl}
            />
          </div>

          <HeaderAlbum
            albumDescription={albumData?.album?.description || ""}
            albumOwnerName={albumOwnerName}
            albumTitle={albumData?.album?.title}
          />

          <div className="relative z-20 flex w-full flex-col items-start p-4 sm:p-8 md:pb-10 md:pl-12">
            <h1 className="font-bold font-title_one text-4xl text-secondary md:text-5xl lg:text-6xl">
              {albumData?.album?.title}
            </h1>

            {albumData?.album?.description && (
              <p className="pt-2 font-bold font-title_three text-background text-lg md:text-2xl">
                {albumData?.album?.description}
              </p>
            )}
          </div>
        </div>

        {hasLocations && (
          <section className="container px-4 py-8">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="hidden text-primary md:block" size={24} />
              <h2 className="font-title_two text-2xl text-primary">
                {t("moments_title", { ownerName: albumOwnerName })}
              </h2>
            </div>
            <div className="h-[400px] w-full overflow-hidden rounded-lg">
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    {t("loading_map")}
                  </div>
                }
              >
                <PublicPhotoMap locationsPromise={locationsDataPromise} />
              </Suspense>
            </div>
          </section>
        )}

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
    </div>
  );
}
