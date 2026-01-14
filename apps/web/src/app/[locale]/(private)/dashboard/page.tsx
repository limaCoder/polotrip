import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { MessageSquare, Plus } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AlbumsList } from "@/components/AlbumsList";
import { ButtonNavigation } from "@/components/ButtonNavigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SkeletonList } from "@/components/SkeletonList";
import { NetworkKeys } from "@/hooks/network/keys";
import { getAlbums } from "@/http/get-albums";
import { Link } from "@/i18n/routing";
import { InstallPwaModalWrapper } from "./(components)/install-pwa-modal-wrapper";
import { OnboardingModalWrapper } from "./(components)/onboarding-modal-wrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const queryClient = new QueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: [NetworkKeys.ALBUMS],
    queryFn: ({ signal }) =>
      getAlbums({ params: { page: 1, limit: 10 }, signal }),
    initialPageParam: 1,
  });

  return (
    <>
      <Header />

      <main className="flex min-h-screen flex-col bg-background">
        <section className="flex-grow bg-secondary/5 pt-24 pb-8 lg:pt-12">
          <div className="container mx-auto px-4 lg:px-9">
            <div className="flex flex-col gap-9">
              <div className="flex items-center gap-4 border-b pb-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t("my_albums")}
                </Link>
                <Link
                  href="/dashboard/chat"
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("chat")}
                </Link>
              </div>

              <div className="items-left flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h1 className="font-title_two">{t("title")}</h1>
                  <p className="font-title_three">{t("subtitle")}</p>
                </div>
                <ButtonNavigation
                  aria-label={t("create_album_button_aria")}
                  className="flex items-center gap-2 bg-primary px-8 py-4 text-background shadow-lg hover:brightness-105 dark:text-white"
                  href="/dashboard/create-album"
                >
                  <Plus color="#F7FCFD" size={24} />
                  <span>{t("create_album_button")}</span>
                </ButtonNavigation>
              </div>

              <div className="grid grid-cols-1 gap-9 md:grid-cols-2 xl:grid-cols-3">
                <HydrationBoundary state={dehydrate(queryClient)}>
                  <Suspense
                    fallback={
                      <SkeletonList
                        className="h-[256px] w-[100%] rounded-2xl shadow-md"
                        count={3}
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
