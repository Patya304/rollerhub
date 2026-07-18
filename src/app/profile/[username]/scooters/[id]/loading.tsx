import { Skeleton } from "@/components/ui/skeleton";

export default function PublicScooterLoading() {
  return (
    <main
      className="mx-auto w-full max-w-2xl space-y-4 px-4 py-10"
      role="status"
      aria-live="polite"
      aria-label="Roller adatlap betöltése"
    >
      <Skeleton className="h-4 w-16" />

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="flex items-start gap-4 p-5 pb-4">
          <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        <div className="border-border/50 divide-border/30 grid grid-cols-2 divide-x border-t">
          <div className="px-4 py-3">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="mt-2 h-5 w-16" />
          </div>
          <div className="px-4 py-3">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="mt-2 h-5 w-8" />
          </div>
        </div>
      </div>

      <div className="bg-card flex items-center justify-between gap-3 rounded-xl border px-5 py-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </main>
  );
}
