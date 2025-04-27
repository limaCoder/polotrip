'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getPublicAlbumPhotos } from '@/http/get-public-album-photos';
import { albumKeys } from '@/hooks/network/keys/albumKeys';
import { Photo as TimelinePhoto, TimelineEvent } from '@/components/PhotoTimeline/types';

const useGetPublicAlbumPhotos = (albumId: string) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useSuspenseInfiniteQuery({
    queryKey: albumKeys.publicPhotosList(albumId),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }) => {
      return getPublicAlbumPhotos({
        albumId,
        cursor: pageParam === null ? undefined : (pageParam as string),
        limit: 20,
        signal,
      });
    },
    getNextPageParam: lastPage => {
      if (!lastPage.pagination.hasMore) return undefined;
      return lastPage.pagination.nextCursor || undefined;
    },
  });

  const eventsByDate = new Map<string, TimelinePhoto[]>();

  data?.pages.forEach(page => {
    page.timelineEvents.forEach(event => {
      const formattedDate = new Date(event.date).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const transformedPhotos: TimelinePhoto[] = event.photos.map(photo => ({
        id: photo.id,
        src: photo.imageUrl,
        alt: photo.description || 'Foto do álbum',
        width: 300,
        height: Math.floor(Math.random() * 150) + 300,
      }));

      if (eventsByDate.has(formattedDate)) {
        eventsByDate.get(formattedDate)!.push(...transformedPhotos);
      } else {
        eventsByDate.set(formattedDate, transformedPhotos);
      }
    });
  });

  const transformedEvents: TimelineEvent[] = Array.from(eventsByDate.entries())
    .map(([date, photos]) => ({
      date,
      photos,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    timelineEvents: transformedEvents,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetching,
    isLoading,
  };
};

export default useGetPublicAlbumPhotos;
