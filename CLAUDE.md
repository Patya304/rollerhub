@AGENTS.md

# RollerHub Claude Instructions

A RollerHub egy elektromos roller “digitális garázs” webapp.

A cél egy stabil, solo dev által fenntartható alkalmazás fejlesztése, ahol a felhasználók nyilvántarthatják a rollereiket, azok szerviztörténetét, menetadatait, becsült értékét és a fontosabb rolleres tudnivalókat.

## Nyelv

Mindig magyarul kommunikálj a fejlesztővel.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Prisma 7
- Neon Postgres
- Better Auth
- Vercel
- Zod

## Architektúra

A projekt moduláris monolit.

A fő üzleti logika a `src/modules` alatt van.

Tartsd meg ezt a struktúrát.

Ne vezess be microservice-t, NestJS-t, event bus-t, komplex DI frameworköt vagy felesleges enterprise mintát.

Solo dev projektről van szó, ezért az egyszerű, fenntartható megoldásokat részesítsd előnyben.

## Munkamódszer

- Ne kezdj rögtön kódolni.
- Először értsd meg a feladatot.
- Ha nem világos valami, kérdezz vissza.
- Egy lépésben lehetőleg egy fájlt módosíts.
- Mindig teljes fájlt adj vissza, ne snippeteket.
- Ne írj olyat, hogy “ide szúrd be”.
- Ne építs új mellékfunkciót kérés nélkül.
- Ne refaktorálj át nagy területeket engedély nélkül.
- Ha a feladat több fájlt érint, először írd le a sorrendet.
- Egy lépés után álljunk meg és teszteljünk.

## Tesztelés

Változtatás után mondd meg, mely parancsokat kell futtatni.

Alap parancsok:

```bash
npm run build
npm run lint
npx prisma validate
```

Ha migration is volt:

```bash
npx prisma migrate status
```

Ha Prisma schema változott, emlékeztesd a fejlesztőt:

```bash
npx prisma generate
```

Majd szükség esetén:

- TypeScript server restart
- `.next` törlése
- dev server újraindítása

## Prisma szabályok

Prisma 7 kliens import:

```ts
@/generated/prisma/client
```

Ne használd automatikusan a régi Prisma import mintákat, ha azok nem illenek a projekthez.

A generált Prisma enum importja megbízhatatlan lehet. UI/logikai rétegben saját const/union fájlokat használunk, ha szükséges.

Dinamikus route mappák mindig szögletes zárójelet használnak:

```txt
[id]
[rideId]
```

## Biztonság

- Ne kérj `.env` fájlt.
- Ne kérj database URL-t.
- Ne kérj secretet.
- Ne írd ki vagy logold ki az auth secretet.
- Ne nyúlj production env változókhoz kérés nélkül.
- Ne építs auth flow módosítást külön kérés nélkül.

## Jelenlegi fő modulok

- Landing page
- Auth alap
- Dashboard áttekintés
- Garázs
- Roller adatlap
- Szervizkönyv
- Globális Szerviz oldal
- Értékbecslés
- Értéktörténet
- Menetnapló
- Tudásközpont
- Fejlesztési napló
- Privacy oldal
- Terms oldal
- PWA alap
- Settings alap

## Settings jelenlegi állapot

A User modell tartalmazza:

- `username`
- `image`
- `preferredLanguage`
- `theme`

A Settings oldalon cél:

- profil adatok
- felhasználónév
- profilkép URL
- téma választás
- nyelvi preferencia

Jelenlegi témák:

- `black-white`
- `black-orange`
- `black-blue`

Fontos: a theme mentése már létezik, de a teljes theme engine / tényleges alkalmazás még külön fejlesztési feladat lehet.

## Devlog szabály

Ha egy változás user számára is fontos, javasolj devlog bejegyzést.

Ne írd be automatikusan a devlogba, csak javasolj.

Publikus devlogba kerülhet:

- új funkció
- user által érzékelhető javítás
- stabilitási javítás
- fontos roadmap vagy launch mérföldkő

Ne kerüljön devlogba:

- import javítás
- lint javítás
- apró refaktor
- fájl átnevezés
- belső technikai takarítás
- ChatGPT / Claude / prompt említés
- secret / `.env` / adatbázis URL / belső biztonsági részlet

Devlog javaslat formátuma:

```txt
Devlog javaslat:
- type:
- title:
- summary:
- content:
- miért érdemes publikálni:
```

## AI mód használat

Opus High módot csak ezekhez használjunk:

- architektúra döntés
- adatmodell döntés
- nehéz bug
- biztonsági/logikai kockázat
- nagy refaktor előtti review
- új nagy feature tervezése

Sonnet / normál mód elég ezekhez:

- konkrét kódolás
- UI módosítás
- Tailwind/CSS
- kisebb refaktor
- egyfájlos módosítás
- szövegcsere
- Card/layout polish

Ne pazaroljuk az Opus High módot egyszerű UI vagy kis kódmódosításokra.

## Jelenlegi fókusz

A RollerHub V1 stabil alapja már működik.

Következő irányok:

- Settings theme tényleges alkalmazása
- Beállítások polish
- saját email cím
- email verification
- password reset
- PWA polish
- soft launch előkészítés
- később AI-segített roller katalógus

## Chat lezárási szabály

Mivel minden nagyobb feladatot külön chatben végzünk, a fejlesztési kör végén a fejlesztő használhatja ezt a parancsot:

"Na akkor foglald össze"

Ha ezt látod, ne kezdj új kódolásba. Készíts rövid, strukturált lezáró összefoglalót.

Az összefoglaló tartalmazza:

1. Röviden mi volt a feladat célja.
2. Mit sikerült elkészíteni.
3. Mely fájlok módosultak vagy jöttek létre.
4. Volt-e adatbázis / Prisma schema / migration változás.
5. Került-e be új package vagy dependency.
6. Milyen teszteket kell futtatni vagy futtattunk:

   - npm run build
   - npm run lint
   - npx prisma validate
   - ha volt migration: npx prisma migrate status

7. Van-e ismert nyitott hiba vagy félbehagyott rész.
8. Kell-e devlog bejegyzés. Ha igen, adj devlog javaslatot.
9. Kell-e frissíteni a PROJECT_STATE.md fájlt.
10. Kell-e frissíteni a Claude Project Knowledge-ben lévő fájlokat.
11. Javasolj egy rövid git commit üzenetet.

Fontos:

- Ne írj új kódot ebben a válaszban.
- Ne kezdj új feature-t.
- Ne módosíts automatikusan devlogot vagy PROJECT_STATE.md-t.
- Csak összefoglalót és javaslatokat adj.

## Amit most ne építs kérés nélkül

- Dokumentumtár
- Fórum
- GPS/Bluetooth tracking
- Teljes i18n rendszer
- Profilkép feltöltés
- Előfizetés
- Natív mobil app
- AI roller katalógus teljes verziója
- Admin panel
