import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PublicSiteHeader } from "@/components/public-site-header";
import { SaleReport } from "@/modules/garage/components/sale-report";

// Mock adatok az egyetlen publikus bemutatóoldalhoz.
const scooter = {
  brand: "Ruptor",
  model: "R1 v2",
  year: 2024,
  currentMileage: 2000,
  purchasePrice: 200000,
  estimate: 148000,
  serviceCount: 3,
  rideCount: 12,
  photoUrl: null,
};

const services = [
  { label: "Akkuellenőrzés", performedAt: "2026-06-01", odometerKm: 1900 },
  { label: "Fékállítás", performedAt: "2026-05-20", odometerKm: 1500 },
  { label: "Gumicsere", performedAt: "2026-04-15", odometerKm: 800 },
];

export default async function SampleReportPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const loggedIn = !!session;

  return (
    <main className="flex min-h-screen flex-col">
      <PublicSiteHeader loggedIn={loggedIn} />

      <section className="mx-auto w-full max-w-2xl px-6 py-12">
        <div className="mb-2 text-center">
          <span className="rounded-full border px-2 py-0.5 text-xs">
            Előnézet · Demó adatok · Nem valódi riport
          </span>
        </div>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Minta értékriport
        </h1>
        <p className="text-muted-foreground mt-3 text-center text-lg">
          Minta állapotlap eladáshoz.
        </p>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          Ez egy demó. A valódi riport a saját rolleradataidból készül.
        </p>

        <div className="mt-10">
          <SaleReport
            brand={scooter.brand}
            model={scooter.model}
            year={scooter.year}
            photoUrl={scooter.photoUrl}
            currentMileage={scooter.currentMileage}
            purchasePrice={scooter.purchasePrice}
            lastEstimatedValue={scooter.estimate}
            services={services}
            serviceCount={scooter.serviceCount}
            rideCount={scooter.rideCount}
          />
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
