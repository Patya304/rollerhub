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
};

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
}: SaleReportProps) {
  const valueRetention =
    purchasePrice && lastEstimatedValue
      ? Math.round((lastEstimatedValue / purchasePrice) * 100)
      : null;

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
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="text-right font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-3 border-t pt-4">
          <p className="text-muted-foreground text-xs">
            A Premium állapotlap összefoglalja a roller dokumentált előzményeit
            — szervizek, futásteljesítmény, becsült érték — egy megosztható,
            rendezett formában. Vevők számára meggyőzőbb, te pedig többet kapsz
            a rollerért.
          </p>
          <button
            disabled
            className="text-muted-foreground cursor-not-allowed rounded-md border px-4 py-2 text-sm opacity-50"
          >
            Állapotlap generálása — hamarosan
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
