import Link from "next/link";
import {
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "@/modules/services/service-types";

type SaleReportProps = {
  brand: string;
  model: string;
  year: number | null;
  currentMileage: number;
  purchasePrice: number | null;
  lastEstimatedValue: number | null;
  serviceCount: number;
  lastServiceType: ServiceType | null;
  lastServiceDate: Date | null;
  rideCount: number;
  photoUrl: string | null;
};

function roundToThousand(n: number): number {
  return Math.round(n / 1000) * 1000;
}

export function SaleReport({
  brand,
  model,
  year,
  currentMileage,
  purchasePrice,
  lastEstimatedValue,
  serviceCount,
  lastServiceType,
  lastServiceDate,
  rideCount,
  photoUrl,
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
    { label: "Vételár megadva", ok: purchasePrice != null },
    { label: "Futásteljesítmény megadva", ok: true },
    { label: "Becsült érték elérhető", ok: lastEstimatedValue != null },
    { label: "Fotó hozzáadva", ok: !!photoUrl },
    { label: "Legalább 1 szerviz rögzítve", ok: serviceCount > 0 },
    { label: "Legalább 1 menet rögzítve", ok: rideCount > 0 },
  ];

  const okCount = checklist.filter((c) => c.ok).length;

  const tip = !photoUrl
    ? "Adj hozzá fotót — hirdetésnél ez az egyik legfontosabb bizalmi elem."
    : serviceCount === 0
      ? "Rögzíts legalább egy szervizt, hogy hitelesebb legyen az állapotlap."
      : lastEstimatedValue == null
        ? "Futtass értékbecslést, hogy az ajánlott ársáv is megjelenjen."
        : "Az állapotlapod jó alap — a teljes PDF export Premium funkcióként érkezik.";

  const rows: { label: string; value: string }[] = [
    {
      label: "Roller",
      value: year ? `${brand} ${model} (${year})` : `${brand} ${model}`,
    },
    {
      label: "Futásteljesítmény",
      value: `${currentMileage.toLocaleString("hu-HU")} km`,
    },
    {
      label: "Vételár",
      value: purchasePrice
        ? `${purchasePrice.toLocaleString("hu-HU")} Ft`
        : "–",
    },
    {
      label: "Becsült jelenlegi érték",
      value: lastEstimatedValue
        ? `${lastEstimatedValue.toLocaleString("hu-HU")} Ft`
        : "–",
    },
    {
      label: "Értékmegőrzés",
      value: valueRetention != null ? `${valueRetention}%` : "–",
    },
    {
      label: "Dokumentált szervizek",
      value: `${serviceCount} alkalom`,
    },
    {
      label: "Utolsó szerviz",
      value:
        lastServiceType && lastServiceDate
          ? `${SERVICE_TYPE_LABELS[lastServiceType]} · ${new Date(lastServiceDate).toLocaleDateString("hu-HU")}`
          : "–",
    },
    {
      label: "Naplózott menetek",
      value: `${rideCount} menet`,
    },
  ];

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      {/* Header */}
      <div className="border-border/50 flex flex-wrap items-start justify-between gap-2 border-b px-5 py-4">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Értékriport
          </p>
          <p className="mt-0.5 font-bold">Értékriport előnézet</p>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Add el profibban a rolleredet egy rendezett állapotlappal.
          </p>
        </div>
        <span className="border-primary/30 text-primary rounded-full border px-2.5 py-0.5 text-xs font-medium">
          Premium · Hamarosan
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Adatsorok */}
        <dl className="divide-border/30 divide-y">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-4 py-2 text-sm"
            >
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="font-mono font-semibold tabular-nums">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

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
          <p className="text-muted-foreground text-xs leading-relaxed">
            A Premium állapotlap összefoglalja a dokumentált előzményeket —
            szervizek, futásteljesítmény, becsült érték — egy megosztható
            formában.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              disabled
              className="text-muted-foreground cursor-not-allowed rounded-lg border px-4 py-2 text-sm opacity-40"
            >
              Állapotlap generálása — hamarosan
            </button>
            <Link
              href="/pricing"
              className="text-primary text-sm font-medium hover:underline"
            >
              Premium csomagok →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
