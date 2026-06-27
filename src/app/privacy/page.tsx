import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató – RollerHub",
  description: "Hogyan kezeli a RollerHub a felhasználók adatait.",
};

const LAST_UPDATED = "2026. június 27.";
const CONTACT_EMAIL = "kapcsolat@rollerhub.hu";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-muted-foreground text-sm hover:underline">
        ← Vissza a főoldalra
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Adatkezelési tájékoztató</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Utolsó frissítés: {LAST_UPDATED}
      </p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-medium">Ki kezeli az adataidat?</h2>
          <p className="text-muted-foreground">
            A RollerHub egy digitális garázs elektromos rollerekhez. A
            szolgáltatást egyéni fejlesztőként üzemeltetem. Adatkezeléssel
            kapcsolatos kérdésben a lenti emailen érhetsz el.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Milyen adatokat kezelünk?</h2>
          <p className="text-muted-foreground">
            Két fő adatkört kezelünk: a fiókod adatait (név, email-cím és a
            belépéshez szükséges hitelesítési adatok), valamint a tartalmat,
            amit te viszel fel — rollereid adatai, szervizbejegyzések,
            menetadatok és értékbecslések. Csak azokat az adatokat kezeljük,
            amelyeket te adsz meg.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">
            Mire használjuk az adatokat?
          </h2>
          <p className="text-muted-foreground">
            Az adatokat kizárólag a szolgáltatás működtetésére használjuk: hogy
            be tudj lépni, lásd és kezeld a rollereidet, és működjenek a
            funkciók, mint az értékbecslés vagy a szervizkönyv. Az adataidat nem
            adjuk el, és nem használjuk hirdetési célra.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Hol tároljuk az adatokat?</h2>
          <p className="text-muted-foreground">
            Az adatok egy felhőalapú adatbázisban tárolódnak, európai uniós
            régióban. A hozzáférést a szolgáltatás működéséhez szükséges
            minimumra korlátozzuk.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Meddig őrizzük az adatokat?</h2>
          <p className="text-muted-foreground">
            Az adataidat addig őrizzük, amíg a fiókod aktív. Ha törlöd a
            fiókodat vagy ezt kéred, a hozzád tartozó adatokat észszerű időn
            belül eltávolítjuk.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">A te jogaid</h2>
          <p className="text-muted-foreground">
            Jogosult vagy hozzáférni a rólad tárolt adatokhoz, kérni azok
            javítását vagy törlését. Ha élni szeretnél ezekkel a jogokkal, írj a
            lenti email-címre, és igyekszünk észszerű időn belül intézkedni.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium">Kapcsolat</h2>
          <p className="text-muted-foreground">
            Adatkezeléssel kapcsolatos kérdéseiddel írj ide:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <p className="text-muted-foreground border-t pt-4 text-xs">
          Ez a tájékoztató általános jelleggel készült, és nem minősül jogi
          tanácsadásnak. Éles, nyilvános indulás előtt érdemes szakemberrel
          ellenőriztetni.
        </p>
      </div>
    </main>
  );
}
