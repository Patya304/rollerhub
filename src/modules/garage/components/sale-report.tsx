import Link from "next/link";

// Vevőközpontú eladási állapotlap előnézet. Presentational: csak propsból
// dolgozik, a roller adatlap és a publikus /sample-report ugyanezt használja.

export type SaleReportService = {
  label: string;
  performedAt: string;
  odometerKm: number | null;
};

type SaleReportProps = {
  brand: string;
  model: string;
  year: number | null;
  photoUrl: string | null;
  currentMileage: number;
  purchasePrice: number | null;
  lastEstimatedValue: number | null;
  /** Legutóbbi szervizek, legfeljebb 3. */
  services: SaleReportService[];
  serviceCount: number;
  rideCount: number;
};

function roundToThousand(n: number): number {
  return Math.round(n / 1000) * 1000;
}

export function SaleReport({
  brand,
  model,
  year,
  photoUrl,
  currentMileage,
  purchasePrice,
  lastEstimatedValue,
  services,
  serviceCount,
  rideCount,
}: SaleReportProps) {
  const valueRetention =
    purchasePrice && lastEstimatedValue
      ? Math.round((lastEstimatedValue / purchasePrice) * 100)
      : null;

  const priceLow = lastEstimatedValue
    ? roundToThousand(lastEstimatedValue * 0.9)
    : null;
  const priceHigh = lastEstimatedValue
    ? roundToThousand(lastEstimatedValue * 1.1)
    : null;

  const checklist = [
    { label: "Vételár", ok: purchasePrice != null },
    { label: "Km-állás", ok: true },
    { label: "Becsült érték", ok: lastEstimatedValue != null },
    { label: "Fotó", ok: !!photoUrl },
    { label: "Szervizelőzmény", ok: serviceCount > 0 },
    { label: "Menetnapló", ok: rideCount > 0 },
  ];
  const okCount = checklist.filter((c) => c.ok).length;

  const tip = !photoUrl
    ? "Adj hozzá fotót. Hirdetésnél ez az egyik legfontosabb elem."
    : serviceCount === 0
      ? "Rögzíts legalább egy szervizt, ez teszi hitelessé az előéletet."
      : lastEstimatedValue == null
        ? "Indíts értékbecslést az ajánlott ársávhoz."
        : "Az állapotlap használható alap. A PDF export később érkezik.";

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      {/* Fejléc: mi ez a dokumentum, melyik rollerről szól */}
      <div className="border-border/50 border-b px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Eladási állapotlap
          </p>
          <span className="border-primary/30 text-primary rounded-full border px-2.5 py-0.5 text-xs font-medium">
            Premium
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={`${brand} ${model}`}
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl">
              🛴
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-bold">
              {brand} {model}
            </p>
            <p className="text-muted-foreground font-mono text-xs tabular-nums">
              {year != null ? `${year} · ` : ""}
              {currentMileage.toLocaleString("hu-HU")} km
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Fő érték: becsült eladási ár + ársáv */}
        {lastEstimatedValue != null ? (
          <div className="border-primary/20 bg-primary/5 rounded-xl border px-5 py-4">
            <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
              Becsült eladási ár
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight tabular-nums">
              {lastEstimatedValue.toLocaleString("hu-HU")}
              <span className="text-muted-foreground ml-1.5 text-base font-normal">
                Ft
              </span>
            </p>
            {priceLow != null && priceHigh != null && (
              <p className="text-muted-foreground mt-1.5 font-mono text-sm tabular-nums">
                Ajánlott ársáv: {priceLow.toLocaleString("hu-HU")} –{" "}
                {priceHigh.toLocaleString("hu-HU")} Ft
              </p>
            )}
            {valueRetention != null && (
              <p className="text-muted-foreground mt-0.5 text-xs">
                A vételár {valueRetention}%-át őrzi.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed px-5 py-4">
            <p className="text-sm font-medium">Még nincs becsült ár</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Add meg a vételárat, és indíts értékbecslést.
            </p>
          </div>
        )}

        {/* Szervizelőzmények */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
              Szervizelőzmények
            </p>
            {serviceCount > 0 && (
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {serviceCount} alkalom
              </span>
            )}
          </div>
          {services.length > 0 ? (
            <div className="divide-border/30 divide-y rounded-lg border">
              {services.map((s) => (
                <div
                  key={`${s.label}-${s.performedAt}`}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="text-muted-foreground font-mono text-xs tabular-nums">
                    {new Date(s.performedAt).toLocaleDateString("hu-HU")}
                    {s.odometerKm != null
                      ? ` · ${s.odometerKm.toLocaleString("hu-HU")} km`
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Még nincs rögzített szerviz.
            </p>
          )}
          {rideCount > 0 && (
            <p className="text-muted-foreground mt-2 text-xs">
              Menetnapló: {rideCount} rögzített menet.
            </p>
          )}
        </div>

        {/* Rögzített adatok */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
              Rögzített adatok
            </p>
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {okCount}/{checklist.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {checklist.map((item) => (
              <span
                key={item.label}
                className={
                  item.ok
                    ? "rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600"
                    : "bg-muted/60 text-muted-foreground rounded-full px-2.5 py-1 text-xs"
                }
              >
                {item.ok ? "✓ " : ""}
                {item.label}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground mt-2.5 text-xs">{tip}</p>
        </div>

        {/* Egyetlen továbblépés */}
        <div className="border-border/40 border-t pt-4">
          <Link
            href="/pricing"
            className="text-primary text-sm font-medium hover:underline"
          >
            Premium csomagok →
          </Link>
        </div>
      </div>
    </div>
  );
}
