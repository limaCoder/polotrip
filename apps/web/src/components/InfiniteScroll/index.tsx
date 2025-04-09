'use client';

import { useCallback, useEffect, useRef } from 'react';
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
  const infiniteScrollRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const isIntersecting = entry?.isIntersecting;

      if (isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetching],
  );

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(observerCallback, {
      root,
      rootMargin,
      threshold: threshold || 0,
    });

    if (infiniteScrollRef?.current) {
      intersectionObserver.observe(infiniteScrollRef?.current);
    }

    return () => {
      intersectionObserver.disconnect();
    };
  }, [infiniteScrollRef, root, rootMargin, threshold, observerCallback]);

  return (
    <>
      {isFetching ? (
        <div className="h-full w-full">
          {loadingComponent}
          {hasLoadingMessage && <div>{loadingMessage}</div>}
        </div>
      ) : null}
      <div ref={infiniteScrollRef} />
    </>
  );
}
