'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { NetworkKeys } from '@/hooks/network/keys';
import { getAlbums } from '@/http/get-albums';
import { GetAlbumsResponse } from '@/http/get-albums/types';

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
    queryKey: [NetworkKeys.ALBUMS],
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
