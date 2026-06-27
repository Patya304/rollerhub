import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Felhasználási feltételek – RollerHub",
  description: "A RollerHub használatának feltételei.",
};

const LAST_UPDATED = "2026. június 27.";
const CONTACT_EMAIL = "kapcsolat@rollerhub.hu";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-muted-foreground text-sm hover:underline">
        ← Vissza a főoldalra
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Felhasználási feltételek</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Utolsó frissítés: {LAST_UPDATED}
      </p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-medium">A szolgáltatás</h2>
          <p className="text-muted-foreground">
            A RollerHub egy webes alkalmazás, amellyel nyilvántarthatod az
            elektromos rollereidet, azok szerviztörténetét, menetadatait és
            becsült értékét. A szolgáltatást igyekszünk folyamatosan elérhetővé
            tenni, de nem garantáljuk a megszakításmentes működést.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Fiók és felelősség</h2>
          <p className="text-muted-foreground">
            A használathoz fiók szükséges. A belépési adataid biztonságáért te
            felelsz, és a fiókodon végzett tevékenységekért is. Kérjük, valós
            adatokkal regisztrálj, és ne add tovább a hozzáférésedet.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Elfogadható használat</h2>
          <p className="text-muted-foreground">
            A RollerHubot csak jogszerű célra használhatod. Tilos a szolgáltatás
            működésének akadályozása, mások adataihoz való jogosulatlan
            hozzáférés kísérlete, vagy a rendszer bármilyen visszaélésszerű
            használata.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Az értékbecslésről</h2>
          <p className="text-muted-foreground">
            A RollerHub becsült értéket számol a megadott adatok alapján. Ez
            tájékoztató jellegű becslés, és nem minősül pénzügyi tanácsadásnak
            vagy garantált eladási árnak. A becslésre alapozott döntéseidért te
            felelsz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">A tudásközpont tartalmáról</h2>
          <p className="text-muted-foreground">
            A tudásközpontban található információk (pl. közlekedési szabályok,
            biztosítás, jogosítvány) tájékoztató jellegűek, és nem minősülnek
            jogi tanácsadásnak. A mindenkori hivatalos szabályozást mindig
            érdemes önállóan is ellenőrizned.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Felelősség korlátozása</h2>
          <p className="text-muted-foreground">
            {'A szolgáltatást „adott állapotában" biztosítjuk.'} A jogszabályok
            által megengedett mértékben nem vállalunk felelősséget a
            használatból eredő közvetett károkért vagy az esetleges
            adatvesztésért. Javasoljuk a fontosabb adataid külön mentését is.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">A feltételek módosítása</h2>
          <p className="text-muted-foreground">
            Ezeket a feltételeket időről időre módosíthatjuk. A lényeges
            változásokról a szolgáltatáson belül vagy a kezdőoldalon
            tájékoztatunk. A folytatólagos használat a frissített feltételek
            elfogadását jelenti.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Kapcsolat</h2>
          <p className="text-muted-foreground">
            Kérdés esetén írj ide:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <p className="text-muted-foreground border-t pt-4 text-xs">
          Ez a dokumentum általános jelleggel készült, és nem minősül jogi
          tanácsadásnak. Éles, nyilvános indulás előtt érdemes szakemberrel
          ellenőriztetni.
        </p>
      </div>
    </main>
  );
}
