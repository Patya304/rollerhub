import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getScooterDetails } from "@/modules/garage/services/scooter-service";
import { getValueHistory } from "@/modules/value/services/value-service";
import { ScooterActions } from "@/modules/garage/components/scooter-actions";
import {
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "@/modules/services/service-types";
import { ServiceLog } from "@/modules/services/components/service-log";
import { ValueHistory } from "@/modules/value/components/value-history";
import { SaleReport } from "@/modules/garage/components/sale-report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ScooterDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { id } = await params;
  const scooter = await getScooterDetails(session.user.id, id);
  if (!scooter) notFound();

  const valueHistory = (await getValueHistory(session.user.id, id)) ?? [];

  const lastService = scooter.services[0] ?? null;
  const lastEstimate = scooter.valueEstimates[0] ?? null;

  const fields = [
    { label: "Márka", value: scooter.brand },
    { label: "Modell", value: scooter.model },
    {
      label: "Évjárat",
      value: scooter.year != null ? String(scooter.year) : "–",
    },
    { label: "Szín", value: scooter.color ?? "–" },
    { label: "Alvázszám", value: scooter.serialNumber ?? "–" },
    {
      label: "Km óra állás",
      value: `${scooter.currentMileage.toLocaleString("hu-HU")} km`,
    },
    {
      label: "Vételár",
      value:
        scooter.purchasePrice != null
          ? `${scooter.purchasePrice.toLocaleString("hu-HU")} Ft`
          : "–",
    },
    {
      label: "Vásárlás dátuma",
      value: scooter.purchaseDate
        ? new Date(scooter.purchaseDate).toLocaleDateString("hu-HU")
        : "–",
    },
    {
      label: "Akku kapacitás",
      value:
        scooter.batteryCapacity != null ? `${scooter.batteryCapacity} Wh` : "–",
    },
    {
      label: "Végsebesség",
      value: scooter.topSpeed != null ? `${scooter.topSpeed} km/h` : "–",
    },
    {
      label: "Hatótáv",
      value: scooter.rangeKm != null ? `${scooter.rangeKm} km` : "–",
    },
  ];

  return (
    <div className="space-y-4">
      <Link
        href="/garage"
        className="text-muted-foreground text-sm hover:underline"
      >
        ← Vissza a Garázsba
      </Link>

      <div className="flex items-center gap-4">
        {scooter.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={scooter.photoUrl}
            alt={`${scooter.brand} ${scooter.model}`}
            className="h-20 w-20 rounded-lg object-cover"
          />
        )}
        <h1 className="text-2xl font-semibold">
          {scooter.brand} {scooter.model}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Műveletek</CardTitle>
        </CardHeader>
        <CardContent>
          <ScooterActions
            scooter={{
              id: scooter.id,
              brand: scooter.brand,
              model: scooter.model,
              color: scooter.color,
              serialNumber: scooter.serialNumber,
              year: scooter.year,
              currentMileage: scooter.currentMileage,
              purchasePrice: scooter.purchasePrice,
              purchaseDate: scooter.purchaseDate
                ? scooter.purchaseDate.toISOString().slice(0, 10)
                : null,
              batteryCapacity: scooter.batteryCapacity,
              topSpeed: scooter.topSpeed,
              rangeKm: scooter.rangeKm,
              photoUrl: scooter.photoUrl,
              notes: scooter.notes,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adatok</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className="text-right font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Áttekintés</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Utolsó becsült érték</dt>
              <dd className="text-right font-medium">
                {lastEstimate
                  ? `${lastEstimate.estimatedValue.toLocaleString("hu-HU")} Ft`
                  : "–"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Szervizek száma</dt>
              <dd className="text-right font-medium">
                {scooter._count.services}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Utolsó szerviz</dt>
              <dd className="text-right font-medium">
                {lastService
                  ? `${SERVICE_TYPE_LABELS[lastService.type as ServiceType]} · ${new Date(
                      lastService.performedAt,
                    ).toLocaleDateString("hu-HU")}`
                  : "–"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Menetek száma</dt>
              <dd className="text-right font-medium">{scooter._count.rides}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Szervizkönyv</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceLog scooterId={scooter.id} />
        </CardContent>
      </Card>

      <SaleReport
        brand={scooter.brand}
        model={scooter.model}
        year={scooter.year}
        currentMileage={scooter.currentMileage}
        purchasePrice={scooter.purchasePrice}
        lastEstimatedValue={lastEstimate?.estimatedValue ?? null}
        serviceCount={scooter._count.services}
        lastServiceType={lastService ? (lastService.type as ServiceType) : null}
        lastServiceDate={lastService ? lastService.performedAt : null}
        rideCount={scooter._count.rides}
      />

      <Card>
        <CardHeader>
          <CardTitle>Értéktörténet</CardTitle>
        </CardHeader>
        <CardContent>
          <ValueHistory history={valueHistory} />
        </CardContent>
      </Card>
    </div>
  );
}
