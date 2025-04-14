import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ButtonNavigation } from '@/components/ButtonNavigation';
import { AlbumsList } from '@/components/AlbumsList';
import { SkeletonList } from '@/components/SkeletonList';

import { NetworkKeys } from '@/hooks/network/keys';
import { getAlbums } from '@/http/get-albums';
import { OnboardingModalWrapper } from './(components)/onboarding-modal-wrapper';

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: [NetworkKeys.ALBUMS],
    queryFn: ({ signal }) => getAlbums({ params: { page: 1, limit: 10 }, signal }),
    initialPageParam: 1,
  });

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <section className="py-8 bg-secondary/5 flex-grow">
        <div className="container mx-auto px-4 lg:px-9">
          <div className="p-9 flex flex-col gap-9">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-title_two">Meus Álbuns</h1>
                <p className="font-title_three">Gerencie e compartilhe suas memórias de viagem</p>
              </div>
              <ButtonNavigation
                href="/dashboard/create-album"
                className="bg-primary text-background py-4 px-8 flex items-center gap-2 shadow-lg hover:brightness-105"
              >
                <Plus size={24} color="#F7FCFD" />
                <span>Criar Novo Álbum</span>
              </ButtonNavigation>
            </div>

            <div className="flex flex-wrap gap-9">
              <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense
                  fallback={
                    <SkeletonList count={3} className="w-[31%] h-[256px] rounded-2xl shadow-md" />
                  }
                >
                  <AlbumsList />
                </Suspense>
              </HydrationBoundary>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <OnboardingModalWrapper />
    </main>
  );
}
