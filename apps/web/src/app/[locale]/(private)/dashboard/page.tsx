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
import { InstallPwaModalWrapper } from './(components)/install-pwa-modal-wrapper';

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  const queryClient = new QueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: [NetworkKeys.ALBUMS],
    queryFn: ({ signal }) => getAlbums({ params: { page: 1, limit: 10 }, signal }),
    initialPageParam: 1,
  });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background flex flex-col">
        <section className="pb-8 bg-secondary/5 flex-grow pt-24 lg:pt-12">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="flex flex-col gap-9">
              <div className="flex justify-between items-left lg:items-center flex-col lg:flex-row gap-4">
                <div>
                  <h1 className="font-title_two">{t('title')}</h1>
                  <p className="font-title_three">{t('subtitle')}</p>
                </div>
                <ButtonNavigation
                  href="/dashboard/create-album"
                  className="bg-primary text-background py-4 px-8 flex items-center gap-2 shadow-lg hover:brightness-105"
                  aria-label={t('create_album_button_aria')}
                >
                  <Plus size={24} color="#F7FCFD" />
                  <span>{t('create_album_button')}</span>
                </ButtonNavigation>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9">
                <HydrationBoundary state={dehydrate(queryClient)}>
                  <Suspense
                    fallback={
                      <SkeletonList
                        count={3}
                        className="w-[100%] h-[256px] rounded-2xl shadow-md"
                      />
                    }
                  >
                    <AlbumsList />
                  </Suspense>
                </HydrationBoundary>
              </div>
            </div>
          </div>
        </section>
        <OnboardingModalWrapper />
        <InstallPwaModalWrapper />
      </main>
      <Footer />
    </>
  );
}
