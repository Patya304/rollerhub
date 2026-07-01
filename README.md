# RollerHub

A RollerHub egy elektromos roller “digitális garázs” webapp.

A cél, hogy a felhasználók egy helyen tudják nyilvántartani a rollereiket, azok szerviztörténetét, menetadatait, becsült értékét és a fontosabb rolleres tudnivalókat.

Élő verzió:

https://rollerhub.vercel.app

## Fő funkciók

- Felhasználói regisztráció és belépés
- Digitális garázs rollerekhez
- Roller adatlap
- Szervizkönyv
- Globális szerviz áttekintő
- Értékbecslés és értéktörténet
- Menetnapló
- Dashboard összesítők
- Magyar e-roller tudásközpont
- Fejlesztési napló
- Adatkezelési és felhasználási oldalak
- PWA alap
- Beállítások alap:

  - felhasználónév
  - profilkép URL
  - téma választás
  - nyelvi preferencia

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Prisma 7
- Neon Postgres
- Better Auth
- Vercel
- Zod validáció

## Architektúra

A projekt moduláris monolitként épül.

A fő modulok a `src/modules` mappában találhatók.

Példák:

- `src/modules/garage`
- `src/modules/services`
- `src/modules/value`
- `src/modules/rides`
- `src/modules/dashboard`
- `src/modules/settings`
- `src/modules/devlog`

Az app route-ok a `src/app` alatt vannak.

A bejelentkezett felület a `src/app/(app)` route group alatt található.

## Fontos útvonalak

Publikus:

- `/`
- `/sign-in`
- `/sign-up`
- `/devlog`
- `/privacy`
- `/terms`

Bejelentkezés után:

- `/dashboard`
- `/garage`
- `/garage/[id]`
- `/service`
- `/rides`
- `/value`
- `/knowledge`
- `/settings`

## Adatmodell

A fő Prisma modellek:

- `User`
- `Scooter`
- `Service`
- `Ride`
- `ValueEstimate`
- `Session`
- `Account`
- `Verification`

A `User` modell tartalmazza a későbbi közösségi és beállítási alapokat:

- `username`
- `image`
- `preferredLanguage`
- `theme`

A `Scooter` modell tartalmazza a roller alapadatait, például:

- márka
- modell
- szín
- alvázszám
- évjárat
- vásárlási dátum
- vételár
- kilométeróra állás
- akkumulátor kapacitás
- végsebesség
- hatótáv
- kép URL
- megjegyzés

## Fontos technikai döntések

- Prisma 7 kliens import:
  `@/generated/prisma/client`

- A generált Prisma enum importja kerülendő.
  Saját const/union fájlokat használunk, ahol szükséges.

- A ServiceType enum Prisma oldalon létezik, de UI/logikai oldalon saját mapping használható.

- A validáció Zod sémákkal történik.

- A dinamikus route mappák mindig szögletes zárójelet használnak:
  `[id]`, `[rideId]`

- A `.env`, `.next`, `node_modules` és `.git` nem kerülhet ZIP-be vagy publikus feltöltésbe.

## Fejlesztés

Development server indítása:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Prisma validáció:

```bash
npx prisma validate
```

Migration státusz:

```bash
npx prisma migrate status
```

Prisma Studio:

```bash
npx prisma studio
```

## Deployment

A projekt Vercelre van célozva.

Adatbázis: Neon Postgres.

Fontos environment változók Vercelen:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`, ha használva van
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- később:

  - `RESEND_API_KEY`
  - `EMAIL_FROM`

## Jelenlegi állapot

A RollerHub V1 magja él és elérhető: https://rollerhub.vercel.app

Elkészült:

- Digitális garázs designnyelv (dark témák, APK-inspirált UI)
- Onboarding empty state-ek új usereknek
- Premium validációs alap: `/pricing`, `/sample-report`, értékriport előnézet

Következő lépések:

- Soft launch első külső tesztelőkkel
- Saját domaines email + Resend
- Email verification és password reset
- PWA polish

## Halasztott funkciók

- Dokumentumtár
- Fórum
- GPS/Bluetooth tracking
- Teljes többnyelvű felület
- Profilkép feltöltés
- Előfizetés
- Natív Android/iOS app
- AI-segített katalógus teljes verziója

## Termékpozicionálás

A RollerHub V1 fókusza:

Digitális garázs + szervizkönyv + értékbecslés + menetnapló + tudásközpont elektromos rollerekhez.

Nem Strava-klón.
Nem fórum.
Nem GPS tracker.
Nem AI-first app.

A fő cél, hogy a felhasználó 2 perc alatt fel tudja vinni a rollerét, és utána lássa annak állapotát, értékét, szerviztörténetét és fontosabb adatait.
