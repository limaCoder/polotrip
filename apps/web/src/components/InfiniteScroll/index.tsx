'use client';

import { useInfiniteScroll } from './use-infinite-scroll';
import { InfiniteScrollProps } from './types';

export function InfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetching,
  root,
  rootMargin,
  threshold,
  loadingComponent,
  loadingMessage,
  hasLoadingMessage = false,
}: InfiniteScrollProps) {
  const infiniteScrollRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
    root,
    rootMargin,
    threshold,
  });

  return (
    <>
      {isFetching ? (
        <>
          {loadingComponent}
          {hasLoadingMessage && <div>{loadingMessage}</div>}
        </>
      ) : null}
      <div ref={infiniteScrollRef} />
    </>
  );
}
