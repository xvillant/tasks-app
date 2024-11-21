import { Skeleton } from "@/components/ui/skeleton";
import { TasksSkeleton } from "@/components/tasks/tasks-skeleton";

export function ProfileInfoSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-5">
      <Skeleton className="h-[345px] w-full" />
      <Skeleton className="h-[345px] w-full" />
    </div>
  );
}

export function ProfileTasksSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-9 w-full" />
      <TasksSkeleton />
    </div>
  );
}
