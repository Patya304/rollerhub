import Link from "next/link";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { SERVICE_TYPE_LABELS } from "@/modules/services/service-types";
import type { SaleReportDto } from "@/modules/sale-report/dto";

// Az egyetlen presentational komponens, amit a tulajdonosi előnézet és a
// publikus /report/[token] oldal is használ, ugyanabból a safe DTO-ból.
// Soha nem jelenhet meg: email, user id, alvázszám, vételár, vásárlás
// dátuma, megjegyzés, értéktörténet, értékmegőrzési százalék, szerviz
// költség/megjegyzés, ride adat.

// Explicit Europe/Budapest időzóna: a "Frissítve" dátum és a
// szervizdátumok is ugyanazt a naptári napot mutassák, függetlenül a
// szerver saját időzónájától vagy a kliens böngészőjétől.
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("hu-HU", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SaleReportView({
  report,
  variant = "public",
}: {
  report: SaleReportDto;
  variant?: "public" | "preview";
}) {
  const specFields = [
    report.year != null
      ? { label: "Évjárat", value: String(report.year) }
      : null,
    report.color ? { label: "Szín", value: report.color } : null,
    report.batteryCapacity != null
      ? { label: "Akku", value: `${report.batteryCapacity} Wh` }
      : null,
    report.topSpeed != null
      ? { label: "Végsebesség", value: `${report.topSpeed} km/h` }
      : null,
    report.rangeKm != null
      ? { label: "Hatótáv", value: `${report.rangeKm} km` }
      : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <div className="space-y-4">
      {variant === "preview" && (
        <div className="border-primary/30 bg-primary/5 rounded-lg border px-4 py-2.5 text-center">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            Előnézet – ezt fogja látni a vevő
          </p>
        </div>
      )}

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Eladási állapotlap
          </p>
          <div className="mt-2 flex items-center gap-3">
            <ImageWithFallback
              src={report.photoUrl}
              alt={`${report.brand} ${report.model}`}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
              fallback={
                <div className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl">
                  🛴
                </div>
              }
            />
            <div className="min-w-0">
              <p className="font-bold break-words">
                {report.brand} {report.model}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Frissítve: {formatDate(report.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* Fő adatok */}
          <div className="divide-border/30 grid grid-cols-2 divide-x rounded-lg border">
            <div className="px-4 py-3">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Km-állás
              </p>
              <p className="mt-1 font-mono text-base font-bold tabular-nums">
                {report.currentMileage.toLocaleString("hu-HU")}
              </p>
            </div>
            <div className="px-4 py-3">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Szerviz
              </p>
              <p className="mt-1 font-mono text-base font-bold tabular-nums">
                {report.serviceCount}
              </p>
            </div>
          </div>

          {specFields.length > 0 && (
            <dl className="space-y-0">
              {specFields.map((f) => (
                <div
                  key={f.label}
                  className="border-border/30 flex items-center justify-between gap-4 border-b py-2 text-sm last:border-b-0"
                >
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="font-mono font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Érték */}
          {report.estimatedValue != null && (
            <div className="border-primary/20 bg-primary/5 rounded-xl border px-5 py-4">
              <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
                Becsült érték
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tabular-nums">
                {report.estimatedValue.toLocaleString("hu-HU")}
                <span className="text-muted-foreground ml-1.5 text-sm font-normal">
                  Ft
                </span>
              </p>
              <p className="text-muted-foreground mt-1.5 text-xs">
                Tájékoztató becslés a rögzített adatok alapján. A tényleges
                eladási ár eltérhet.
              </p>
            </div>
          )}

          {/* Szervizösszefoglaló */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                Szervizelőzmények
              </p>
              {report.serviceCount > 0 && (
                <span className="text-muted-foreground font-mono text-xs tabular-nums">
                  {report.serviceCount} alkalom
                </span>
              )}
            </div>
            {report.services.length > 0 ? (
              <div className="divide-border/30 divide-y rounded-lg border">
                {report.services.map((s, index) => (
                  <div
                    key={`${s.performedAt}-${s.type}-${s.odometerKm ?? "n"}-${index}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                  >
                    <span className="min-w-0 font-medium break-words">
                      {SERVICE_TYPE_LABELS[s.type]}
                    </span>
                    <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                      {formatDate(s.performedAt)}
                      {s.odometerKm != null
                        ? ` · ${s.odometerKm.toLocaleString("hu-HU")} km`
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Még nincs rögzített szervizelőzmény.
              </p>
            )}
          </div>

          {/* Tulajdonos — csak publikus profilnál jelenik meg */}
          {report.owner && (
            <Link
              href={`/profile/@${report.owner.username}`}
              className="bg-muted/30 hover:bg-muted/50 flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
            >
              <ImageWithFallback
                src={report.owner.image}
                alt={report.owner.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                fallback={
                  <span className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {report.owner.name.charAt(0).toUpperCase()}
                  </span>
                }
              />
              <span className="min-w-0 flex-1">
                <span className="text-muted-foreground block text-xs font-semibold tracking-widest uppercase">
                  Tulajdonos
                </span>
                <span className="mt-0.5 block truncate font-semibold">
                  {report.owner.name}
                </span>
              </span>
              <span className="text-muted-foreground shrink-0 text-sm">
                @{report.owner.username} →
              </span>
            </Link>
          )}

          <p className="text-muted-foreground border-border/40 border-t pt-4 text-xs leading-relaxed">
            Az állapotlap a tulajdonos által rögzített adatokból készül. Nem
            helyettesíti a személyes átvizsgálást.
          </p>
        </div>
      </div>
    </div>
  );
}
