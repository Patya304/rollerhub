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
import { AppSection, AppPanelList, AppListItem } from "@/components/app-page";

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
      label: "Km óra állás",
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
      <Link
        href="/garage"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        ← Garázs
      </Link>

      {/* Vehicle hero */}
      <div className="bg-card overflow-hidden rounded-xl border">
        {/* Top: foto + azonosítás */}
        <div className="flex items-start gap-4 p-5 pb-4">
          {scooter.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={scooter.photoUrl}
              alt={`${scooter.brand} ${scooter.model}`}
              className="h-24 w-24 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center rounded-xl text-4xl">
              🛴
            </div>
          )}
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
              {scooter.brand}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight">
              {scooter.model}
            </h1>
            {scooter.year && (
              <p className="text-muted-foreground text-sm">{scooter.year}</p>
            )}
          </div>
        </div>

        {/* Stat badge sor */}
        <div className="border-border/50 grid grid-cols-3 gap-2 border-t px-5 py-4">
          <div className="bg-muted/40 rounded-lg px-3 py-2.5">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Km
            </p>
            <p className="mt-1 font-mono text-base font-bold tabular-nums">
              {scooter.currentMileage.toLocaleString("hu-HU")}
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2.5">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Szerviz
            </p>
            <p className="mt-1 font-mono text-base font-bold tabular-nums">
              {scooter._count.services}
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2.5">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Menetek
            </p>
            <p className="mt-1 font-mono text-base font-bold tabular-nums">
              {scooter._count.rides}
            </p>
          </div>
        </div>

        {/* Érték badge, ha van */}
        {lastEstimate && (
          <div className="border-border/50 border-t px-5 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-muted-foreground text-xs">
                Becsült piaci érték
              </p>
              <p className="border-primary/30 bg-primary/10 text-primary rounded-lg px-3 py-1 font-mono text-sm font-bold tabular-nums">
                ~{lastEstimate.estimatedValue.toLocaleString("hu-HU")} Ft
              </p>
            </div>
          </div>
        )}
      </div>

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
          description="Vételár, becsült jelenlegi érték."
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
          description="Eladási állapotlap előnézet."
          eyebrow="Premium"
        />
        <AppListItem
          href="#ertektortenet"
          icon="📈"
          title="Értéktörténet"
          description="Becsült érték időbeli alakulása."
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
        <dl className="space-y-0">
          {techFields.map((f) => (
            <div
              key={f.label}
              className="border-border/30 flex items-center justify-between gap-4 border-b py-2.5 text-sm last:border-b-0"
            >
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="font-mono font-semibold tabular-nums">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </AppSection>

      {/* Vásárlás és érték */}
      <AppSection label="Vásárlás és érték" id="ertek">
        <dl className="space-y-0">
          {valueFields.map((f) => (
            <div
              key={f.label}
              className="border-border/30 flex items-center justify-between gap-4 border-b py-2.5 text-sm last:border-b-0"
            >
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="font-mono font-semibold tabular-nums">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
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
