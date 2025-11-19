import { Skeleton } from "@/components/ui/skeleton";

export function PhotoEditFormSkeleton() {
  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <Skeleton className="mb-6 h-6 w-48" />

      <div className="mb-4 flex flex-col gap-6">
        <div className="flex flex-col">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="mb-2 h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="mb-2 h-4 w-28" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
