'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getPublicAlbumPhotos } from '@/http/get-public-album-photos';
import { albumKeys } from '@/hooks/network/keys/albumKeys';
import { Photo as TimelinePhoto, TimelineEvent } from '@/components/PhotoTimeline/types';
import { format, parse } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleDateFnsEnum } from '@/constants/localesEnum';

const useGetPublicAlbumPhotos = (albumId: string) => {
  const locale = useLocale() as 'pt' | 'en';
  const t = useTranslations('PublicAlbumPhotosHook');

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
      const formatString = locale === 'pt' ? "d 'de' MMMM 'de' yyyy" : 'MMMM d, yyyy';
      const formattedDate = format(parsedDate, formatString, { locale: LocaleDateFnsEnum[locale] });

      const transformedPhotos: TimelinePhoto[] = event?.photos?.map(photo => {
        let width = photo?.width ?? 1920;
        let height = photo?.height ?? 1080;

        if (width > 0 && height > 0) {
          const aspectRatio = height / width;

          if (aspectRatio > 3 || aspectRatio < 0.33) {
            [width, height] = [height, width];
          }
        }

        return {
          id: photo?.id,
          src: photo?.imageUrl,
          alt: photo?.description || t('default_alt'),
          width,
          height,
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
