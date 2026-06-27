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
    summary: "Meghatározásra került a RollerHub technikai iránya.",
    content:
      "A projekt Next.js, TypeScript, Tailwind, shadcn/ui, Prisma, Neon Postgres és Better Auth alapokra épül. A cél egy solo dev számára is fenntartható, moduláris monolit architektúra lett.",
  },
  {
    id: "auth-db",
    date: "2026-04-02",
    title: "Auth és adatbázis alap elkészült",
    type: "feature",
    summary:
      "Elkészült a regisztráció, belépés és az alap adatbázis-kapcsolat.",
    content:
      "A RollerHub megkapta a Better Auth alapú hitelesítést, valamint a Prisma és Neon Postgres alapú adatkezelést. Ezzel létrejött az alap a felhasználói fiókokhoz és a rolleradatok tárolásához.",
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
      "A RollerHub megkapta az alap app layoutot, amely bejelentkezés után egységes navigációt ad az Áttekintés, Garázs, Szerviz, Menetek, Értékbecslés, Tudásközpont és Beállítások oldalakhoz.",
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
    summary: "A RollerHub már becsült aktuális értéket számol a rollerekhez.",
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
      "Bevezetésre került a szigorúbb adatvalidáció, amely segít kiszűrni a negatív kilométeróra-állást, hibás árakat, rossz dátumokat, érvénytelen URL-eket és egyéb téves adatokat.",
  },
  {
    id: "purchase-date-estimate",
    date: "2026-06-14",
    title: "Vásárlási dátum bekerült az értékbecslésbe",
    type: "improvement",
    summary: "Pontosabb lett az értékbecslés a vásárlási dátum használatával.",
    content:
      "A RollerHub mostantól figyelembe tudja venni a vásárlás dátumát is. Ha ez meg van adva, az értékbecslés pontosabban tud számolni, mint pusztán az évjárat alapján.",
  },
  {
    id: "v1-stabilization",
    date: "2026-06-18",
    title: "V1 stabilizálási kör elkészült",
    type: "improvement",
    summary:
      "A RollerHub stabilabb hibakezelést és jobb adatfrissülést kapott.",
    content:
      "Elkészült a V1 stabilizálási kör: javult a kliens oldali hibakezelés, erősebb lett a dátumvalidáció, több helyen frissülnek automatikusan az összesítők, és elkészült a belső teszt checklist.",
  },
  {
    id: "devlog-launch",
    date: "2026-06-22",
    title: "Fejlesztési napló oldal elindult",
    type: "feature",
    summary: "A RollerHub fejlesztése már nyilvánosan is követhető.",
    content:
      "Elkészült a rejtett, de publikus fejlesztési napló oldal, ahol röviden követhetőek a fontosabb funkciók, javítások és mérföldkövek.",
  },
  {
    id: "september-launch-prep",
    date: "2026-06-25",
    title: "Szeptemberi indulás előkészítése elkezdődött",
    type: "planning",
    summary: "Elindult a RollerHub V1 publikus indulásának előkészítése.",
    content:
      "A következő időszak fókusza a stabil V1 lezárása, a publikus landing oldal, a PWA előkészítés, az adatkezelési oldalak és a szeptemberi rolleres szabályváltozásokhoz kapcsolódó kommunikáció.",
  },
  {
    id: "pwa-install",
    date: "2026-06-26",
    title: "Telepíthető mobil élmény (PWA)",
    type: "feature",
    summary:
      "A RollerHub mostantól telepíthető a telefon kezdőképernyőjére, app-szerű élményként.",
    content:
      "A RollerHub már hozzáadható a kezdőképernyőhöz, és saját ablakban, alkalmazásként indul — gyorsabb elérés, letisztultabb, böngésző nélküli használat.",
  },
];
