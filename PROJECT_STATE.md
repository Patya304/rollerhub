# RollerHub Project State

## Élő verzió

A RollerHub jelenleg Vercelen elérhető:

https://rollerhub.vercel.app

## Projekt célja

A RollerHub egy elektromos roller “digitális garázs” webapp.

A V1 célja:

- roller nyilvántartás
- szervizkönyv
- értékbecslés
- értéktörténet
- menetnapló
- dashboard összesítők
- magyar rolleres tudásközpont
- stabil publikus web/PWA alap

A termékpozicionálás:

“A rollered digitális otthona.”

## Jelenlegi készültség

Belső MVP: körülbelül 95%

Publikus V1: körülbelül 80%

Launch előkészítés: körülbelül 65–70%

## Kész fő modulok

### Publikus részek

- Landing page
- Fejlesztési napló `/devlog`
- Adatkezelési oldal `/privacy`
- Felhasználási feltételek `/terms`
- Bejelentkezés
- Regisztráció
- PWA manifest és ikonok alapja

### Bejelentkezett app

- App layout
- Sidebar navigáció
- Dashboard áttekintés valódi adatokkal
- Garázs
- Roller adatlap
- Szervizkönyv
- Globális Szerviz oldal
- Értékbecslés
- Értéktörténet
- Menetnapló
- Tudásközpont
- Beállítások alap

## Kész technikai alapok

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Prisma 7
- Neon Postgres
- Better Auth
- Zod validáció
- Vercel deploy
- Modular monolith struktúra
- Service layer minták
- Prisma migrationök
- Soft delete a Scooter modellen
- Értékbecslés közös util alapján
- ValueEstimate dedup szabály
- Settings adatmodell alap
- Theme engine aktív (`data-theme` wrapper alapján)

## Fontos modellek

- `User`
- `Scooter`
- `Service`
- `Ride`
- `ValueEstimate`
- `Session`
- `Account`
- `Verification`

## User modell releváns mezők

- `email`
- `name`
- `image`
- `username`
- `preferredLanguage`
- `theme`
- `emailVerified`

## Scooter modell releváns mezők

- `brand`
- `model`
- `color`
- `serialNumber`
- `year`
- `purchaseDate`
- `purchasePrice`
- `currentMileage`
- `batteryCapacity`
- `topSpeed`
- `rangeKm`
- `photoUrl`
- `notes`

## Jelenlegi Settings állapot

A Settings alap elkészült.

Van:

- profil adatok
- username
- profilkép URL
- nyelvi preferencia
- theme választás

Theme opciók:

- `black-white`
- `black-orange`
- `black-blue`

A theme menthető és ténylegesen alkalmazódik az app felületén: a `data-theme` wrapper alapján a sidebar, a kártyák, a gombok és a háttér is a kiválasztott témát kapja.

## Premium irány állapota

Az első Premium / monetizációs validációs alap elkészült:

- `/pricing` oldal — Free és Premium csomag bemutatása
- Értékriport előnézet a roller adatlapon (ársáv, checklist, eladási tipp)
- Dashboard Premium teaser card
- `/sample-report` — publikus minta értékriport, bejelentkezés nélkül is megtekinthető

Ez nem fizetős rendszer — a Premium funkciók előkészítése és piacvalidációja.

## Jelenlegi fókusz

Aktuális fő irány:

1. saját domaines email + Resend setup
2. email verification
3. password reset
4. PWA polish
5. soft launch teszt
6. később AI-segített roller katalógus

## Fontos közeljövőbeli feladatok

### Rövid táv

- Saját email cím kiválasztása
- Resend előkészítése
- Better Auth email verification
- Password reset flow
- Mobilnézet kézi teszt
- Vercel production env ellenőrzés

### Középtáv

- PWA polish
- soft launch 5–10 tesztelővel
- landing page további polish
- tudásközpont források friss ellenőrzése
- privacy/terms véglegesítés saját emaillel

### Később / Premium irány

- PDF állapotlap generálás (Premium)
- Szerviz emlékeztetők (Premium)
- Export / adatmentés (Premium)
- AI-segített roller katalógus
- seedelt roller katalógus
- profilkép feltöltés
- teljes többnyelvű felület
- dokumentumtár
- akku állapot becslés

## Halasztott funkciók

Ne építsük most kérés nélkül:

- fórum
- közösségi feed
- GPS tracking
- Bluetooth tracking
- dokumentumtár
- előfizetés
- natív Android/iOS app
- teljes i18n rendszer
- admin panel
- teljes AI katalógus

## AI roller katalógus koncepció

Későbbi irány:

A user kiválaszthat rollert katalógusból.

Ha nincs benne, AI segíthet felismerni a modellt.

A flow:

1. user keres márkát/modellt
2. ha nincs találat, egyedi / AI felismerés
3. AI javasol modellt és verziót
4. user jóváhagyja vagy módosítja
5. saját rollerként mentés
6. AI javaslat bekerülhet katalógusba `unverified` státusszal
7. később admin vagy ellenőrzés után `verified`

Fontos:

Az AI ne mentsen automatikusan “hivatalos igazságként”.

## Devlog szabály

A devlog publikus és a footerből elérhető.

Devlogba csak user számára is érthető változás kerüljön.

Mehet:

- új funkció
- user által érzékelhető javítás
- stabilitási javítás
- roadmap/launch mérföldkő

Ne menjen:

- import fix
- lint fix
- belső apró refaktor
- fájl átnevezés
- Claude / ChatGPT említés
- secret / `.env` / belső biztonsági részlet

## Ismert buktatók

- Prisma 7 kliens import:
  `@/generated/prisma/client`

- Generált Prisma enum import kerülendő.

- Migration után:

  - `npx prisma generate`
  - TypeScript server restart
  - `.next` törlése, ha furcsa type cache hiba van
  - dev server újraindítása

- Husky/lint-staged lint hibánál visszavonhatja a commitot.

- React hook warningoknál figyelni kell a meglévő mintákra.

- Dinamikus route mappák:
  `[id]`, `[rideId]`

- `.env`, database URL, auth secret soha ne kerüljön ZIP-be vagy commitba.

## Javasolt Claude workflow

Egy Claude Project legyen:

`RollerHub`

Ne hozz létre új Projectet minden feature után.

Új chat kell minden nagyobb feladathoz ugyanazon Projecten belül.

Feladat előtt:

- először tervet kérni
- mely fájlok módosulnak
- milyen sorrendben
- van-e migration
- Opus High vagy Sonnet/normál mód kell-e

Feladat után:

- build/lint/prisma ellenőrzés
- devlog javaslat, ha releváns
- rövid összefoglaló
- commit
- PROJECT_STATE.md frissítés, ha nagyobb változás történt

## Ajánlott teszt parancsok

```bash
npm run build
npm run lint
npx prisma validate
npx prisma migrate status
```

## ZIP készítés auditáláshoz

A fejlesztő a projekt gyökérmappájából készít tiszta ZIP-et, amely nem tartalmazza:

- `.env`
- `.next`
- `node_modules`
- `.git`

Csak source fájlokat és konfigurációkat.
