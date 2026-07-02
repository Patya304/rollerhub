import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const freeFeatures = [
  "1 roller nyilvántartása",
  "Szervizkönyv",
  "Menetnapló",
  "Értékbecslés és értéktörténet",
  "Magyar Tudástár",
  "Dashboard összesítők",
];

const premiumFeatures = [
  "Korlátlan roller",
  "Részletes értékriport",
  "Eladási állapotlap (PDF)",
  "Szerviz emlékeztetők",
  "Export / adatmentés",
  "Minden ingyenes funkció",
];

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          🛴 RollerHub
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost">
            <Link href="/sign-in">Belépés</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">Regisztráció</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Egyszerű, átlátható árak
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Kezdés ingyen. A Premium funkciók később érkeznek.
        </p>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-xl border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Free</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Ingyenes csomag
              </p>
              <p className="mt-4 text-4xl font-bold">
                0 Ft
                <span className="text-muted-foreground text-base font-normal">
                  /hó
                </span>
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  {f}
                </li>
              ))}
            </ul>

            <Button asChild>
              <Link href="/sign-up">Kezdés ingyen</Link>
            </Button>
          </div>

          {/* Premium */}
          <div className="flex flex-col rounded-xl border p-6 opacity-75">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Premium</h2>
                <span className="rounded-full border px-2 py-0.5 text-xs">
                  Hamarosan
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Több roller, részletes riportok, exportok
              </p>
              <p className="mt-4 text-4xl font-bold">
                <span className="text-muted-foreground text-base font-normal">
                  ár később
                </span>
              </p>
            </div>

            <ul className="mb-6 flex-1 space-y-3">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
              A Premium funkciók fokozatosan érkeznek. Először az értékriportot
              és az eladási állapotlapot validáljuk.
            </p>

            <Button disabled variant="outline">
              Hamarosan elérhető
            </Button>
          </div>
        </div>

        <div className="mt-10 space-y-2 text-center">
          <p className="text-muted-foreground text-sm">
            Kíváncsi vagy, hogyan néz ki egy értékriport?{" "}
            <Link
              href="/sample-report"
              className="text-foreground font-medium underline underline-offset-4"
            >
              Minta riport megnyitása →
            </Link>
          </p>
          <p className="text-muted-foreground text-sm">
            Megnéznéd az appot bejelentkezés nélkül?{" "}
            <Link
              href="/preview/app"
              className="text-foreground font-medium underline underline-offset-4"
            >
              Demó app megnyitása →
            </Link>
          </p>
          <p className="text-muted-foreground text-sm">
            Kérdésed van?{" "}
            <Link href="/devlog" className="underline underline-offset-4">
              Kövesd a fejlesztési naplót
            </Link>
            .
          </p>
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
