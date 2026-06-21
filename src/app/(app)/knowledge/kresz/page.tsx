import Link from "next/link";

export default function KreszPage() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <Link href="/knowledge" className="text-muted-foreground hover:underline">
        ← Vissza a Tudásközponthoz
      </Link>
      <h1 className="text-2xl font-semibold">KRESZ</h1>

      <p>
        Jelenleg (2026 közepén) az elektromos rollerek szabályozása átmeneti: a
        gyakorlatban nagyrészt a kerékpáros szabályok az irányadók. A 2026.
        szeptember 1-jén hatályba lépő új KRESZ önálló járműkategóriaként kezeli
        a rollereket, és teljesítmény, tömeg és végsebesség alapján két
        csoportba sorolja őket.
      </p>

      <h2 className="font-medium">A két kategória</h2>
      <p>
        <strong>Könnyű roller:</strong> legfeljebb 25 km/h végsebesség, 1000 W
        alatti teljesítmény, 35 kg alatti tömeg. Nagyjából a kerékpárra
        vonatkozó szabályok érvényesek rá.
      </p>
      <p>
        <strong>Nagy teljesítményű roller:</strong> 1000 W feletti teljesítmény
        vagy 25 km/h-nál nagyobb sebesség (egyes források a 35 kg feletti
        tömeget is ide sorolják). A kétkerekű segédmotorosokra (robogókra)
        vonatkozó szabályok érvényesek rá.
      </p>

      <h2 className="font-medium">Hol és milyen tempóval?</h2>
      <p>
        Könnyű rollerrel: ha van kerékpárút, azt kell használni. Járdán csak
        gyalogos tempóban (a tervezet szerint max. 10 km/h), kerékpárúton vagy
        az úttesten max. 20 km/h, a helyi korlátozásokhoz igazodva.
      </p>
      <p>
        Nagy teljesítményű rollerrel az úttesten (vagy kerékpársávban) kell
        haladni — járdán, gyalog- és kerékpárúton nem. A megengedett legnagyobb
        sebesség jellemzően 45 km/h.
      </p>

      <p className="text-muted-foreground border-t pt-3 text-xs">
        Tájékoztató jellegű, nem jogi tanács. A 2026-os szabályok az új KRESZ
        tervezete alapján készültek, a végleges szabályozás eltérhet. Frissítve:
        2026. június.
      </p>
    </div>
  );
}
