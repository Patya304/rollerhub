import { AppPage, AppPageHeader } from "@/components/app-page";
import { GarageVehicleListItem } from "@/components/garage-vehicle-list-item";
import { DEMO_SCOOTERS } from "@/modules/preview/demo-data";

export default function PreviewGaragePage() {
  return (
    <AppPage>
      <AppPageHeader
        eyebrow="02 · Garázs"
        title="Garázs"
        description="Rollereid adatlapja és km-állása."
      />

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

      {/* Demo: új roller gomb */}
      <div>
        <button
          disabled
          className="text-muted-foreground cursor-not-allowed rounded-lg border px-4 py-2 text-sm opacity-50"
        >
          + Új roller hozzáadása
        </button>
        <p className="text-muted-foreground mt-1.5 text-xs">
          Demóban nem adható hozzá új roller.
        </p>
      </div>
    </AppPage>
  );
}
