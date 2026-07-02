import { AppPage, AppPageHeader } from "@/components/app-page";
import { DEMO_RIDES, DEMO_STATS } from "@/modules/preview/demo-data";

export default function PreviewRidesPage() {
  return (
    <AppPage>
      <AppPageHeader
        eyebrow="04 · Menetnapló"
        title="Menetek"
        description="Menetek távval, idővel és sebességgel."
      />

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
      <div className="bg-card overflow-hidden rounded-xl border">
        {DEMO_RIDES.map((r, idx) => (
          <div
            key={r.id}
            className={`flex items-start gap-4 px-5 py-4 text-sm ${
              idx < DEMO_RIDES.length - 1 ? "border-border/40 border-b" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{r.scooterName}</p>
              <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                {new Date(r.startAt).toLocaleString("hu-HU")}
                {r.endAt
                  ? ` – ${new Date(r.endAt).toLocaleTimeString("hu-HU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.distanceKm != null && (
                  <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                    {r.distanceKm.toLocaleString("hu-HU")} km
                  </span>
                )}
                {r.avgSpeed != null && (
                  <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                    átl. {r.avgSpeed} km/h
                  </span>
                )}
                {r.maxSpeed != null && (
                  <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                    max {r.maxSpeed} km/h
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground px-1 text-xs">
        Demó mód: a menetadatok statikusak, valódi napló nem rögzíthető.
      </p>
    </AppPage>
  );
}
