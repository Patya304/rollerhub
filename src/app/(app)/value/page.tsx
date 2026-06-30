import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getScootersByUser } from "@/modules/garage/services/scooter-service";
import { calculateEstimate } from "@/modules/value/utils/calculate-estimate";
import { AppPage, AppPageHeader, AppEmptyState } from "@/components/app-page";

export default async function ValuePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const scooters = await getScootersByUser(session.user.id);

  const rows = scooters.map((s) => {
    const estimate =
      s.purchasePrice != null
        ? calculateEstimate({
            purchasePrice: s.purchasePrice,
            year: s.year,
            currentMileage: s.currentMileage,
            purchaseDate: s.purchaseDate,
          })
        : null;
    const depreciation =
      s.purchasePrice != null && estimate != null
        ? s.purchasePrice - estimate
        : null;
    const retention =
      s.purchasePrice != null && estimate != null
        ? Math.round((estimate / s.purchasePrice) * 100)
        : null;
    return { scooter: s, estimate, depreciation, retention };
  });

  const totalPurchase = rows.reduce(
    (sum, r) => sum + (r.scooter.purchasePrice ?? 0),
    0,
  );
  const totalValue = rows.reduce((sum, r) => sum + (r.estimate ?? 0), 0);

  return (
    <AppPage>
      <AppPageHeader
        eyebrow="05 · Értékbecslés"
        title="Értékbecslés"
        description="Becsült piaci értékek vételár, évjárat és km-állás alapján."
      />

      {scooters.length === 0 ? (
        <AppEmptyState
          icon="📊"
          title="Nincs roller az értékbecsléshez"
          description="Adj hozzá egy rollert a Garázsban, add meg a vételárat — az érték automatikusan kiszámolódik."
          action={
            <Link
              href="/garage"
              className="text-primary text-sm font-medium hover:underline"
            >
              Garázs megnyitása →
            </Link>
          }
        />
      ) : (
        <>
          {/* Roller értékek */}
          <div className="bg-card overflow-hidden rounded-xl border">
            <div className="border-border/50 border-b px-5 py-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                Rollerek becsült értéke
              </p>
            </div>
            <div className="divide-border/30 divide-y">
              {rows.map(({ scooter, estimate, depreciation, retention }) => (
                <Link
                  key={scooter.id}
                  href={`/garage/${scooter.id}`}
                  className="hover:bg-muted/30 group flex items-start justify-between gap-4 px-5 py-4 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {scooter.brand} {scooter.model}
                    </p>
                    {scooter.year && (
                      <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                        {scooter.year} ·{" "}
                        {scooter.currentMileage.toLocaleString("hu-HU")} km
                      </p>
                    )}
                    {estimate == null && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        Adj meg vételárat a roller adatlapján.
                      </p>
                    )}
                  </div>
                  {estimate != null ? (
                    <div className="shrink-0 text-right">
                      <p className="font-mono font-bold tabular-nums">
                        ~{estimate.toLocaleString("hu-HU")} Ft
                      </p>
                      <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                        {retention}% · −{depreciation!.toLocaleString("hu-HU")}{" "}
                        Ft
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/30 shrink-0 text-sm">
                      →
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Összesítő */}
          {totalPurchase > 0 && (
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
                    {totalPurchase.toLocaleString("hu-HU")}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      Ft
                    </span>
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-muted-foreground text-xs tracking-widest uppercase">
                    Becsült jelenlegi érték
                  </p>
                  <p className="mt-1.5 font-mono text-xl leading-none font-bold tabular-nums">
                    ~{totalValue.toLocaleString("hu-HU")}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      Ft
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-muted-foreground px-1 text-xs">
            Az értékbecslés orientációs jellegű — vételár, km-állás és évjárat
            alapján számolódik. A tényleges piaci árra a roller adatlapján
            futtathatsz részletes becslést.
          </p>
        </>
      )}
    </AppPage>
  );
}
