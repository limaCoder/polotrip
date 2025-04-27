'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { getAlbums } from '@/http/get-albums';
import { GetAlbumsResponse } from '@/http/get-albums/types';
import { albumKeys } from '@/hooks/network/keys/albumKeys';

const useGetInfiniteAlbums = () => {
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage = false,
    isFetching,
    isLoading,
    isError,
    error,
  } = useSuspenseInfiniteQuery<GetAlbumsResponse, Error>({
    queryKey: [albumKeys.all],
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      return getAlbums({
        params: {
          page: Number(pageParam),
          limit: 9,
        },
        signal,
      });
    },
    getNextPageParam: lastPage => {
      if (!lastPage || !lastPage.pagination) {
        return undefined;
      }

      const hasMore = lastPage.pagination.page < lastPage.pagination.totalPages;

      return hasMore ? lastPage.pagination.page + 1 : undefined;
    },
  });

  const flatItems = data?.pages?.flatMap(page => page?.albums || []) || [];

  const infiniteItems = {
    items: flatItems,
    refetch,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  };

  return infiniteItems;
};

export default useGetInfiniteAlbums;
