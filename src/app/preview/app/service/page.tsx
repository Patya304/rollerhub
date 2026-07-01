import { AppPage, AppPageHeader } from "@/components/app-page";
import { DEMO_SERVICES, DEMO_STATS } from "@/modules/preview/demo-data";

export default function PreviewServicePage() {
  const totalCost = DEMO_SERVICES.reduce((sum, s) => sum + (s.cost ?? 0), 0);

  return (
    <AppPage>
      <AppPageHeader
        eyebrow="03 · Szerviz"
        title="Szervizkönyv"
        description="Karbantartások, javítások és ellenőrzések naplója."
      />

      {/* Filter sor — vizuális, nem működő */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          disabled
          className="border-input bg-background h-9 cursor-not-allowed rounded-lg border px-3 text-sm opacity-60"
        >
          <option>Összes roller</option>
          <option>Ruptor R1 v2</option>
          <option>Ninebot Max G2</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {DEMO_STATS.serviceCount} bejegyzés
          </span>
          <span className="bg-muted/60 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold tabular-nums">
            {totalCost.toLocaleString("hu-HU")} Ft
          </span>
        </div>
      </div>

      {/* Szervizlista */}
      <div className="bg-card overflow-hidden rounded-xl border">
        {DEMO_SERVICES.map((s, idx) => (
          <div
            key={s.id}
            className={`flex items-start justify-between gap-4 px-5 py-4 text-sm ${
              idx < DEMO_SERVICES.length - 1 ? "border-border/40 border-b" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{s.type}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {s.scooterName}
              </p>
              {s.notes && (
                <p className="text-muted-foreground mt-1.5 text-xs leading-snug">
                  {s.notes}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-muted-foreground font-mono text-xs tabular-nums">
                {new Date(s.performedAt).toLocaleDateString("hu-HU")}
              </p>
              {s.odometerKm != null && (
                <p className="text-muted-foreground font-mono text-xs tabular-nums">
                  {s.odometerKm.toLocaleString("hu-HU")} km
                </p>
              )}
              {s.cost != null && (
                <p className="mt-0.5 font-mono text-xs font-semibold tabular-nums">
                  {s.cost.toLocaleString("hu-HU")} Ft
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground px-1 text-xs">
        Demo mód — a szervizadatok statikusak, nem szerkeszthetők.
      </p>
    </AppPage>
  );
}
