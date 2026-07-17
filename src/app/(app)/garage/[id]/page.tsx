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
import { AppSection, FieldList } from "@/components/app-page";
import { VehicleHero } from "@/components/vehicle-hero";

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

  const lastEstimate = scooter.valueEstimates[0] ?? null;

  const techFields = [
    {
      label: "Km-állás",
      value: `${scooter.currentMileage.toLocaleString("hu-HU")} km`,
    },
    {
      label: "Évjárat",
      value: scooter.year != null ? String(scooter.year) : "–",
    },
    {
      label: "Akku",
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
    {
      label: "Szín",
      value: scooter.color ?? "–",
    },
    {
      label: "Alvázszám",
      value: scooter.serialNumber ?? "–",
    },
  ];

  const valueRetention =
    scooter.purchasePrice != null && lastEstimate
      ? Math.round((lastEstimate.estimatedValue / scooter.purchasePrice) * 100)
      : null;

  const valueFields = [
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
      label: "Becsült érték",
      value: lastEstimate
        ? `${lastEstimate.estimatedValue.toLocaleString("hu-HU")} Ft`
        : "–",
    },
    {
      label: "Utolsó becslés",
      value: lastEstimate
        ? new Date(lastEstimate.createdAt).toLocaleDateString("hu-HU")
        : "–",
    },
    {
      label: "Értékmegőrzés",
      value: valueRetention != null ? `${valueRetention}%` : "–",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <VehicleHero
        brand={scooter.brand}
        model={scooter.model}
        year={scooter.year}
        currentMileage={scooter.currentMileage}
        serviceCount={scooter._count.services}
        rideCount={scooter._count.rides}
        estimatedValue={lastEstimate?.estimatedValue ?? null}
        photoUrl={scooter.photoUrl}
        backHref="/garage"
        backLabel="Garázs"
      />

      {/* Műveletek */}
      <AppSection label="Műveletek">
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
            isPublic: scooter.isPublic,
          }}
        />
      </AppSection>

      {/* Műszaki adatok */}
      <AppSection label="Műszaki adatok" id="muszaki">
        <FieldList fields={techFields} />
      </AppSection>

      {/* Vásárlás és érték */}
      <AppSection label="Vásárlás és érték" id="ertek">
        <FieldList fields={valueFields} />
      </AppSection>

      {/* Szervizkönyv */}
      <AppSection label="Szervizkönyv" id="szerviz">
        <ServiceLog scooterId={scooter.id} />
      </AppSection>

      {/* Értékriport */}
      <div id="ertekjelentes">
        <SaleReport
          brand={scooter.brand}
          model={scooter.model}
          year={scooter.year}
          photoUrl={scooter.photoUrl}
          currentMileage={scooter.currentMileage}
          purchasePrice={scooter.purchasePrice}
          lastEstimatedValue={lastEstimate?.estimatedValue ?? null}
          services={scooter.services.map((s) => ({
            label: SERVICE_TYPE_LABELS[s.type as ServiceType],
            performedAt: s.performedAt.toISOString(),
            odometerKm: s.odometerKm,
          }))}
          serviceCount={scooter._count.services}
          rideCount={scooter._count.rides}
        />
      </div>

      {/* Értéktörténet */}
      <AppSection label="Korábbi becslések" id="ertektortenet">
        <ValueHistory history={valueHistory} />
      </AppSection>
    </div>
  );
}
