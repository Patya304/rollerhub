import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getScooterDetails } from "@/modules/garage/services/scooter-service";
import { getValueHistory } from "@/modules/value/services/value-service";
import { ScooterActions } from "@/modules/garage/components/scooter-actions";
import { type ServiceType } from "@/modules/services/service-types";
import { ServiceLog } from "@/modules/services/components/service-log";
import { ValueHistory } from "@/modules/value/components/value-history";
import { SaleReport } from "@/modules/garage/components/sale-report";
import {
  AppSection,
  AppPanelList,
  AppListItem,
  FieldList,
} from "@/components/app-page";
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

  const lastService = scooter.services[0] ?? null;
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

      {/* Jármű modulok — gyors navigáció az oldalon belüli szekciókhoz */}
      <AppPanelList label="Jármű adatlap">
        <AppListItem
          href="#muszaki"
          icon="⚙️"
          title="Műszaki adatok"
          description="Km-állás, akku, sebesség, hatótáv."
        />
        <AppListItem
          href="#ertek"
          icon="💰"
          title="Vásárlás és érték"
          description="Vételár és becsült érték."
        />
        <AppListItem
          href="#szerviz"
          icon="🔧"
          title="Szervizkönyv"
          description={
            scooter._count.services > 0
              ? `${scooter._count.services} bejegyzés`
              : "Még nincs szerviz rögzítve."
          }
        />
        <AppListItem
          href="#ertekjelentes"
          icon="📋"
          title="Értékriport"
          description="Állapotlap előnézet."
          eyebrow="Premium"
        />
        <AppListItem
          href="#ertektortenet"
          icon="📈"
          title="Értéktörténet"
          description="Korábbi becslések."
        />
      </AppPanelList>

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
          currentMileage={scooter.currentMileage}
          purchasePrice={scooter.purchasePrice}
          lastEstimatedValue={lastEstimate?.estimatedValue ?? null}
          serviceCount={scooter._count.services}
          lastServiceType={
            lastService ? (lastService.type as ServiceType) : null
          }
          lastServiceDate={lastService ? lastService.performedAt : null}
          rideCount={scooter._count.rides}
          photoUrl={scooter.photoUrl}
        />
      </div>

      {/* Értéktörténet */}
      <AppSection label="Értéktörténet" id="ertektortenet">
        <ValueHistory history={valueHistory} />
      </AppSection>
    </div>
  );
}
