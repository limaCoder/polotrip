import { FullscreenIcon, MapPin, Share2 } from 'lucide-react';
import { Header } from '@/components/Header';
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
    <main className="min-h-screen bg-background flex flex-col">
      <div className="relative w-full h-[510px] flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 via-transparent to-transparent z-10" />
          <img
            src="/pages/album/album-cover.jpg"
            alt="Capa do álbum"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-9 py-4 flex justify-between items-center">
          <div>
            <Header />
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-background hover:text-primary transition-colors">
              <FullscreenIcon size={20} className="text-primary" />
              <span className="font-body_one">Tela cheia</span>
            </button>

            <button className="flex items-center gap-2 text-background hover:text-primary transition-colors">
              <Share2 size={20} className="text-primary" />
              <span className="font-body_one">Compartilhar</span>
            </button>
          </div>
        </div>

        <div className="relative z-20 w-full flex flex-col items-start pl-12 pb-10">
          <h1 className="font-title_one font-bold text-4xl md:text-5xl lg:text-6xl text-background text-center">
            Viagem para Paris
          </h1>

          <p className="font-title_three text-xl md:text-2xl text-background text-center mb-6">
            Uma jornada inesquecível pela Cidade Luz
          </p>

          <div className="flex items-center gap-2">
            <div className="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary">
              <span className="pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform translate-x-[20px] transition duration-200" />
            </div>
            <label htmlFor="auto-scroll" className="text-white font-body_two">
              Habilitar rolagem automática
            </label>
          </div>
        </div>
      </div>

      <main className="bg-background">
        {hasLocations && (
          <section className="container py-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-primary" size={24} />
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

      <Footer />
    </main>
  );
}
