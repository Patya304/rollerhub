import { Skeleton } from "@/components/ui/skeleton";

export default function ScooterDetailsLoading() {
  return (
    <div
      className="mx-auto w-full max-w-2xl space-y-4"
      role="status"
      aria-live="polite"
      aria-label="Roller adatlap betöltése"
    >
      <Skeleton className="h-5 w-20" />

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="flex items-start gap-4 p-5 pb-4">
          <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="border-border/50 grid grid-cols-3 divide-x border-t">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2 px-4 py-3">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-5 w-14" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card space-y-3 overflow-hidden rounded-xl border p-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
