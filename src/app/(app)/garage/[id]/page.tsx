import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
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

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="py-1 text-center">
      <p className="text-muted-foreground text-sm">{text}</p>
      <Link
        href="#roller-adatok"
        className="text-primary text-sm font-medium hover:underline"
      >
        Adatok szerkesztése →
      </Link>
    </div>
  );
}

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

  // Évjárat és km-állás már a heroban látszik, itt nem ismételjük.
  const techFields = [
    scooter.batteryCapacity != null
      ? { label: "Akku", value: `${scooter.batteryCapacity} Wh` }
      : null,
    scooter.topSpeed != null
      ? { label: "Végsebesség", value: `${scooter.topSpeed} km/h` }
      : null,
    scooter.rangeKm != null
      ? { label: "Hatótáv", value: `${scooter.rangeKm} km` }
      : null,
    scooter.color ? { label: "Szín", value: scooter.color } : null,
    scooter.serialNumber
      ? { label: "Alvázszám", value: scooter.serialNumber }
      : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  // Csak akkor számoljuk, ha van mivel osztani, és véges, értelmes % jön ki
  // (nulla vagy hiányzó vételárnál nincs NaN%/Infinity%).
  let valueRetention: number | null = null;
  if (
    lastEstimate &&
    scooter.purchasePrice != null &&
    scooter.purchasePrice > 0
  ) {
    const pct = Math.round(
      (lastEstimate.estimatedValue / scooter.purchasePrice) * 100,
    );
    if (Number.isFinite(pct)) valueRetention = pct;
  }

  // Becsült érték már a heroban látszik, itt nem ismételjük.
  const valueFields = [
    scooter.purchasePrice != null
      ? {
          label: "Vételár",
          value: `${scooter.purchasePrice.toLocaleString("hu-HU")} Ft`,
        }
      : null,
    scooter.purchaseDate
      ? {
          label: "Vásárlás dátuma",
          value: new Date(scooter.purchaseDate).toLocaleDateString("hu-HU"),
        }
      : null,
    lastEstimate
      ? {
          label: "Utolsó becslés",
          value: new Date(lastEstimate.createdAt).toLocaleDateString("hu-HU"),
        }
      : null,
    valueRetention != null
      ? { label: "Értékmegőrzés", value: `${valueRetention}%` }
      : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

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
        serviceCount={scooter._count.services}
        hasEstimate={lastEstimate != null}
      />

      {/* Műszaki adatok */}
      <AppSection label="Műszaki adatok" id="muszaki">
        {techFields.length > 0 ? (
          <FieldList fields={techFields} />
        ) : (
          <EmptyBlock text="Még nincs rögzítve akku, sebesség vagy egyéb műszaki adat." />
        )}
      </AppSection>

      {/* Vásárlás és érték */}
      <AppSection label="Vásárlás és érték" id="ertek">
        {valueFields.length > 0 ? (
          <FieldList fields={valueFields} />
        ) : (
          <EmptyBlock text="Még nincs rögzítve vételár vagy vásárlási adat." />
        )}
      </AppSection>

      {/* Megjegyzés — csak ha van */}
      {scooter.notes && (
        <AppSection label="Megjegyzés">
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {scooter.notes}
          </p>
        </AppSection>
      )}

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
