import Link from "next/link";
import { AppPage, AppPageHeader } from "@/components/app-page";
import { DEMO_SCOOTERS, DEMO_STATS } from "@/modules/preview/demo-data";

export default function PreviewValuePage() {
  return (
    <AppPage>
      <AppPageHeader
        eyebrow="05 · Értékbecslés"
        title="Értékbecslés"
        description="Tájékoztató becslés vételár, évjárat és km-állás alapján."
      />

      {/* Roller értékek */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Becsült értékek
          </p>
        </div>
        <div className="divide-border/30 divide-y">
          {/* Ruptor — teljes adatlap */}
          <Link
            href="/preview/app/garage/demo-ruptor"
            className="hover:bg-muted/30 group flex items-start justify-between gap-4 px-5 py-4 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Ruptor R1 v2</p>
              <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                2024 · 2 000 km
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono font-bold tabular-nums">
                ~{DEMO_SCOOTERS[0].estimate.toLocaleString("hu-HU")} Ft
              </p>
              <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                {DEMO_SCOOTERS[0].retention}% · −
                {DEMO_SCOOTERS[0].depreciation.toLocaleString("hu-HU")} Ft
              </p>
            </div>
          </Link>
          {/* Ninebot */}
          <div className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Ninebot Max G2</p>
              <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                2023 · 1 240 km
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono font-bold tabular-nums">
                ~{DEMO_SCOOTERS[1].estimate.toLocaleString("hu-HU")} Ft
              </p>
              <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                {DEMO_SCOOTERS[1].retention}% · −
                {DEMO_SCOOTERS[1].depreciation.toLocaleString("hu-HU")} Ft
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Garázs összesítő */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Garázs összesítő
          </p>
        </div>
        <div className="divide-border/30 grid grid-cols-2 divide-x">
          <div className="px-5 py-4">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Összes vételár
            </p>
            <p className="mt-1.5 font-mono text-xl leading-none font-bold tabular-nums">
              {DEMO_STATS.totalPurchase.toLocaleString("hu-HU")}
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                Ft
              </span>
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Becsült érték
            </p>
            <p className="mt-1.5 font-mono text-xl leading-none font-bold tabular-nums">
              ~{DEMO_STATS.totalValue.toLocaleString("hu-HU")}
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                Ft
              </span>
            </p>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground px-1 text-xs">
        Az értékbecslés tájékoztató jellegű: vételár, km-állás és évjárat
        alapján számolódik. Előnézet demóadatokkal, csak megtekintésre.
      </p>
    </AppPage>
  );
}
