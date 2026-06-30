import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/modules/dashboard/services/dashboard-service";
import { Button } from "@/components/ui/button";
import {
  AppPage,
  AppPageHeader,
  AppEmptyState,
  AppPanelList,
  AppListItem,
} from "@/components/app-page";

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
          description="Kövesd nyomon rollereid értékét, szervizeit és meneteit."
        />
        <AppEmptyState
          icon="🛴"
          title="A garázs üres"
          description="Add hozzá az első rolleredet — ezután ide gyűlik össze az összes adat."
          action={
            <Button asChild>
              <Link href="/garage">Roller hozzáadása</Link>
            </Button>
          }
        />
      </AppPage>
    );
  }

  return (
    <AppPage>
      <AppPageHeader eyebrow="01 · Műszerfal" title="Digitális garázs" />

      {/* Hero statisztika panel */}
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
              {stats.scooterCount}
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Összes km
            </p>
            <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
              {stats.totalKm.toLocaleString("hu-HU")}
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
              {stats.totalValue > 0
                ? `~${stats.totalValue.toLocaleString("hu-HU")}`
                : "–"}
              {stats.totalValue > 0 && (
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
              {stats.serviceCount}
            </p>
          </div>
        </div>
      </div>

      {/* Modulok navigáció */}
      <AppPanelList label="Modulok">
        <AppListItem
          href="/garage"
          icon="🛴"
          title="Garázs"
          description="Rollerjeid adatlapja és km-állása."
          meta={`${stats.scooterCount} roller`}
        />
        <AppListItem
          href="/service"
          icon="🔧"
          title="Szervizkönyv"
          description="Karbantartások, javítások, ellenőrzések."
          meta={
            stats.serviceCount > 0
              ? `${stats.serviceCount} bejegyzés · ${stats.totalServiceCost.toLocaleString("hu-HU")} Ft`
              : undefined
          }
        />
        <AppListItem
          href="/rides"
          icon="🛣️"
          title="Menetnapló"
          description="Kiszállások, megtett táv, sebesség."
          meta={
            stats.rideCount > 0
              ? `${stats.rideCount} menet · ${stats.totalKm.toLocaleString("hu-HU")} km`
              : undefined
          }
        />
        <AppListItem
          href="/value"
          icon="📊"
          title="Értékbecslés"
          description="Roller aktuális piaci értékének becslése."
        />
        <AppListItem
          href="/knowledge"
          icon="📖"
          title="Tudásközpont"
          description="KRESZ, biztosítás, jogosítvány, szabályok."
        />
      </AppPanelList>

      {/* Premium callout */}
      <div className="border-primary/20 bg-primary/5 rounded-xl border px-5 py-4">
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
