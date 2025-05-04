'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getPublicAlbumPhotos } from '@/http/get-public-album-photos';
import { albumKeys } from '@/hooks/network/keys/albumKeys';
import { Photo as TimelinePhoto, TimelineEvent } from '@/components/PhotoTimeline/types';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    page?.timelineEvents.forEach(event => {
      const parsedDate = parse(event.date, 'yyyy-MM-dd', new Date());
      const formattedDate = format(parsedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

      const transformedPhotos: TimelinePhoto[] = event?.photos?.map(photo => {
        let width = photo?.width || 0;
        let height = photo?.height || 0;

        if (width > 0 && height > 0) {
          const aspectRatio = height / width;

          if (aspectRatio > 3 || aspectRatio < 0.33) {
            [width, height] = [height, width];
          }
        }

        return {
          id: photo?.id,
          src: photo?.imageUrl,
          alt: photo?.description || 'Foto do álbum',
          width: photo?.width || 0,
          height: photo?.height || 0,
          description: photo?.description || '',
        };
      });

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
