import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Plus, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AlbumsList } from "@/components/AlbumsList";
import { ButtonNavigation } from "@/components/ButtonNavigation";
import { SkeletonList } from "@/components/SkeletonList";
import { NetworkKeys } from "@/hooks/network/keys";
import { getAlbums } from "@/http/get-albums";
import { InstallPwaModalWrapper } from "../(components)/install-pwa-modal-wrapper";
import { OnboardingModalWrapper } from "../(components)/onboarding-modal-wrapper";

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
      <div className="mb-14 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs tracking-wide">
            <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="font-extrabold text-4xl text-text tracking-tight md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg text-text leading-relaxed lg:text-xl">
            {t("subtitle")}
          </p>
        </div>

        <ButtonNavigation
          aria-label={t("create_album_button_aria")}
          className="group hover:-translate-y-1 relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
          href="/dashboard/create-album"
        >
          <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
          <Plus
            className="relative z-10 transition-transform duration-300 group-hover:rotate-90"
            color="currentColor"
            size={22}
          />
          <span className="relative z-10">{t("create_album_button")}</span>
        </ButtonNavigation>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <SkeletonList
                className="h-[280px] w-full rounded-3xl shadow-sm"
                count={3}
              />
            }
          >
            <AlbumsList />
          </Suspense>
        </HydrationBoundary>
      </div>

      <OnboardingModalWrapper />
      <InstallPwaModalWrapper />
    </>
  );
}
