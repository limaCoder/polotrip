import { SkeletonList } from "@/components/SkeletonList";
import { Skeleton } from "@/components/ui/skeleton";

export function PhotoGallerySkeleton() {
  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <div className="mb-3">
        <Skeleton className="mb-1 h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row">
        <Skeleton className="h-5 w-48" />
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <SkeletonList className="h-[200px] w-full rounded-sm" count={10} />
      </div>

      <div className="mt-6 flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}
