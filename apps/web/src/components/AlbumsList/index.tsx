'use client';

import { AlbumCard } from '@/components/AlbumCard';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import useGetInfiniteAlbums from '@/hooks/network/queries/useGetInfiniteAlbums';
import { SkeletonList } from '@/components/SkeletonList';

export function AlbumsList() {
  const albums = useGetInfiniteAlbums();

  if (albums?.items?.length === 0) {
    return <p className="text-center text-gray-500">Nenhum álbum encontrado</p>;
  }

  return (
    <>
      {albums?.items?.map(album => (
        <AlbumCard
          key={album?.id}
          title={album?.title}
          date={album?.createdAt}
          photosCount={album?.photoCount}
          imageUrl={album?.coverImageUrl ?? ''}
        />
      ))}
      <InfiniteScroll
        fetchNextPage={albums?.fetchNextPage}
        hasNextPage={albums?.hasNextPage}
        isFetching={albums?.isFetching}
        loadingComponent={
          <div className="flex justify-between flex-wrap gap-9">
            <SkeletonList count={3} className="w-[31%] h-[256px] rounded-2xl shadow-md" />
          </div>
        }
        rootMargin="100px"
      />
    </>
  );
}
