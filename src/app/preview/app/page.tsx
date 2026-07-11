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
      <AppPageHeader
        eyebrow="01 · Műszerfal"
        title="Digitális garázs"
        description="Előnézet demóadatokkal. Nem használ valódi fiókadatokat, és nem lehet menteni."
      />

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

      {/* Előnézeti képernyők — emberi és AI review-hoz */}
      <AppPanelList label="Előnézeti képernyők">
        <AppListItem
          href="/preview/app/garage"
          marker="01"
          title="Garázs és roller hozzáadás"
          description="Rollerlista és a lépésenkénti hozzáadás flow."
        />
        <AppListItem
          href="/preview/app/garage/demo-ruptor"
          marker="02"
          title="Roller adatlap"
          description="Műszaki adatok, érték, szervizkönyv, értéktörténet."
        />
        <AppListItem
          href="/preview/app/service"
          marker="03"
          title="Szervizkönyv"
          description="Szervizbejegyzések listája."
        />
        <AppListItem
          href="/preview/app/rides"
          marker="04"
          title="Menetek"
          description="Menetnapló táv- és sebességadatokkal."
        />
        <AppListItem
          href="/preview/app/value"
          marker="05"
          title="Értékbecslés"
          description="Becsült értékek és garázs összesítő."
        />
        <AppListItem
          href="/preview/app/knowledge"
          marker="06"
          title="Tudástár"
          description="Témakörök listája."
        />
        <AppListItem
          href="/preview/app/profile/me"
          marker="07"
          title="Profilom"
          description="Profil szerkesztő és publikus profil kapcsoló."
        />
        <AppListItem
          href="/preview/app/profile/public"
          marker="08"
          title="Publikus profil"
          description="Ahogy mások látják a profilt."
        />
        <AppListItem
          href="/preview/app/settings"
          marker="09"
          title="Beállítások"
          description="Megjelenés, nyelv, fiók."
        />
        <AppListItem
          href="/pricing"
          marker="10"
          title="Árak"
          description="Free és Premium csomagok."
        />
        <AppListItem
          href="/sample-report"
          marker="11"
          title="Minta riport"
          description="Értékriport előnézet."
        />
      </AppPanelList>

      {/* Premium callout */}
      <div className="border-primary/20 rounded-xl border px-5 py-4">
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          Premium · Hamarosan
        </p>
        <p className="mt-1 font-semibold">Értékriport és eladási állapotlap</p>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Értékriport szervizekkel, km-állással és exporttal.
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
