import { Skeleton } from "@/components/ui/skeleton";

export default function ServicePageLoading() {
  return (
    <div
      className="mx-auto w-full max-w-2xl space-y-4"
      role="status"
      aria-live="polite"
      aria-label="Szervizkönyv betöltése"
    >
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="shrink-0 space-y-1.5 text-right">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
