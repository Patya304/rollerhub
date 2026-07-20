import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PublicSiteHeader } from "@/components/public-site-header";
import { SaleReportView } from "@/modules/sale-report/components/sale-report-view";
import type { SaleReportDto } from "@/modules/sale-report/dto";

// Mock adat az egyetlen publikus bemutatóoldalhoz. Nincs Prisma, nincs
// mentés, a valódi SaleReportView presentational komponenst használja.
const mockReport: SaleReportDto = {
  brand: "Ruptor",
  model: "R1 v2",
  year: 2024,
  photoUrl: null,
  currentMileage: 2000,
  batteryCapacity: 500,
  topSpeed: 45,
  rangeKm: 60,
  color: "Fekete",
  estimatedValue: 148000,
  serviceCount: 3,
  services: [
    {
      type: "BATTERY",
      performedAt: "2026-06-01T00:00:00.000Z",
      odometerKm: 1900,
    },
    {
      type: "BRAKE_CHANGE",
      performedAt: "2026-05-20T00:00:00.000Z",
      odometerKm: 1500,
    },
    {
      type: "TIRE_CHANGE",
      performedAt: "2026-04-15T00:00:00.000Z",
      odometerKm: 800,
    },
  ],
  condition: {
    overall: "GOOD",
    battery: "FAIR",
    brakes: "GOOD",
    tires: "NEEDS_ATTENTION",
    lights: "GOOD",
    frame: "GOOD",
    cosmetics: "FAIR",
    knownIssuesState: "REPORTED",
    knownIssues: "Az első gumi kopott, cserét igényel.",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  updatedAt: "2026-06-05T00:00:00.000Z",
  owner: null,
};

export default async function SampleReportPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const loggedIn = !!session;

  return (
    <main className="flex min-h-screen flex-col">
      <PublicSiteHeader loggedIn={loggedIn} />

      <section className="mx-auto w-full max-w-2xl px-6 py-12">
        <div className="mb-2 text-center">
          <span className="rounded-full border px-2 py-0.5 text-xs">
            Előnézet · Demó adatok · Nem valódi állapotlap
          </span>
        </div>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Minta eladási állapotlap
        </h1>
        <p className="text-muted-foreground mt-3 text-center text-lg">
          Egy megosztható összefoglaló a roller fontos adatairól,
          szervizelőzményeiről és jelenlegi állapotáról.
        </p>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          Ez egy demó. A valódi állapotlap a saját rolleradataidból készül.
        </p>

        <div className="mt-10">
          <SaleReportView report={mockReport} variant="public" />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {loggedIn ? (
            <Button asChild size="lg">
              <Link href="/dashboard">Vissza az appba</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/sign-up">Kipróbálom ingyen</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">Csomagok megtekintése</Link>
          </Button>
        </div>
      </section>

      <footer className="text-muted-foreground mt-auto border-t px-6 py-6 text-center text-sm">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>RollerHub · {new Date().getFullYear()}</span>
          <span>·</span>
          <Link href="/" className="underline">
            Főoldal
          </Link>
          <span>·</span>
          <Link href="/pricing" className="underline">
            Árak
          </Link>
          <span>·</span>
          <Link href="/devlog" className="underline">
            Fejlesztési napló
          </Link>
          <span>·</span>
          <Link href="/privacy" className="underline">
            Adatkezelés
          </Link>
          <span>·</span>
          <Link href="/terms" className="underline">
            Felhasználási feltételek
          </Link>
        </p>
      </footer>
    </main>
  );
}
