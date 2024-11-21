import { Skeleton } from "@/components/ui/skeleton";

export function TasksSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid place-items-center gap-y-1">
      {Array.from({ length: Math.min(5, count) }, (_, index) => (
        <Skeleton className="w-full h-14" key={index} />
      ))}
    </div>
  );
}
