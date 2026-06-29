import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    {
      label: "Vételár megadva",
      ok: purchasePrice != null,
    },
    {
      label: "Futásteljesítmény megadva",
      ok: true,
    },
    {
      label: "Becsült érték elérhető",
      ok: lastEstimatedValue != null,
    },
    {
      label: "Fotó hozzáadva",
      ok: !!photoUrl,
    },
    {
      label: "Legalább 1 szerviz rögzítve",
      ok: serviceCount > 0,
    },
    {
      label: "Legalább 1 menet rögzítve",
      ok: rideCount > 0,
    },
  ];

  const tip = !photoUrl
    ? "Adj hozzá fotót — hirdetésnél ez az egyik legfontosabb bizalmi elem."
    : serviceCount === 0
      ? "Rögzíts legalább egy szervizt, hogy hitelesebb legyen az állapotlap."
      : lastEstimatedValue == null
        ? "Futtass értékbecslést a roller adatlapján, hogy az ársáv is megjelenjen."
        : "Az állapotlapod jó alap egy eladási PDF-hez — ez Premium funkcióként érkezik.";

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
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle>Értékriport előnézet</CardTitle>
          <span className="rounded-full border px-2 py-0.5 text-xs">
            Premium · Hamarosan
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Add el profibban a rolleredet egy rendezett állapotlappal.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="text-right font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>

        {priceLow != null && priceHigh != null && (
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">
              Ajánlott hirdetési ársáv
            </p>
            <p className="mt-1 text-base font-semibold">
              kb. {priceLow.toLocaleString("hu-HU")} –{" "}
              {priceHigh.toLocaleString("hu-HU")} Ft
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Állapotlap teljessége
          </p>
          <ul className="space-y-1">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                <span
                  className={
                    item.ok ? "text-green-600" : "text-muted-foreground"
                  }
                >
                  {item.ok ? "✓" : "○"}
                </span>
                <span className={item.ok ? "" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground pt-1 text-xs italic">{tip}</p>
        </div>

        <div className="space-y-3 border-t pt-4">
          <p className="text-muted-foreground text-xs">
            A Premium állapotlap összefoglalja a roller dokumentált előzményeit
            — szervizek, futásteljesítmény, becsült érték — egy megosztható,
            rendezett formában. Vevők számára meggyőzőbb, te pedig többet kapsz
            a rollerért.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              disabled
              className="text-muted-foreground cursor-not-allowed rounded-md border px-4 py-2 text-sm opacity-50"
            >
              Állapotlap generálása — hamarosan
            </button>
            <Link
              href="/pricing"
              className="text-sm underline underline-offset-4"
            >
              Megnézem a Premium csomagot
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
