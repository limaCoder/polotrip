import { Suspense } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { PhotoTimeline } from '@/components/PhotoTimeline';
import { Footer } from '@/components/Footer';
import { HeaderAlbum } from '../(components)/HeaderAlbum';
import { PublicPhotoMap } from '../(components)/PublicPhotoMap';
import { AlbumOwnerTopBar } from '../(components)/AlbumOwnerTopBar';

import { getPublicAlbum } from '@/http/get-public-album';
import { getPublicAlbumLocations } from '@/http/get-public-album-locations';
import { getPublicAlbumPhotos } from '@/http/get-public-album-photos';
import { albumKeys } from '@/hooks/network/keys/albumKeys';
import { AlbumViewPageProps } from './types';

export default async function AlbumViewPage({ params }: AlbumViewPageProps) {
  const { id: albumId } = await params;

  const albumData = await getPublicAlbum({ albumId });
  const locationsDataPromise = getPublicAlbumLocations({ albumId });

  const hasLocations = await locationsDataPromise.then(
    data => data.locations.length > 0,
    () => false,
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
    : '/pages/album/album-cover-placeholder.jpg';

  const albumOwnerName = albumData?.user?.name?.split(' ')[0];

  return (
    <>
      <AlbumOwnerTopBar />
      <main className="min-h-screen bg-secondary-10 flex flex-col">
        <div className="relative w-full h-[430px] md:h-[510px] flex flex-col justify-between">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-text/70 via-transparent to-transparent z-10" />
            <Image
              src={coverImageUrl}
              alt="Capa do álbum"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          <HeaderAlbum
            albumTitle={albumData?.album?.title}
            albumDescription={albumData?.album?.description || ''}
          />

          <div className="relative z-20 w-full flex flex-col items-start p-4 sm:p-8 md:pl-12 md:pb-10">
            <h1 className="font-title_one font-bold text-4xl md:text-5xl lg:text-6xl text-secondary">
              {albumData?.album?.title}
            </h1>

            {albumData?.album?.description && (
              <p className="font-title_three text-lg md:text-2xl text-background font-bold pt-2">
                {albumData?.album?.description}
              </p>
            )}
          </div>
        </div>

        {hasLocations && (
          <section className="container px-4 py-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-primary hidden md:block" size={24} />
              <h2 className="font-title_two text-2xl text-primary">
                ✨ Esses foram os momentos incríveis de {albumOwnerName}
              </h2>
            </div>
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <Suspense
                fallback={
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    Carregando mapa...
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
              <div className="w-full py-20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <PhotoTimeline albumId={albumId} />
          </Suspense>
        </HydrationBoundary>
      </main>
      <Footer />
    </>
  );
}
