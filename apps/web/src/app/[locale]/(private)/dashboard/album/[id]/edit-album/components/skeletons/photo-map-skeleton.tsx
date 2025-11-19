import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PhotoMapSkeleton() {
  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <div className="mb-3 flex items-center gap-3">
        <MapPin className="text-primary" size={24} />
        <Skeleton className="h-6 w-32" />
      </div>

      <Skeleton className="mb-6 h-4 w-48" />

      <div className="h-[300px] w-full overflow-hidden rounded-md">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
