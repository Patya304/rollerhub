import { AppPage, AppPageHeader } from "@/components/app-page";
import { GarageVehicleListItem } from "@/components/garage-vehicle-list-item";
import { ScooterAddWizard } from "@/components/scooter-add-wizard";
import { DEMO_SCOOTERS } from "@/modules/preview/demo-data";

export default function PreviewGaragePage() {
  return (
    <AppPage>
      <AppPageHeader title="Garázs" />

      <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
        <GarageVehicleListItem
          marker={DEMO_SCOOTERS[0].marker}
          title={`${DEMO_SCOOTERS[0].brand} ${DEMO_SCOOTERS[0].model}`}
          meta={`${DEMO_SCOOTERS[0].year} · ${DEMO_SCOOTERS[0].currentMileage.toLocaleString("hu-HU")} km · ~${DEMO_SCOOTERS[0].estimate.toLocaleString("hu-HU")} Ft`}
          href="/preview/app/garage/demo-ruptor"
        />
        <GarageVehicleListItem
          marker={DEMO_SCOOTERS[1].marker}
          title={`${DEMO_SCOOTERS[1].brand} ${DEMO_SCOOTERS[1].model}`}
          meta={`${DEMO_SCOOTERS[1].year} · ${DEMO_SCOOTERS[1].currentMileage.toLocaleString("hu-HU")} km · ~${DEMO_SCOOTERS[1].estimate.toLocaleString("hu-HU")} Ft`}
          disabled
          disabledLabel="Demó: nincs adatlap"
        />
      </div>

      {/* Demó: az új roller hozzáadása flow végigkattintható, mentés nélkül */}
      <div className="space-y-1.5">
        <ScooterAddWizard demo />
        <p className="text-muted-foreground text-xs">
          Demóban végigkattinthatod a lépéseket, de menteni nem lehet.
        </p>
      </div>
    </AppPage>
  );
}
