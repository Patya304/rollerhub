import Link from "next/link";

export default function BiztositasPage() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <Link href="/knowledge" className="text-muted-foreground hover:underline">
        ← Vissza a Tudásközponthoz
      </Link>
      <h1 className="text-2xl font-semibold">Biztosítás</h1>

      <p>
        A kötelező felelősségbiztosítás (KGFB) bizonyos elektromos rollerekre
        már 2024. július 16. óta kötelező — ez független a 2026-os
        KRESZ-változástól.
      </p>

      <h2 className="font-medium">Mikor kötelező?</h2>
      <p>Ha a rollerre az alábbiak közül bármelyik igaz:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>a tervezési (gyári) végsebessége meghaladja a 25 km/h-t, vagy</li>
        <li>
          a saját tömege több mint 25 kg, és a sebessége eléri a 14 km/h-t.
        </li>
      </ul>
      <p>A kisebb, lassabb rollerekre jellemzően nem kötelező.</p>

      <h2 className="font-medium">Mennyibe kerül?</h2>
      <p>
        A díjat nem központilag állapítják meg — biztosítónként eltér, a roller
        teljesítményétől, a tulajdonos életkorától és lakhelyétől függően. Az
        éves díj jellemzően kb. 8 000–15 000 Ft.
      </p>
      <p>
        A biztosítás meglétét igazoló dokumentumot (akár digitálisan) érdemes
        magadnál tartani.
      </p>

      <p className="text-muted-foreground border-t pt-3 text-xs">
        Tájékoztató jellegű, nem jogi tanács. Az aktuális feltételekért és
        díjért keresd a biztosítód ajánlatát. Frissítve: 2026. június.
      </p>
    </div>
  );
}
