import Link from "next/link";

export default function SzabalyokPage() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <Link href="/knowledge" className="text-muted-foreground hover:underline">
        ← Vissza a Tudásközponthoz
      </Link>
      <h1 className="text-2xl font-semibold">Roller szabályok</h1>

      <h2 className="font-medium">Korhatár</h2>
      <p>
        A tervezet szerint könnyű rollerrel 12 éves kortól, nagy
        teljesítményűvel jellemzően 14 éves kortól lehet közlekedni.
      </p>

      <h2 className="font-medium">Sisak</h2>
      <p>
        Könnyű rollernél kerékpáros sisak (a tervezet szerint kötelezővé válik);
        nagy teljesítményű rollernél motoros bukósisak kötelező.
      </p>

      <h2 className="font-medium">Kötelező felszerelés</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>két, egymástól függetlenül működő fék;</li>
        <li>
          elöl fehér, hátul piros lámpa/fényvisszaverő (sötétben, tiszta időben
          legalább 150 méterről látszódjon);
        </li>
        <li>
          lakott területen kívül, éjszaka vagy rossz látási viszonyok között
          láthatósági mellény.
        </li>
      </ul>

      <h2 className="font-medium">Egyéb</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>utast szállítani tilos, vontatmányt csatlakoztatni tilos;</li>
        <li>
          két vagy több oszlopban haladni tilos (kivéve kerékpáros övezet,
          lakó-pihenő övezet);
        </li>
        <li>
          alkoholra zéró tolerancia — a roller gépi meghajtású járműnek minősül,
          ittas vezetés büntetőeljárást vonhat maga után.
        </li>
      </ul>

      <p className="text-muted-foreground border-t pt-3 text-xs">
        Tájékoztató jellegű, nem jogi tanács. A 2026-os szabályok tervezet
        alapján készültek, a végleges szabályozás eltérhet. Frissítve: 2026.
        június.
      </p>
    </div>
  );
}
