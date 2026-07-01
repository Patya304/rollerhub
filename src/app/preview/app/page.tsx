import Link from "next/link";
import {
  AppPage,
  AppPageHeader,
  AppPanelList,
  AppListItem,
  AppSection,
  FieldList,
} from "@/components/app-page";

// ── Mock adatok ──────────────────────────────────────────────────────────────
// Csak statikus demo értékek. Nincs auth, nincs Prisma, nincs API hívás.

const MOCK_STATS = {
  scooterCount: 2,
  totalKm: 3240,
  totalValue: 298000,
  serviceCount: 5,
  totalServiceCost: 42000,
  rideCount: 18,
};

const MOCK_SCOOTERS = [
  {
    id: "demo-1",
    brand: "Ruptor",
    model: "R1 v2",
    year: 2024,
    currentMileage: 2000,
    estimate: 148000,
    marker: "01",
  },
  {
    id: "demo-2",
    brand: "Ninebot",
    model: "Max G2",
    year: 2023,
    currentMileage: 1240,
    estimate: 150000,
    marker: "02",
  },
];

const MOCK_TECH_FIELDS = [
  { label: "Km óra állás", value: "2 000 km" },
  { label: "Évjárat", value: "2024" },
  { label: "Akku", value: "551 Wh" },
  { label: "Végsebesség", value: "25 km/h" },
  { label: "Hatótáv", value: "70 km" },
  { label: "Szín", value: "Fekete" },
  { label: "Alvázszám", value: "RP24-00142" },
];

const MOCK_VALUE_FIELDS = [
  { label: "Vételár", value: "200 000 Ft" },
  { label: "Vásárlás dátuma", value: "2024. 03. 10." },
  { label: "Becsült érték", value: "148 000 Ft" },
  { label: "Utolsó becslés", value: "2026. 06. 28." },
];

const MOCK_CHECKLIST = [
  { label: "Vételár megadva", ok: true },
  { label: "Futásteljesítmény megadva", ok: true },
  { label: "Becsült érték elérhető", ok: true },
  { label: "Fotó hozzáadva", ok: true },
  { label: "Legalább 1 szerviz rögzítve", ok: true },
  { label: "Legalább 1 menet rögzítve", ok: true },
];

const KNOWLEDGE_TOPICS = [
  {
    marker: "01",
    eyebrow: "Közlekedési szabályok",
    title: "KRESZ",
    description: "Rollerrel az úton — mi szabad, mi nem, hol közlekedhetsz.",
  },
  {
    marker: "02",
    eyebrow: "Felelősségvállalás",
    title: "Biztosítás",
    description:
      "Kötelező és ajánlott biztosítási formák elektromos rollerekhez.",
  },
  {
    marker: "03",
    eyebrow: "Okmányok",
    title: "Jogosítvány",
    description: "Mikor kell jogosítvány? Milyen kategória vonatkozik rád?",
  },
  {
    marker: "04",
    eyebrow: "Szabályozás",
    title: "Roller szabályok",
    description: "Aktuális szabályok, zónák, sebességhatárok Magyarországon.",
  },
];

const THEME_OPTIONS = [
  { value: "default", label: "Alap", hint: "Shadcn default" },
  { value: "black-white", label: "Fekete / fehér", hint: "Letisztult" },
  {
    value: "black-orange",
    label: "Fekete / narancs",
    hint: "Sport · ajánlott",
    recommended: true,
    active: true,
  },
  { value: "black-blue", label: "Fekete / kék", hint: "Tech" },
];

// ── Komponens ────────────────────────────────────────────────────────────────

