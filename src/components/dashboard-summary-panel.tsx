export type DashboardSummaryPanelProps = {
  scooterCount: number;
  totalMileage: number;
  totalEstimatedValue?: number | null;
  serviceCount?: number;
};

export function DashboardSummaryPanel({
  scooterCount,
  totalMileage,
  totalEstimatedValue,
  serviceCount,
}: DashboardSummaryPanelProps) {
  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      <div className="border-border/50 border-b px-5 py-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
          Garázs összesítő
        </p>
      </div>
      <div className="divide-border/30 grid grid-cols-2 divide-x divide-y">
        <div className="px-5 py-4">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Rollerek
          </p>
          <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
            {scooterCount}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Összes km
          </p>
          <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
            {totalMileage.toLocaleString("hu-HU")}
            <span className="text-muted-foreground ml-1 text-sm font-normal">
              km
            </span>
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Becsült érték
          </p>
          <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
            {totalEstimatedValue != null && totalEstimatedValue > 0
              ? `~${totalEstimatedValue.toLocaleString("hu-HU")}`
              : "–"}
            {totalEstimatedValue != null && totalEstimatedValue > 0 && (
              <span className="text-muted-foreground ml-1 text-sm font-normal">
                Ft
              </span>
            )}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Szervizek
          </p>
          <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
            {serviceCount ?? "–"}
          </p>
        </div>
      </div>
    </div>
  );
}
