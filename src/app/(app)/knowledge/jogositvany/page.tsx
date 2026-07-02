import Link from "next/link";

export default function JogositvanyPage() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <Link href="/knowledge" className="text-muted-foreground hover:underline">
        ← Vissza a Tudástárhoz
      </Link>
      <h1 className="text-2xl font-semibold">Jogosítvány</h1>

      <p>
        Jelenleg (2026 közepén) az elektromos roller vezetéséhez nem kell
        jogosítvány.
      </p>

      <h2 className="font-medium">Mi változhat 2026 szeptemberétől?</h2>
      <p>
        A 2026. szeptemberi új KRESZ ezen módosíthat. Több beszámoló szerint a
        nagy teljesítményű (motoros) kategóriához jogosítvány válhat kötelezővé,
        a könnyű rollerekhez viszont nem.
      </p>
      <p>
        Fontos azonban: ez tervezet, és a részletek vitatottak. Egyes
        tervezet-változatok szerint egyik kategóriához sem kellene jogosítvány.
        A végleges szabály eltérhet, ezért érdemes a hivatalos forrásokat
        figyelni.
      </p>

      <p className="text-muted-foreground border-t pt-3 text-xs">
        Tájékoztató jellegű, nem jogi tanács. A jogosítvány-kötelezettség a
        végleges KRESZ-szövegtől függ, ami még nincs kihirdetve. Frissítve:
        2026. június.
      </p>
    </div>
  );
}
