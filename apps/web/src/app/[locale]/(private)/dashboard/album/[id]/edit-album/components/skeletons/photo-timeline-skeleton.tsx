import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PhotoTimelineSkeleton() {
  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <div className="mb-6 flex items-center gap-3">
        <Calendar className="text-primary" size={24} />
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            className="h-16 w-full rounded-lg"
            key={`photo-timeline-skeleton-${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
