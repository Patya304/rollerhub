import { AppPage, AppPageHeader } from "@/components/app-page";
import { ServiceListItem } from "@/modules/services/components/service-list-item";
import { DEMO_SERVICES, DEMO_STATS } from "@/modules/preview/demo-data";

export default function PreviewServicePage() {
  const totalCost = DEMO_SERVICES.reduce((sum, s) => sum + (s.cost ?? 0), 0);

  return (
    <AppPage>
      <AppPageHeader
        eyebrow="03 · Szerviz"
        title="Szervizkönyv"
        description="Javítások, cserék és ellenőrzések naplója."
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
      <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
        {DEMO_SERVICES.map((s) => (
          <ServiceListItem
            key={s.id}
            title={s.type}
            scooterName={s.scooterName}
            performedAt={s.performedAt}
            odometerKm={s.odometerKm}
            cost={s.cost}
            notes={s.notes}
          />
        ))}
      </div>

      <p className="text-muted-foreground px-1 text-xs">
        Előnézet demóadatokkal, csak megtekintésre. Szerviz nem rögzíthető.
      </p>
    </AppPage>
  );
}
