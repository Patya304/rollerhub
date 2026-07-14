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
- magyar rolleres tudástár
- stabil publikus web/PWA alap

A termékpozicionálás:

“A rollered digitális otthona.”

## Jelenlegi készültség

Belső MVP: körülbelül 97%

Publikus V1: körülbelül 88%

Launch előkészítés: körülbelül 80%

## Kész fő modulok

### Publikus részek

- Landing page
- Fejlesztési napló `/devlog`
- Adatkezelési oldal `/privacy`
- Felhasználási feltételek `/terms`
- Publikus profil `/profile/@username` (explicit opt-in, sötét app témával)
- Bejelentkezés
- Regisztráció
- PWA manifest és ikonok alapja

### Bejelentkezett app

- App layout
- Sidebar navigáció (Profilom menüponttal a Tudástár és Beállítások között)
- Dashboard áttekintés valódi adatokkal
- Garázs (egyszerűsített, lépésenkénti roller hozzáadás: márka/modell katalógus + Egyéb)
- Roller adatlap (rolleronkénti „Publikus a profilomon" kapcsolóval)
- Szervizkönyv
- Globális Szerviz oldal
- Értékbecslés
- Értéktörténet
- Menetnapló
- Tudástár (4 olvasható cikkel: KRESZ, biztosítás, jogosítvány, szabályok)
- Profilom `/profile/me` (profilkép, username, név, bio, publikus profil kapcsoló, élő előnézet)
- Beállítások (csak megjelenés, nyelv, fiók; a profil mezők a Profilomra kerültek)

## Friss változások (2026. július)

- Soft launch polish batch: minden publikus oldal (landing, sign-in, sign-up, devlog, privacy, terms) fix black-orange témát kapott, nincs több fehér oldal; devlog badge színek sötét témára igazítva
- Onboarding gyorsítás: a dashboard „Első roller hozzáadása" CTA `?add=1`-gyel azonnal a wizarddal nyitja a garázst; szerviz form alapból mai dátummal indul; menet form egy roller esetén előválaszt és az indulást mostani időponttal tölti ki
- Egyszerűsített roller hozzáadás wizard (`ScooterAddWizard`, scooter-catalog modul)
- Publikus profil v1, majd explicit privacy: `profileIsPublic` + rolleronkénti `isPublic`, minden alapból privát
- Új `bio` mező, Profilom oldal, settings/profil szétválasztás
- `/pricing`, `/sample-report`, `/profile/@username` téma-wrapper (nem fehér oldal)
- Preview/AI review egységesítés: közös presentational komponensek (RideListItem, ServiceListItem, PublicProfileView, ProfileIdentity, SettingsProfilePointer), review index a `/preview/app`-on
- Migration: `add_public_profile_privacy`

## Következő ajánlott lépés

1. Commit + push + deploy, majd live audit (TASKS.md P0 első pontjai)
2. Utána autonóm P0 batch az `AUTONOMOUS_WORKFLOW.md` szerint

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
- `bio`
- `profileIsPublic` (default: false)
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
- `isPublic` (default: false)

## Jelenlegi Settings / Profilom állapot

A profil jellegű mezők (profilkép, username, név, bio, publikus profil kapcsoló) a `/profile/me` Profilom oldalra kerültek (`ProfileForm`).

A Settings oldalon maradt:

- Profilom mutató kártya
- theme választás
- nyelvi preferencia
- fiók és biztonság (email, jelszó/fióktörlés: hamarosan)

Mindkettő ugyanazt a `PATCH /api/settings` végpontot használja részleges payloaddal.

Theme opciók:

- `default`
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

## App UI állapota

A bejelentkezett app megkapta a digitális garázs designt:

- APK-inspirált uppercase labelek, font-mono értékek, divide-y panel listák
- AppPage / AppPageHeader / AppPanelList / AppListItem / AppSection / FieldList közös primitívek
- `AppListItem` disabled állapotban nem mutat nyilat, nem kattintható
- Onboarding empty state-ek dashboard-on és garázsban
- Témák ténylegesen alkalmazódnak (data-theme wrapper)

## Preview app állapota

A `/preview/app` a review belépő (embernek és AI-nak):

- Nincs auth, nincs Prisma, nincs API/fetch hívás
- `src/modules/preview/demo-data.ts` — centralizált mock adatok
- `PreviewAppShell` — saját sidebar, nem importálja az authos layout-ot
- Route-ok: dashboard (review indexszel), garázs, demo-ruptor adatlap, szerviz, menetnapló, értékbecslés, tudástár, profil (me/public), beállítások
- A valódi presentational komponenseket használja (ScooterAddWizard, RideListItem, ServiceListItem, PublicProfileView, ProfileIdentity, SettingsProfilePointer, GarageVehicleListItem, DashboardSummaryPanel, VehicleHero)
- `data-theme="black-orange"` fix a layout wrapperen
- Minden interakció disabled/statikus, csak megtekintésre

## Premium validációs alap

- `/pricing` oldal — Free és Premium csomag (Premium: Hamarosan)
- `/sample-report` — publikus minta értékriport, bejelentkezés nélkül
- Roller adatlapon értékriport előnézet (ársáv, checklist, tipp)
- Dashboard Premium teaser

Ez nem fizetős rendszer — a funkciók validációja és előkészítése zajlik.

## Jelenlegi fókusz

Aktuális fő irány:

1. soft launch — első külső felhasználói tesztek
2. saját domaines email + Resend setup
3. email verification
4. password reset
5. PWA polish
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
- tudástár források friss ellenőrzése
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

Az autonóm munkarend leírása: `AUTONOMOUS_WORKFLOW.md`.

Röviden: TASKS.md-ből P0/P1 feladat → rövid terv → kis batch → build/lint/prisma → összefoglaló → megállás commit előtt. Engedélyköteles: schema/migration, package, auth/payment, route törlés, nagy redesign.

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
