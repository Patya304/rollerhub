import Link from "next/link";
import {
  AppPage,
  AppPageHeader,
  AppPanelList,
  AppListItem,
} from "@/components/app-page";
import { DEMO_STATS } from "@/modules/preview/demo-data";

export default function PreviewDashboardPage() {
  return (
    <AppPage>
      <AppPageHeader eyebrow="01 · Műszerfal" title="Digitális garázs" />

      {/* Hero stat panel */}
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
              {DEMO_STATS.scooterCount}
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Összes km
            </p>
            <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
              {DEMO_STATS.totalKm.toLocaleString("hu-HU")}
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
              ~{DEMO_STATS.totalValue.toLocaleString("hu-HU")}
              <span className="text-muted-foreground ml-1 text-sm font-normal">
                Ft
              </span>
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Szervizek
            </p>
            <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
              {DEMO_STATS.serviceCount}
            </p>
          </div>
        </div>
      </div>

      {/* Következő lépés */}
      <Link
        href="/preview/app/rides"
        className="border-primary/20 bg-primary/5 hover:border-primary/40 group block rounded-xl border px-5 py-4 transition-colors"
      >
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          Következő lépés
        </p>
        <p className="mt-1 font-semibold group-hover:underline">
          Naplózz egy első menetet
        </p>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Kövesd, mennyit és hogyan tekersz a rollereiden.
        </p>
      </Link>

      {/* Modulok */}
      <AppPanelList label="Modulok">
        <AppListItem
          href="/preview/app/garage"
          icon="🛴"
          title="Garázs"
          description="Rollerjeid adatlapja és km-állása."
          meta={`${DEMO_STATS.scooterCount} roller`}
        />
        <AppListItem
          href="/preview/app/service"
          icon="🔧"
          title="Szervizkönyv"
          description="Karbantartások, javítások, ellenőrzések."
          meta={`${DEMO_STATS.serviceCount} bejegyzés · ${DEMO_STATS.totalServiceCost.toLocaleString("hu-HU")} Ft`}
        />
        <AppListItem
          href="/preview/app/rides"
          icon="🛣️"
          title="Menetnapló"
          description="Kiszállások, megtett táv, sebesség."
          meta={`${DEMO_STATS.rideCount} menet · ${DEMO_STATS.totalKm.toLocaleString("hu-HU")} km`}
        />
        <AppListItem
          href="/preview/app/value"
          icon="📊"
          title="Értékbecslés"
          description="Roller aktuális piaci értékének becslése."
          meta={`~${DEMO_STATS.totalValue.toLocaleString("hu-HU")} Ft`}
        />
        <AppListItem
          href="/preview/app/knowledge"
          icon="📖"
          title="Tudásközpont"
          description="KRESZ, biztosítás, jogosítvány, szabályok."
        />
      </AppPanelList>

      {/* Premium callout */}
      <div className="border-primary/20 rounded-xl border px-5 py-4">
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          Premium · Hamarosan
        </p>
        <p className="mt-1 font-semibold">Értékriport és eladási állapotlap</p>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Részletes eladási riport, dokumentált előzmények, PDF export.
        </p>
        <Link
          href="/pricing"
          className="text-primary mt-3 inline-block text-sm font-medium hover:underline"
        >
          Megnézem a csomagokat →
        </Link>
      </div>
    </AppPage>
  );
}
