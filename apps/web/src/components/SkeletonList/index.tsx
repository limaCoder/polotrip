import { Skeleton } from "../ui/skeleton";
import type { SkeletonListProps } from "./types";

export function SkeletonList({ count, className }: SkeletonListProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          className={className}
          key={`skeleton-list-item-${index + 1}`}
        />
      ))}
    </>
  );
}
