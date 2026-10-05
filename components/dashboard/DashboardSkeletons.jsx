import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { SKELETON_BAR_HEIGHTS } from "../../features/dashboard/constants";

export function SummaryCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-5">
        <Skeleton className="h-11 w-11 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton({ height = 320 }) {
  return (
    <div className="space-y-3" style={{ height }}>
      <div className="flex h-full items-end gap-2 px-4 pb-4">
        {SKELETON_BAR_HEIGHTS.map((barHeight, index) => (
          <Skeleton key={index} className="flex-1 rounded-t-md" style={{ height: `${barHeight}%` }} />
        ))}
      </div>
    </div>
  );
}

export function TopProductsSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.45fr)]">
      <div className="rounded-3xl border bg-muted/40 p-5">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-4 h-8 w-52" />
        <Skeleton className="mt-2 h-4 w-36" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border bg-background/80 p-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-2 h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-2xl border p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-3 md:w-[34%]">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-2.5 w-full rounded-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="flex items-center gap-3 md:w-[180px] md:justify-end">
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
