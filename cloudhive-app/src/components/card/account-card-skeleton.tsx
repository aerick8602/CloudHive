import { Skeleton } from "../ui/skeleton";
export default function AccountCardSkeleton() {
  return (
    <li className="rounded-lg border p-4 hover:shadow-md transition-shadow h-[280px] flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="mt-3 pt-3 border-t space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
