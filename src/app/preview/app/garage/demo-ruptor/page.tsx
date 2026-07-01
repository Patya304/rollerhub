import Link from "next/link";
import {
  AppPanelList,
  AppListItem,
  AppSection,
  FieldList,
} from "@/components/app-page";
import {
  DEMO_SCOOTERS,
  DEMO_SERVICES,
  DEMO_VALUE_HISTORY,
  DEMO_SALE_CHECKLIST,
} from "@/modules/preview/demo-data";

const scooter = DEMO_SCOOTERS[0];
const services = DEMO_SERVICES.filter((s) => s.scooterId === "demo-ruptor");
const lastService = services[services.length - 1];

const techFields = [
  {
    label: "Km óra állás",
    value: `${scooter.currentMileage.toLocaleString("hu-HU")} km`,
  },
  { label: "Évjárat", value: String(scooter.year) },
  { label: "Akku", value: `${scooter.batteryCapacity} Wh` },
  { label: "Végsebesség", value: `${scooter.topSpeed} km/h` },
  { label: "Hatótáv", value: `${scooter.rangeKm} km` },
  { label: "Szín", value: scooter.color },
  { label: "Alvázszám", value: scooter.serialNumber },
];

const valueFields = [
  {
    label: "Vételár",
    value: `${scooter.purchasePrice.toLocaleString("hu-HU")} Ft`,
  },
  { label: "Vásárlás dátuma", value: "2024. 03. 10." },
  {
    label: "Becsült érték",
    value: `${scooter.estimate.toLocaleString("hu-HU")} Ft`,
  },
  { label: "Utolsó becslés", value: "2026. 06. 28." },
];

const priceLow = Math.round((scooter.estimate * 0.9) / 1000) * 1000;
const priceHigh = Math.round((scooter.estimate * 1.1) / 1000) * 1000;
const okCount = DEMO_SALE_CHECKLIST.filter((c) => c.ok).length;

export default function PreviewScooterDetailPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Link
        href="/preview/app/garage"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        ← Garázs
      </Link>

      {/* Hero */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="flex items-start gap-4 p-5 pb-4">
          <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center rounded-xl text-4xl">
            🛴
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
              {scooter.brand}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight">
              {scooter.model}
            </h1>
            <p className="text-muted-foreground text-sm">{scooter.year}</p>
          </div>
        </div>
        <div className="border-border/50 divide-border/30 grid grid-cols-3 divide-x border-t">
          <div className="px-4 py-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Km
            </p>
            <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
              {scooter.currentMileage.toLocaleString("hu-HU")}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Szerviz
            </p>
            <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
              {scooter.serviceCount}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Menetek
            </p>
            <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
              {scooter.rideCount}
            </p>
          </div>
        </div>
        <div className="border-border/50 border-t px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">Becsült piaci érték</p>
            <p className="border-primary/30 bg-primary/10 text-primary rounded-lg px-3 py-1 font-mono text-sm font-bold tabular-nums">
              ~{scooter.estimate.toLocaleString("hu-HU")} Ft
            </p>
          </div>
        </div>
      </div>

      {/* Jármű navigáció */}
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
          description={`${scooter.serviceCount} bejegyzés`}
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
        <div className="space-y-4">
          <p className="text-muted-foreground text-xs">
            Futtass értékbecslést a vételár és km-állás alapján, vagy módosítsd
            a roller adatait.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              disabled
              className="text-muted-foreground cursor-not-allowed rounded-lg border px-4 py-2 text-sm opacity-50"
            >
              Értékbecslés futtatása
            </button>
            <button
              disabled
              className="text-muted-foreground cursor-not-allowed rounded-lg border px-4 py-2 text-sm opacity-50"
            >
              Adatok szerkesztése
            </button>
          </div>
          <p className="text-muted-foreground text-xs">
            Demo módban a műveletek nem elérhetők.
          </p>
        </div>
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
        <div className="divide-border/30 divide-y">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex items-start justify-between gap-3 py-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.type}</p>
                <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                  {new Date(s.performedAt).toLocaleDateString("hu-HU")}
                  {s.odometerKm
                    ? ` · ${s.odometerKm.toLocaleString("hu-HU")} km`
                    : ""}
                  {s.cost ? ` · ${s.cost.toLocaleString("hu-HU")} Ft` : ""}
                </p>
                {s.notes && (
                  <p className="text-muted-foreground mt-1 text-xs leading-snug">
                    {s.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="border-border/40 mt-3 border-t pt-3">
          <p className="text-muted-foreground text-xs">
            Demo módban nem adható hozzá szerviz.
          </p>
        </div>
      </AppSection>

      {/* Értékriport */}
      <div
        id="ertekjelentes"
        className="bg-card scroll-mt-20 overflow-hidden rounded-xl border"
      >
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
          {/* Ársáv */}
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
          {/* Checklist */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                Állapotlap teljessége
              </p>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {okCount}/{DEMO_SALE_CHECKLIST.length}
              </span>
            </div>
            <div className="bg-card divide-border/30 divide-y overflow-hidden rounded-lg border">
              {DEMO_SALE_CHECKLIST.map((item) => (
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
          </div>
          <div className="border-border/40 border-t pt-4">
            <button
              disabled
              className="text-muted-foreground cursor-not-allowed rounded-lg border px-4 py-2 text-sm opacity-40"
            >
              Állapotlap generálása — hamarosan
            </button>
          </div>
        </div>
      </div>

      {/* Értéktörténet */}
      <AppSection label="Értéktörténet" id="ertektortenet">
        <div className="divide-border/30 divide-y">
          {[...DEMO_VALUE_HISTORY].reverse().map((h, idx) => {
            const prev =
              DEMO_VALUE_HISTORY[DEMO_VALUE_HISTORY.length - 2 - idx];
            const diff = prev ? h.value - prev.value : null;
            return (
              <div
                key={h.date}
                className="flex items-center justify-between gap-4 py-2.5 text-sm"
              >
                <span className="text-muted-foreground font-mono text-xs tabular-nums">
                  {new Date(h.date).toLocaleDateString("hu-HU")}
                </span>
                <div className="text-right">
                  <p className="font-mono font-semibold tabular-nums">
                    {h.value.toLocaleString("hu-HU")} Ft
                  </p>
                  {diff != null && (
                    <p
                      className={`font-mono text-xs tabular-nums ${diff < 0 ? "text-red-500" : "text-green-600"}`}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff.toLocaleString("hu-HU")} Ft
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </AppSection>
    </div>
  );
}
