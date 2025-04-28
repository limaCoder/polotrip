import { HeaderAlbum } from '../(components)/HeaderAlbum';
import { MapPin } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { PhotoTimeline } from '@/components/PhotoTimeline';
import { getPublicAlbum } from '@/http/get-public-album';
import { AlbumViewPageProps } from './types';
import { getPublicAlbumLocations } from '@/http/get-public-album-locations';
import { Suspense } from 'react';
import { PublicPhotoMap } from '../(components)/PublicPhotoMap';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { albumKeys } from '@/hooks/network/keys/albumKeys';
import { getPublicAlbumPhotos } from '@/http/get-public-album-photos';
import { Metadata } from 'next';
import Image from 'next/image';

type Props = {
  params: { id: string; locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: albumId } = params;
  const albumData = await getPublicAlbum({ albumId }).catch(() => null);

  if (!albumData) {
    return {
      title: 'Álbum não encontrado | Polotrip',
    };
  }

  return {
    title: `${albumData.album.title} | Polotrip`,
    description:
      albumData.album.description || 'Confira as fotos e memórias deste álbum especial no Polotrip',
    openGraph: {
      title: `${albumData.album.title} | Polotrip`,
      description:
        albumData.album.description ||
        'Confira as fotos e memórias deste álbum especial no Polotrip',
      type: 'article',
      images: [
        {
          url: albumData.album.coverImageUrl || 'https://polotrip.com/openGraph/og-image.jpg',
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

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

  return (
    <>
      <main className="min-h-screen bg-background flex flex-col">
        <div className="relative w-full h-[430px] md:h-[510px] flex flex-col justify-between">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 via-transparent to-transparent z-10" />
            <Image
              src={albumData?.album.coverImageUrl ?? '/pages/album/album-card-fallback.png'}
              alt="Capa do álbum"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          <HeaderAlbum />

          <div className="relative z-20 w-full flex flex-col items-start p-4 sm:p-8 md:pl-12 md:pb-10">
            <h1 className="font-title_one font-bold text-4xl md:text-5xl lg:text-6xl text-background">
              {albumData?.album.title}
            </h1>

            {albumData?.album.description && (
              <p className="font-title_three text-xl md:text-2xl text-background mb-6">
                {albumData?.album.description}
              </p>
            )}
          </div>
        </div>

        <main className="bg-background">
          {hasLocations && (
            <section className="container px-4 py-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-primary hidden md:block" size={24} />
                <h2 className="font-title_two text-2xl text-primary">
                  ✨ Esses foram os momentos incríveis de Victória!
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
      </main>
      <Footer />
    </>
  );
}
