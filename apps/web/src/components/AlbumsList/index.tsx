"use client";

import { useTranslations } from "next-intl";
import { AlbumCard } from "@/components/AlbumCard";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { SkeletonList } from "@/components/SkeletonList";
import useGetInfiniteAlbums from "@/hooks/network/queries/useGetInfiniteAlbums";

export function AlbumsList() {
  const t = useTranslations("AlbumsList");
  const albums = useGetInfiniteAlbums();

  if (albums?.items?.length === 0) {
    return (
      <p className="w-full text-center text-gray-500 md:text-left">
        {t("no_albums_found")}
      </p>
    );
  }

  return (
    <>
      {albums?.items?.map((album) => (
        <AlbumCard
          date={album?.date}
          id={album?.id}
          imageUrl={album?.coverImageUrl ?? ""}
          key={album?.id}
          photosCount={album?.photoCount}
          stepAfterPayment={album?.currentStepAfterPayment ?? ""}
          title={album?.title}
        />
      ))}
      <InfiniteScroll
        fetchNextPage={albums?.fetchNextPage}
        hasNextPage={albums?.hasNextPage}
        isFetching={albums?.isFetching}
        loadingComponent={
          <SkeletonList
            className="h-[256px] w-[100%] rounded-2xl shadow-md"
            count={3}
          />
        }
        rootMargin="100px"
      />
    </>
  );
}
