import { Skeleton } from "@/components/ui/skeleton";

export function AlbumCoverSkeleton() {
  return (
    <div className="relative flex h-[430px] w-full flex-col justify-between md:h-[510px]">
      <div className="absolute inset-0 z-0">
        <Skeleton className="h-full w-full" />
      </div>
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 lg:px-9">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </header>
      <div className="relative z-20 flex w-full flex-col items-start p-4 sm:p-8 md:pb-10 md:pl-12">
        <Skeleton className="mb-2 h-12 w-64 md:h-16 md:w-80" />
        <Skeleton className="h-6 w-96 md:h-8" />
      </div>
    </div>
  );
}