export default function AppPreviewPage() {
  return (
    <div
      data-theme="black-orange"
      className="bg-background text-foreground min-h-screen"
    >
      {/* Preview fejléc — nem app UI, csak audit jelzés */}
      <div className="border-border/50 bg-card border-b px-6 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium">
              Design preview · demo adatok
            </span>
            <span className="text-muted-foreground text-xs">
              Nincs auth, nincs valódi adat
            </span>
          </div>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Vissza a főoldalra
          </Link>
        </div>
      </div>

      <div className="px-4 py-8">
        <AppPage>
          {/* ── 1. DASHBOARD ─────────────────────────────────────────────── */}
          <div className="border-border/30 border-b pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              01 · Dashboard
            </p>
          </div>

          <AppPageHeader eyebrow="01 · Műszerfal" title="Digitális garázs" />

          {/* Hero stat panel */}
          <div className="bg-card overflow-hidden rounded-xl border">
            <div className="border-border/50 border-b px-5 py-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                Garázs összesítő
              </p>
            </div>
            <div className="divide-border/30 grid grid-cols-2 divide-x divide-y">
              <div className="px-5 py-4">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Rollerek
                </p>
                <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
                  {MOCK_STATS.scooterCount}
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Összes km
                </p>
                <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
                  {MOCK_STATS.totalKm.toLocaleString("hu-HU")}
                  <span className="text-muted-foreground ml-1 text-sm font-normal">
                    km
                  </span>
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Becsült érték
                </p>
                <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
                  ~{MOCK_STATS.totalValue.toLocaleString("hu-HU")}
                  <span className="text-muted-foreground ml-1 text-sm font-normal">
                    Ft
                  </span>
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Szervizek
                </p>
                <p className="mt-1.5 font-mono text-2xl leading-none font-bold tabular-nums">
                  {MOCK_STATS.serviceCount}
                </p>
              </div>
            </div>
          </div>

          {/* Következő lépés */}
          <div className="border-primary/20 bg-primary/5 group block rounded-xl border px-5 py-4">
            <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
              Következő lépés
            </p>
            <p className="mt-1 font-semibold">Naplózz egy első menetet</p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Kövesd, mennyit és hogyan tekersz a rollereiden.
            </p>
          </div>

          {/* Modulok */}
          <AppPanelList label="Modulok">
            <AppListItem
              icon="🛴"
              title="Garázs"
              description="Rollerjeid adatlapja és km-állása."
              meta={`${MOCK_STATS.scooterCount} roller`}
            />
            <AppListItem
              icon="🔧"
              title="Szervizkönyv"
              description="Karbantartások, javítások, ellenőrzések."
              meta={`${MOCK_STATS.serviceCount} bejegyzés · ${MOCK_STATS.totalServiceCost.toLocaleString("hu-HU")} Ft`}
            />
            <AppListItem
              icon="🛣️"
              title="Menetnapló"
              description="Kiszállások, megtett táv, sebesség."
              meta={`${MOCK_STATS.rideCount} menet · ${MOCK_STATS.totalKm.toLocaleString("hu-HU")} km`}
            />
            <AppListItem
              icon="📊"
              title="Értékbecslés"
              description="Roller aktuális piaci értékének becslése."
              meta={`~${MOCK_STATS.totalValue.toLocaleString("hu-HU")} Ft`}
            />
            <AppListItem
              icon="📖"
              title="Tudásközpont"
              description="KRESZ, biztosítás, jogosítvány, szabályok."
            />
          </AppPanelList>

          {/* ── 2. GARÁZS ────────────────────────────────────────────────── */}
          <div className="border-border/30 mt-4 border-b pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              02 · Garázs
            </p>
          </div>

          <AppPageHeader eyebrow="02 · Garázs" title="Garázs" />

          <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
            {MOCK_SCOOTERS.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                <span className="text-muted-foreground/50 flex w-8 shrink-0 items-start justify-center pt-0.5 font-mono text-xs font-semibold tabular-nums">
                  {s.marker}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {s.brand} {s.model}
                  </p>
                  <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                    {s.year} · {s.currentMileage.toLocaleString("hu-HU")} km · ~
                    {s.estimate.toLocaleString("hu-HU")} Ft
                  </p>
                </div>
                <span className="text-muted-foreground shrink-0 text-sm">
                  →
                </span>
              </div>
            ))}
          </div>

          {/* ── 3. ROLLER ADATLAP ────────────────────────────────────────── */}
          <div className="border-border/30 mt-4 border-b pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              03 · Roller adatlap
            </p>
          </div>

          <AppPageHeader eyebrow="Ruptor" title="R1 v2" />

          {/* Hero card */}
          <div className="bg-card overflow-hidden rounded-xl border">
            <div className="flex items-start gap-4 p-5 pb-4">
              <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center rounded-xl text-4xl">
                🛴
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                  Ruptor
                </p>
                <h2 className="mt-0.5 text-2xl font-bold tracking-tight">
                  R1 v2
                </h2>
                <p className="text-muted-foreground text-sm">2024</p>
              </div>
            </div>
            <div className="border-border/50 divide-border/30 grid grid-cols-3 divide-x border-t">
              <div className="px-4 py-3">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Km
                </p>
                <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
                  2 000
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Szerviz
                </p>
                <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
                  3
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Menetek
                </p>
                <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
                  12
                </p>
              </div>
            </div>
            <div className="border-border/50 border-t px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs">
                  Becsült piaci érték
                </p>
                <p className="border-primary/30 bg-primary/10 text-primary rounded-lg px-3 py-1 font-mono text-sm font-bold tabular-nums">
                  ~148 000 Ft
                </p>
              </div>
            </div>
          </div>

          {/* Jármű adatlap navigáció */}
          <AppPanelList label="Jármű adatlap">
            <AppListItem
              icon="⚙️"
              title="Műszaki adatok"
              description="Km-állás, akku, sebesség, hatótáv."
            />
            <AppListItem
              icon="💰"
              title="Vásárlás és érték"
              description="Vételár, becsült jelenlegi érték."
            />
            <AppListItem
              icon="🔧"
              title="Szervizkönyv"
              description="3 bejegyzés"
            />
            <AppListItem
              icon="📋"
              title="Értékriport"
              description="Eladási állapotlap előnézet."
              eyebrow="Premium"
            />
            <AppListItem
              icon="📈"
              title="Értéktörténet"
              description="Becsült érték időbeli alakulása."
            />
          </AppPanelList>

          {/* Műszaki adatok */}
          <AppSection label="Műszaki adatok" id="muszaki">
            <FieldList fields={MOCK_TECH_FIELDS} />
          </AppSection>

          {/* Vásárlás és érték */}
          <AppSection label="Vásárlás és érték" id="ertek">
            <FieldList fields={MOCK_VALUE_FIELDS} />
          </AppSection>

          {/* ── 4. ÉRTÉKRIPORT PREVIEW ───────────────────────────────────── */}
          <div className="border-border/30 mt-4 border-b pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              04 · Értékriport
            </p>
          </div>

          <div className="bg-card overflow-hidden rounded-xl border">
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
              {/* Ársáv callout */}
              <div className="border-primary/20 bg-primary/5 rounded-xl border px-5 py-4">
                <p className="text-primary mb-1 text-xs font-semibold tracking-[0.15em] uppercase">
                  Ajánlott hirdetési ársáv
                </p>
                <p className="font-mono text-2xl font-bold tracking-tight tabular-nums">
                  133 000
                  <span className="text-muted-foreground mx-2 text-lg font-normal">
                    –
                  </span>
                  163 000
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
                    6/6
                  </span>
                </div>
                <div className="bg-card divide-border/30 divide-y overflow-hidden rounded-lg border">
                  {MOCK_CHECKLIST.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                    >
                      <span>{item.label}</span>
                      <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                        OK
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium CTA */}
              <div className="border-border/40 border-t pt-4">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  A Premium állapotlap összefoglalja a dokumentált előzményeket
                  — szervizek, futásteljesítmény, becsült érték — egy
                  megosztható formában.
                </p>
                <div className="mt-3">
                  <button
                    disabled
                    className="text-muted-foreground cursor-not-allowed rounded-lg border px-4 py-2 text-sm opacity-40"
                  >
                    Állapotlap generálása — hamarosan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 5. KNOWLEDGE PREVIEW ─────────────────────────────────────── */}
          <div className="border-border/30 mt-4 border-b pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              05 · Tudásközpont
            </p>
          </div>

          <AppPageHeader
            eyebrow="05 · Tudástár"
            title="Tudásközpont"
            description="Fontos tudnivalók a rollerezésről Magyarországon."
          />

          <AppPanelList label="Témakörök">
            {KNOWLEDGE_TOPICS.map((t) => (
              <AppListItem
                key={t.marker}
                marker={t.marker}
                eyebrow={t.eyebrow}
                title={t.title}
                description={t.description}
                meta="Hamarosan"
                disabled
              />
            ))}
          </AppPanelList>

          {/* ── 6. SETTINGS PREVIEW ──────────────────────────────────────── */}
          <div className="border-border/30 mt-4 border-b pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              06 · Beállítások
            </p>
          </div>

          <AppPageHeader eyebrow="06 · Beállítások" title="Beállítások" />

          {/* Profil szekció mock */}
          <div className="bg-card overflow-hidden rounded-xl border">
            <div className="border-border/50 border-b px-5 py-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                Profil
              </p>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Megjelenített név</span>
                <span className="font-medium">Demo Felhasználó</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Felhasználónév</span>
                <span className="font-mono text-sm">@demo_rider</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Email</span>
                <span className="font-mono text-sm">demo@rollerhub.app</span>
              </div>
            </div>
          </div>

          {/* Témaválasztó mock */}
          <div className="bg-card overflow-hidden rounded-xl border">
            <div className="border-border/50 border-b px-5 py-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                Megjelenés
              </p>
            </div>
            <div className="px-5 py-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {THEME_OPTIONS.map((t) => (
                  <div
                    key={t.value}
                    className={`relative rounded-lg border p-3 text-left ${
                      t.active
                        ? "border-primary bg-primary/5 ring-primary ring-1"
                        : ""
                    }`}
                  >
                    {t.recommended && (
                      <span className="text-primary absolute top-2 right-2 text-xs font-semibold">
                        ★
                      </span>
                    )}
                    <span className="block text-sm font-semibold">
                      {t.label}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t.hint}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fiók szekció mock */}
          <div className="bg-card overflow-hidden rounded-xl border">
            <div className="border-border/50 border-b px-5 py-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                Fiók és biztonság
              </p>
            </div>
            <div className="divide-border/30 divide-y px-5 text-sm">
              <div className="flex items-start justify-between gap-2 py-3">
                <div>
                  <span>Email</span>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    demo@rollerhub.app
                  </p>
                </div>
                <span className="mt-0.5 rounded-full border border-green-600 px-2 py-0.5 text-xs text-green-600">
                  Megerősítve
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 py-3">
                <div>
                  <span>Jelszó módosítása</span>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Email-alapú jelszóvisszaállítás hamarosan.
                  </p>
                </div>
                <span className="text-muted-foreground shrink-0 rounded-full border px-2 py-0.5 text-xs">
                  Hamarosan
                </span>
              </div>
            </div>
          </div>

          {/* Mentés gomb mock */}
          <div>
            <button
              disabled
              className="bg-primary text-primary-foreground cursor-not-allowed rounded-lg px-5 py-2.5 text-sm font-medium opacity-60"
            >
              Beállítások mentése
            </button>
            <p className="text-muted-foreground mt-1.5 text-xs">
              (Demo mód — mentés letiltva)
            </p>
          </div>

          {/* Lábléc */}
          <div className="border-border/30 border-t pt-4 text-center">
            <p className="text-muted-foreground text-xs">
              Design preview ·{" "}
              <Link href="/" className="underline underline-offset-4">
                RollerHub főoldal
              </Link>
              {" · "}
              <Link href="/pricing" className="underline underline-offset-4">
                Árak
              </Link>
              {" · "}
              <Link
                href="/sample-report"
                className="underline underline-offset-4"
              >
                Minta riport
              </Link>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Nincs valódi adat · Nincs auth · Nincs adatbázis-hozzáférés
            </p>
          </div>
        </AppPage>
      </div>
    </div>
  );
}
