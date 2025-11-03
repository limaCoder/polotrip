import type { ReactNode } from "react";

type InfiniteScrollProps = {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetching: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  loadingComponent?: ReactNode;
  loadingMessage?: string;
  hasLoadingMessage?: boolean;
};

export type { InfiniteScrollProps };
