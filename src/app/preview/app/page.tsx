import Link from "next/link";
import {
  AppPage,
  AppPageHeader,
  AppPanelList,
  AppListItem,
} from "@/components/app-page";
import { DashboardSummaryPanel } from "@/components/dashboard-summary-panel";
import { DEMO_STATS } from "@/modules/preview/demo-data";

export default function PreviewDashboardPage() {
  return (
    <AppPage>
      <AppPageHeader eyebrow="01 · Műszerfal" title="Digitális garázs" />

      <DashboardSummaryPanel
        scooterCount={DEMO_STATS.scooterCount}
        totalMileage={DEMO_STATS.totalKm}
        totalEstimatedValue={DEMO_STATS.totalValue}
        serviceCount={DEMO_STATS.serviceCount}
      />

      {/* Következő lépés */}
      <Link
        href="/preview/app/rides"
        className="border-primary/20 bg-primary/5 hover:border-primary/40 group block rounded-xl border px-5 py-4 transition-colors"
      >
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          Következő lépés
        </p>
        <p className="mt-1 font-semibold group-hover:underline">
          Rögzítsd az első menetet
        </p>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Menetek távval, idővel és sebességgel.
        </p>
      </Link>

      {/* Modulok */}
      <AppPanelList label="Modulok">
        <AppListItem
          href="/preview/app/garage"
          icon="🛴"
          title="Garázs"
          description="Rollereid adatlapja és km-állása."
          meta={`${DEMO_STATS.scooterCount} roller`}
        />
        <AppListItem
          href="/preview/app/service"
          icon="🔧"
          title="Szervizkönyv"
          description="Javítások, cserék és ellenőrzések."
          meta={`${DEMO_STATS.serviceCount} bejegyzés · ${DEMO_STATS.totalServiceCost.toLocaleString("hu-HU")} Ft`}
        />
        <AppListItem
          href="/preview/app/rides"
          icon="🛣️"
          title="Menetnapló"
          description="Táv, idő és sebesség."
          meta={`${DEMO_STATS.rideCount} menet · ${DEMO_STATS.totalKm.toLocaleString("hu-HU")} km`}
        />
        <AppListItem
          href="/preview/app/value"
          icon="📊"
          title="Értékbecslés"
          description="Tájékoztató érték vételár és km-állás alapján."
          meta={`~${DEMO_STATS.totalValue.toLocaleString("hu-HU")} Ft`}
        />
        <AppListItem
          href="/preview/app/knowledge"
          icon="📖"
          title="Tudástár"
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
          Részletes eladási riport szervizekkel, km-állással és PDF exporttal.
        </p>
        <Link
          href="/pricing"
          className="text-primary mt-3 inline-block text-sm font-medium hover:underline"
        >
          Csomagok megtekintése →
        </Link>
      </div>
    </AppPage>
  );
}
