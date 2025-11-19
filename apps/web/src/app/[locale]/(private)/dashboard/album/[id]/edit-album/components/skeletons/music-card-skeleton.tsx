import { Music } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MusicCardSkeleton() {
  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <div className="mb-3 flex items-center gap-3">
        <Music className="text-primary" size={24} />
        <Skeleton className="h-6 w-32" />
      </div>

      <Skeleton className="mb-6 h-4 w-64" />

      <div className="space-y-4">
        <div>
          <Skeleton className="mb-2 h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-12 w-full rounded" />
      </div>
    </div>
  );
}
