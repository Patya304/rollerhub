import Link from "next/link";
import { Button } from "@/components/ui/button";

const checklist = [
  { label: "Vételár megadva", ok: true },
  { label: "Futásteljesítmény megadva", ok: true },
  { label: "Becsült érték elérhető", ok: true },
  { label: "Fotó hozzáadva", ok: true },
  { label: "Legalább 1 szerviz rögzítve", ok: true },
  { label: "Legalább 1 menet rögzítve", ok: true },
];

const rows = [
  { label: "Roller", value: "Ruptor R1 v2 (2024)" },
  { label: "Futásteljesítmény", value: "2 000 km" },
  { label: "Vételár", value: "200 000 Ft" },
  { label: "Becsült jelenlegi érték", value: "148 000 Ft" },
  { label: "Értékmegőrzés", value: "74%" },
  { label: "Dokumentált szervizek", value: "2 alkalom" },
  { label: "Utolsó szerviz", value: "Fék ellenőrzés · 2025. 04. 12." },
  { label: "Naplózott menetek", value: "12 menet" },
];

export default function SampleReportPage() {
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

      <section className="mx-auto w-full max-w-2xl px-6 py-12">
        <div className="mb-2 text-center">
          <span className="rounded-full border px-2 py-0.5 text-xs">
            Előnézet · Demo adatok · Nem valódi riport
          </span>
        </div>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Minta értékriport
        </h1>
        <p className="text-muted-foreground mt-3 text-center text-lg">
          Így nézhet ki egy eladáshoz előkészített roller állapotlap.
        </p>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          Ez egy előnézet demo adatokkal — a valódi riport a saját rolleredhez
          generálódik, a te szerviz- és menetadataid alapján.
        </p>

        <div className="mt-10 space-y-6 rounded-xl border p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold">Értékriport előnézet</h2>
              <p className="text-muted-foreground text-sm">
                Add el profibban a rolleredet egy rendezett állapotlappal.
              </p>
            </div>
            <span className="rounded-full border px-2 py-0.5 text-xs">
              Premium · Hamarosan
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r.label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="text-right font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">
              Ajánlott hirdetési ársáv
            </p>
            <p className="mt-1 text-base font-semibold">
              kb. 133 000 – 163 000 Ft
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Állapotlap teljessége
            </p>
            <ul className="space-y-1">
              {checklist.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="text-green-600">✓</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground pt-1 text-xs italic">
              Az állapotlapod jó alap egy eladási PDF-hez — ez Premium
              funkcióként érkezik.
            </p>
          </div>

          <div className="space-y-3 border-t pt-4">
            <p className="text-muted-foreground text-xs">
              A Premium állapotlap összefoglalja a roller dokumentált
              előzményeit — szervizek, futásteljesítmény, becsült érték — egy
              megosztható, rendezett formában. Vevők számára meggyőzőbb, te
              pedig többet kapsz a rollerért.
            </p>
            <button
              disabled
              className="text-muted-foreground cursor-not-allowed rounded-md border px-4 py-2 text-sm opacity-50"
            >
              Állapotlap generálása — hamarosan
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/sign-up">Kipróbálom ingyen</Link>
          </Button>
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
