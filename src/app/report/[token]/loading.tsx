import { Skeleton } from "@/components/ui/skeleton";

export default function SaleReportLoading() {
  return (
    <main
      className="mx-auto w-full max-w-2xl space-y-4 px-4 py-10"
      role="status"
      aria-live="polite"
      aria-label="Eladási állapotlap betöltése"
    >
      <Skeleton className="h-4 w-16" />

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-4">
          <Skeleton className="h-3 w-32" />
          <div className="mt-2 flex items-center gap-3">
            <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid grid-cols-2 gap-0 rounded-lg border">
            <div className="px-4 py-3">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="mt-2 h-5 w-12" />
            </div>
            <div className="px-4 py-3">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="mt-2 h-5 w-6" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-20 w-full rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}
