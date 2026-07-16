import Link from "next/link";

type SaleReportProps = {
  purchasePrice: number | null;
  lastEstimatedValue: number | null;
  serviceCount: number;
  rideCount: number;
  photoUrl: string | null;
};

function roundToThousand(n: number): number {
  return Math.round(n / 1000) * 1000;
}

export function SaleReport({
  purchasePrice,
  lastEstimatedValue,
  serviceCount,
  rideCount,
  photoUrl,
}: SaleReportProps) {
  const priceLow = lastEstimatedValue
    ? roundToThousand(lastEstimatedValue * 0.9)
    : null;
  const priceHigh = lastEstimatedValue
    ? roundToThousand(lastEstimatedValue * 1.1)
    : null;

  const checklist = [
    { label: "Vételár megadva", ok: purchasePrice != null },
    { label: "Futásteljesítmény megadva", ok: true },
    { label: "Becsült érték elérhető", ok: lastEstimatedValue != null },
    { label: "Fotó hozzáadva", ok: !!photoUrl },
    { label: "Legalább 1 szerviz rögzítve", ok: serviceCount > 0 },
    { label: "Legalább 1 menet rögzítve", ok: rideCount > 0 },
  ];

  const okCount = checklist.filter((c) => c.ok).length;

  const tip = !photoUrl
    ? "Adj hozzá fotót. Hirdetésnél ez az egyik legfontosabb elem."
    : serviceCount === 0
      ? "Rögzíts legalább egy szervizt, hogy hitelesebb legyen az állapotlap."
      : lastEstimatedValue == null
        ? "Indíts értékbecslést az ajánlott ársávhoz."
        : "Az állapotlap használható alap. A PDF export később érkezik.";

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      {/* Header */}
      <div className="border-border/50 flex flex-wrap items-start justify-between gap-2 border-b px-5 py-4">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Értékriport
          </p>
          <p className="mt-0.5 font-bold">Állapotlap eladáshoz</p>
        </div>
        <span className="border-primary/30 text-primary rounded-full border px-2.5 py-0.5 text-xs font-medium">
          Premium
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Ársáv callout */}
        {priceLow != null && priceHigh != null && (
          <div className="border-primary/20 bg-primary/5 rounded-xl border px-5 py-4">
            <p className="text-primary mb-1 text-xs font-semibold tracking-[0.15em] uppercase">
              Ajánlott hirdetési ársáv
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight tabular-nums">
              {priceLow.toLocaleString("hu-HU")}
              <span className="text-muted-foreground mx-2 text-lg font-normal">
                –
              </span>
              {priceHigh.toLocaleString("hu-HU")}
              <span className="text-muted-foreground ml-1.5 text-base font-normal">
                Ft
              </span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              A becsült piaci érték ±10%-a alapján
            </p>
          </div>
        )}

        {/* Állapotlap teljessége */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
              Állapotlap teljessége
            </p>
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {okCount}/{checklist.length}
            </span>
          </div>
          <div className="bg-card divide-border/30 divide-y overflow-hidden rounded-lg border">
            {checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
              >
                <span className={item.ok ? "" : "text-muted-foreground"}>
                  {item.label}
                </span>
                <span
                  className={
                    item.ok
                      ? "rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600"
                      : "bg-muted/60 text-muted-foreground rounded px-2 py-0.5 text-xs"
                  }
                >
                  {item.ok ? "OK" : "Hiányzik"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-2.5 text-xs italic">{tip}</p>
        </div>

        {/* Premium CTA */}
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
