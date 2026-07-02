export type DevlogType = "feature" | "fix" | "improvement" | "planning";

export type DevlogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  summary: string;
  content: string;
  type: DevlogType;
};

export const DEVLOG_TYPE_LABELS: Record<DevlogType, string> = {
  feature: "Új funkció",
  fix: "Javítás",
  improvement: "Fejlesztés",
  planning: "Tervezés alatt",
};

export const devlogEntries: DevlogEntry[] = [
  {
    id: "concept",
    date: "2026-03-15",
    title: "RollerHub koncepció megszületett",
    type: "planning",
    summary:
      "Elindult a RollerHub alapötlete: egy digitális garázs elektromos rollerekhez.",
    content:
      "A cél egy olyan webapp felépítése lett, ahol a felhasználók nyilvántarthatják a rollereiket, azok értékét, szerviztörténetét, menetadatait és a fontosabb rolleres szabályokat.",
  },
  {
    id: "tech-stack",
    date: "2026-03-22",
    title: "Technológiai alapok kiválasztva",
    type: "planning",
    summary: "Kiválasztásra kerültek a RollerHub technikai alapjai.",
    content:
      "A projekt Next.js, TypeScript, Tailwind, shadcn/ui, Prisma, Neon Postgres és Better Auth alapokra épül. Solo dev számára is fenntartható, moduláris monolit architektúra.",
  },
  {
    id: "auth-db",
    date: "2026-04-02",
    title: "Auth és adatbázis alap elkészült",
    type: "feature",
    summary:
      "Elkészült a regisztráció, belépés és az alap adatbázis-kapcsolat.",
    content:
      "Elkészült a Better Auth alapú hitelesítés és a Prisma + Neon Postgres adatkapcsolat. Ezzel adottak az alapok a felhasználói fiókokhoz és a rolleradatok tárolásához.",
  },
  {
    id: "garage-v1",
    date: "2026-04-10",
    title: "Garázs modul első verziója elkészült",
    type: "feature",
    summary: "A felhasználók már felvehetik saját rollereiket.",
    content:
      "Elkészült a Garázs modul első verziója, ahol a felhasználó megadhatja a roller márkáját, modelljét, évjáratát, kilométeróra-állását és vételárát.",
  },
  {
    id: "app-layout-sidebar",
    date: "2026-04-18",
    title: "App layout és sidebar elkészült",
    type: "feature",
    summary:
      "Elkészült a RollerHub védett alkalmazásfelülete oldalsó navigációval.",
    content:
      "Elkészült a bejelentkezés utáni appfelület oldalsó navigációval. Az oldalsávból elérhető az Áttekintés, a Garázs, a Szerviz, a Menetnapló, az Értékbecslés, a Tudástár és a Beállítások.",
  },
  {
    id: "scooter-details",
    date: "2026-04-28",
    title: "Roller adatlap elkészült",
    type: "feature",
    summary: "A rollerek már saját részletes adatlapot kaptak.",
    content:
      "A Garázs listából megnyitható minden roller saját oldala, ahol látszanak az alapadatok, a becsült érték, a szervizelőzmények, az értéktörténet és a menetadatok.",
  },
  {
    id: "garage-ux",
    date: "2026-05-05",
    title: "Garázs UX egyszerűsítve",
    type: "improvement",
    summary: "A Garázs lista áttekinthetőbb, kártyás megjelenítést kapott.",
    content:
      "A rollerek listája rövidebb és tisztább lett. A részletes adatok, szervizek és értéktörténet a roller saját adatlapjára kerültek, így a Garázs oldal kevésbé zsúfolt.",
  },
  {
    id: "service-log-v1",
    date: "2026-05-12",
    title: "Szervizkönyv első verziója elkészült",
    type: "feature",
    summary: "A rollerekhez már szervizbejegyzések adhatók hozzá.",
    content:
      "Elkészült a szervizkönyv alapja, ahol a felhasználó gumicsere, fék, akkumulátor, javítás vagy általános karbantartás típusú bejegyzéseket rögzíthet.",
  },
  {
    id: "value-estimation-v1",
    date: "2026-05-18",
    title: "Értékbecslés első verziója elkészült",
    type: "feature",
    summary: "A rollerekhez már becsült aktuális értéket számol az app.",
    content:
      "Elkészült az első értékbecslő rendszer, amely a vételár, a roller kora és a kilométeróra-állás alapján becsült aktuális értéket számol.",
  },
  {
    id: "value-history",
    date: "2026-05-22",
    title: "Értéktörténet bekerült",
    type: "feature",
    summary: "Az értékbecslések előzményként is követhetők.",
    content:
      "A rendszer már nemcsak aktuális becsült értéket számol, hanem az értékbecslések előzményeit is elmenti, így később láthatóvá válik az érték változása.",
  },
  {
    id: "dashboard-real-data",
    date: "2026-05-28",
    title: "Dashboard áttekintés valódi adatokkal elkészült",
    type: "improvement",
    summary: "Az Áttekintés oldal már valódi statisztikákat mutat.",
    content:
      "A Dashboard mostantól összesíti a rollerek számát, az összes kilométert, a becsült összértéket, az értékvesztést, a szervizek számát, a szervizköltségeket és a menetadatokat.",
  },
  {
    id: "global-service-page",
    date: "2026-06-02",
    title: "Globális Szerviz oldal elkészült",
    type: "feature",
    summary:
      "A szervizek már nemcsak roller adatlapról, hanem külön oldalon is áttekinthetők.",
    content:
      "Elkészült a globális Szerviz oldal, ahol a felhasználó az összes szervizbejegyzését láthatja, szűrheti roller szerint, és követheti az összes szervizköltséget.",
  },
  {
    id: "rides-log",
    date: "2026-06-06",
    title: "Menetnapló alap elkészült",
    type: "feature",
    summary: "A RollerHub már menetadatokat is tud tárolni.",
    content:
      "Elkészült a menetnapló alapja, ahol a felhasználó rögzítheti a megtett távolságot, időtartamot, átlagsebességet és maximális sebességet.",
  },
  {
    id: "data-validation",
    date: "2026-06-10",
    title: "Adatvalidáció megerősítve",
    type: "fix",
    summary: "Stabilabb lett az adatbevitel és a hibás adatok kezelése.",
    content:
      "Szigorúbb lett az adatellenőrzés. A rendszer jobban kezeli a negatív km-állást, hibás árakat, rossz dátumokat és érvénytelen URL-eket.",
  },
  {
    id: "purchase-date-estimate",
    date: "2026-06-14",
    title: "Vásárlási dátum bekerült az értékbecslésbe",
    type: "improvement",
    summary: "Pontosabb lett az értékbecslés a vásárlási dátum használatával.",
    content:
      "Az értékbecslés mostantól figyelembe veszi a vásárlás dátumát is, nem csak az évjáratot. Ha a dátum meg van adva, a becslés pontosabb.",
  },
  {
    id: "v1-stabilization",
    date: "2026-06-18",
    title: "V1 stabilizálási kör elkészült",
    type: "improvement",
    summary:
      "A RollerHub stabilabb hibakezelést és jobb adatfrissülést kapott.",
    content:
      "Javult a kliens oldali hibakezelés, erősebb lett a dátumvalidáció, több helyen frissülnek automatikusan az összesítők. Elkészült a belső teszt checklist is.",
  },
  {
    id: "devlog-launch",
    date: "2026-06-22",
    title: "Fejlesztési napló oldal elindult",
    type: "feature",
    summary: "A RollerHub fejlesztése már nyilvánosan is követhető.",
    content:
      "Elérhető a fejlesztési napló oldal. Röviden összefoglalva szerepelnek a fontosabb funkciók, javítások és mérföldkövek.",
  },
  {
    id: "september-launch-prep",
    date: "2026-06-25",
    title: "Szeptemberi indulás előkészítése elkezdődött",
    type: "planning",
    summary: "Elindult a RollerHub V1 publikus indulásának előkészítése.",
    content:
      "Fókuszban a stabil V1 lezárása, a PWA előkészítés, az adatkezelési oldalak és a szeptemberi rolleres szabályváltozásokra való felkészülés.",
  },
  {
    id: "pwa-install",
    date: "2026-06-26",
    title: "Telepíthető mobil élmény (PWA)",
    type: "feature",
    summary:
      "A RollerHub mostantól telepíthető a telefon kezdőképernyőjére, app-szerű élményként.",
    content:
      "Az app hozzáadható a telefon kezdőképernyőjéhez, és saját ablakban indul. Gyorsabb elérés, böngésző nélküli megjelenés.",
  },
  {
    id: "public-launch",
    date: "2026-06-27",
    title: "A RollerHub elérhető online",
    type: "feature",
    summary: "A RollerHub mostantól bárki számára elérhető a böngészőből.",
    content:
      "A RollerHub első nyilvános verziója felkerült az internetre, így már nem csak fejlesztői környezetben, hanem éles weboldalként is használható: regisztrálhatsz, felviheted a rollereidet, és kipróbálhatod a szervizkönyvet, az értékbecslést és a menetnaplót.",
  },
  {
    id: "theme-engine",
    date: "2026-06-28",
    title: "Választható megjelenés: RollerHub témák",
    type: "feature",
    summary:
      "A kiválasztott téma mostantól tényleg átszínezi a bejelentkezett felületet.",
    content:
      "A Beállításokban választott téma (Fekete / fehér, Fekete / narancssárga, Fekete / kék) mostantól ténylegesen megjelenik az alkalmazás kinézetén: háttér, gombok, kiemelések és az oldalsáv is a választott stílust követi.",
  },
  {
    id: "settings-page",
    date: "2026-06-28",
    title: "Beállítások oldal: profil, téma, nyelv",
    type: "feature",
    summary:
      "Testreszabhatod a profilodat, és kiválaszthatod a kedvenc megjelenésedet.",
    content:
      "Elérhető a megújult Beállítások oldal: beállíthatsz felhasználónevet és megjelenített nevet, megadhatsz profilképet, választhatsz a RollerHub témái közül, és kiválaszthatod a kívánt nyelvet. A témák és a nyelvi felület teljes körű alkalmazása a következő frissítésekben érkezik.",
  },
  {
    id: "premium-direction",
    date: "2026-06-29",
    title: "Premium irány és minta értékriport",
    type: "feature",
    summary:
      "Elkészült az árak oldal, az értékriport előnézet és a publikus minta riport.",
    content:
      "Elérhető az árak oldal a Free és a hamarosan érkező Premium csomag bemutatásával. A roller adatlapján megjelent az értékriport előnézet: ajánlott hirdetési ársáv, állapotlap checklist. Elkészült egy publikus minta oldal is, bejelentkezés nélkül megtekinthető. Ez még nem fizetős rendszer, a Premium funkciók előkészítése zajlik.",
  },
];
