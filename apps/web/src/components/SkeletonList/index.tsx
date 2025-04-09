import { SkeletonListProps } from './types';
import { Skeleton } from '../ui/skeleton';

export function SkeletonList({ count, className }: SkeletonListProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={className} />
      ))}
    </>
  );
}
