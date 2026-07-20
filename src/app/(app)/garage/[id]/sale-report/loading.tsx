import { Skeleton } from "@/components/ui/skeleton";

export default function SaleReportWorkspaceLoading() {
  return (
    <div
      className="mx-auto w-full max-w-2xl space-y-4"
      role="status"
      aria-live="polite"
      aria-label="Eladási állapotlap betöltése"
    >
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="bg-card overflow-hidden rounded-xl border px-5 py-4">
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="bg-card overflow-hidden rounded-xl border px-5 py-4">
        <Skeleton className="mb-3 h-4 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
