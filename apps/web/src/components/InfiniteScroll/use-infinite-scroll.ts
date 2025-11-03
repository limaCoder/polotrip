import { useCallback, useEffect, useRef } from "react";
import type { InfiniteScrollProps } from "@/components/InfiniteScroll/types";

export function useInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetching,
  root,
  rootMargin,
  threshold,
}: InfiniteScrollProps) {
  const infiniteScrollRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const isIntersecting = entry?.isIntersecting;

      if (isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetching]
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
  }, [root, rootMargin, threshold, observerCallback]);

  return infiniteScrollRef;
}
