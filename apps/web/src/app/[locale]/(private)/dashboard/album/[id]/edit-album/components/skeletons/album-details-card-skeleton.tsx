import { Skeleton } from "@/components/ui/skeleton";

export function AlbumDetailsCardSkeleton() {
  return (
    <div className="rounded-lg bg-card p-6 shadow">
      <div className="mb-4 flex flex-col items-start justify-between">
        <div className="w-full">
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="mt-2 h-8 w-32" />
      </div>

      <div className="space-y-4">
        <div>
          <Skeleton className="mb-1 h-4 w-24" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-28" />
          <Skeleton className="aspect-square h-80 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
