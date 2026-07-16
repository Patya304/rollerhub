import { AppPage, AppPageHeader } from "@/components/app-page";
import { RideListItem } from "@/modules/rides/components/ride-list-item";
import { DEMO_RIDES, DEMO_STATS } from "@/modules/preview/demo-data";

export default function PreviewRidesPage() {
  return (
    <AppPage>
      <AppPageHeader title="Menetek" description="Táv, idő, sebesség." />

      {/* Filter sor */}
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
            {DEMO_STATS.rideCount} menet
          </span>
          <span className="bg-muted/60 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold tabular-nums">
            {DEMO_STATS.totalKm.toLocaleString("hu-HU")} km
          </span>
        </div>
      </div>

      {/* Menetlista */}
      <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
        {DEMO_RIDES.map((r) => (
          <RideListItem
            key={r.id}
            scooterName={r.scooterName}
            startAt={r.startAt}
            endAt={r.endAt}
            distanceKm={r.distanceKm}
            avgSpeed={r.avgSpeed}
            maxSpeed={r.maxSpeed}
          />
        ))}
      </div>

      <p className="text-muted-foreground px-1 text-xs">
        Előnézet demóadatokkal, csak megtekintésre. Menet nem rögzíthető.
      </p>
    </AppPage>
  );
}
