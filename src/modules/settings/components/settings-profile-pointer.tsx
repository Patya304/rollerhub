import Link from "next/link";

// "Profil" mutató kártya a Beállításokban: a valódi és az előnézeti
// Beállítások is ezt használja. Csak propsból dolgozik.
export function SettingsProfilePointer({ href }: { href: string }) {
  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      <div className="border-border/50 border-b px-5 py-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
          Profil
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="text-muted-foreground text-sm">
          Profilképedet, felhasználónevedet és publikus profilodat a Profilom
          oldalon módosíthatod.
        </p>
        <Link
          href={href}
          className="hover:bg-muted/40 shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        >
          Profilom megnyitása
        </Link>
      </div>
    </div>
  );
}
