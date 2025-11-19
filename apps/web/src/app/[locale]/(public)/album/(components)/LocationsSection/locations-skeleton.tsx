import { Skeleton } from "@/components/ui/skeleton";

export function LocationsSkeleton() {
  return (
    <section className="container px-4 py-8">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="hidden h-6 w-6 md:block" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </section>
  );
}
