'use client';

import { AlbumCard } from '@/components/AlbumCard';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import useGetInfiniteAlbums from '@/hooks/network/queries/useGetInfiniteAlbums';
import { SkeletonList } from '@/components/SkeletonList';
import { useTranslations } from 'next-intl';

export function AlbumsList() {
  const t = useTranslations('AlbumsList');
  const albums = useGetInfiniteAlbums();

  if (albums?.items?.length === 0) {
    return <p className="w-full text-center md:text-left text-gray-500">{t('no_albums_found')}</p>;
  }

  return (
    <>
      {albums?.items?.map(album => (
        <AlbumCard
          key={album?.id}
          id={album?.id}
          title={album?.title}
          date={album?.date}
          photosCount={album?.photoCount}
          imageUrl={album?.coverImageUrl ?? ''}
          stepAfterPayment={album?.currentStepAfterPayment ?? ''}
        />
      ))}
      <InfiniteScroll
        fetchNextPage={albums?.fetchNextPage}
        hasNextPage={albums?.hasNextPage}
        isFetching={albums?.isFetching}
        loadingComponent={
          <SkeletonList count={3} className="w-[100%] h-[256px] rounded-2xl shadow-md" />
        }
        rootMargin="100px"
      />
    </>
  );
}
