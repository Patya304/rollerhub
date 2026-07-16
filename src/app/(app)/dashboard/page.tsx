import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/modules/dashboard/services/dashboard-service";
import { Button } from "@/components/ui/button";
import {
  AppPage,
  AppPageHeader,
  AppPanelList,
  AppListItem,
} from "@/components/app-page";
import { DashboardSummaryPanel } from "@/components/dashboard-summary-panel";

function getNextStep(
  stats: {
    scooterCount: number;
    serviceCount: number;
    rideCount: number;
    totalValue: number;
  },
  firstScooterId: string | undefined,
): { label: string; description: string; href: string; eyebrow: string } {
  const scooterHref = firstScooterId ? `/garage/${firstScooterId}` : "/garage";

  if (stats.serviceCount === 0) {
    return {
      eyebrow: "Következő lépés",
      label: "Rögzíts egy első szervizt",
      description:
        "Nyisd meg a roller adatlapját, és görgess a Szervizkönyvhöz.",
      href: scooterHref,
    };
  }
  if (stats.rideCount === 0) {
    return {
      eyebrow: "Következő lépés",
      label: "Rögzítsd az első menetet",
      description: "Menetek távval, idővel és sebességgel.",
      href: "/rides",
    };
  }
  if (stats.totalValue === 0) {
    return {
      eyebrow: "Következő lépés",
      label: "Értékbecslés indítása",
      description:
        "Adj meg vételárat, majd indíts becslést a roller adatlapján.",
      href: scooterHref,
    };
  }
  return {
    eyebrow: "Garázs állapota",
    label: "Minden rendben van",
    description:
      "Roller, szerviz, menet és értékbecslés is dokumentálva. Jó munka.",
    href: "/garage",
  };
}

export default async function OverviewPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const data = await getDashboardData(session.user.id);
  const { stats } = data;

  if (stats.scooterCount === 0) {
    return (
      <AppPage>
        <AppPageHeader
          eyebrow="01 · Műszerfal"
          title="Digitális garázs"
          description="Add hozzá az első rolleredet a kezdéshez."
        />

        {/* Onboarding first step */}
        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="border-border/50 border-b px-5 py-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
              Első lépés
            </p>
          </div>
          <div className="px-5 py-6">
            <p className="text-2xl">🛴</p>
            <p className="mt-3 text-lg font-semibold">
              Hozd létre a garázsodat
            </p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              Ezzel indul a szerviznapló, az értékbecslés és az eladási
              állapotlap. 2 perc az egész.
            </p>
            <Button asChild className="mt-5">
              <Link href="/garage?add=1">Első roller hozzáadása</Link>
            </Button>
          </div>
        </div>

        {/* Mi vár rád */}
        <AppPanelList label="Mi épül fel ezután">
          <AppListItem
            icon="🔧"
            title="Szerviznapló"
            description="Gumicsere, fékállítás, akkuellenőrzés."
          />
          <AppListItem
            icon="📊"
            title="Értékbecslés"
            description="Becsült piaci érték vételár, km-állás és évjárat alapján."
          />
          <AppListItem
            icon="📋"
            title="Eladási állapotlap"
            description="Szervizek, km-állás és becsült érték, ha eladnád."
          />
        </AppPanelList>
      </AppPage>
    );
  }

  const nextStep = getNextStep(stats, data.recentScooters[0]?.id);

  return (
    <AppPage>
      <AppPageHeader eyebrow="01 · Műszerfal" title="Digitális garázs" />

      <DashboardSummaryPanel
        scooterCount={stats.scooterCount}
        totalMileage={stats.totalKm}
        totalEstimatedValue={stats.totalValue}
        serviceCount={stats.serviceCount}
      />

      {/* Következő lépés */}
      <Link
        href={nextStep.href}
        className="border-primary/20 bg-primary/5 hover:border-primary/40 group block rounded-xl border px-5 py-4 transition-colors"
      >
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          {nextStep.eyebrow}
        </p>
        <p className="mt-1 font-semibold group-hover:underline">
          {nextStep.label}
        </p>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {nextStep.description}
        </p>
      </Link>

      {/* Modulok navigáció */}
      <AppPanelList label="Modulok">
        <AppListItem
          href="/garage"
          icon="🛴"
          title="Garázs"
          description="Rollereid adatlapja és km-állása."
          meta={`${stats.scooterCount} roller`}
        />
        <AppListItem
          href="/service"
          icon="🔧"
          title="Szervizkönyv"
          description="Javítások, cserék és ellenőrzések."
          meta={
            stats.serviceCount > 0
              ? `${stats.serviceCount} bejegyzés · ${stats.totalServiceCost.toLocaleString("hu-HU")} Ft`
              : "Még nincs bejegyzés"
          }
        />
        <AppListItem
          href="/rides"
          icon="🛣️"
          title="Menetnapló"
          description="Táv, idő és sebesség."
          meta={
            stats.rideCount > 0
              ? `${stats.rideCount} menet · ${stats.totalRideKm.toLocaleString("hu-HU")} km`
              : "Még nincs menet"
          }
        />
        <AppListItem
          href="/value"
          icon="📊"
          title="Értékbecslés"
          description="Tájékoztató érték vételár és km-állás alapján."
          meta={
            stats.totalValue > 0
              ? `~${stats.totalValue.toLocaleString("hu-HU")} Ft`
              : undefined
          }
        />
        <AppListItem
          href="/knowledge"
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
