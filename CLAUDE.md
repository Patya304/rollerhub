@AGENTS.md

# RollerHub Claude Instructions

A RollerHub egy elektromos rolleres „digitális garázs" webapp.

Fő termékirány: digitális garázs, szervizkönyv, menetnapló, értékbecslés, Tudástár, publikus profil.

Cél: stabil, solo dev által fenntartható alkalmazás.

## Kapcsolódó dokumentumok

Autonóm munka előtt olvasd el:

- `ROADMAP.md` — merre tart a termék
- `PRODUCT_PRINCIPLES.md` — termék- és UX-elvek
- `AUTONOMOUS_WORKFLOW.md` — hogyan dolgozz batchben, mihez kell engedély
- `TASKS.md` — priorizált backlog (P0/P1/P2/PARKOLÓ)
- `PROJECT_STATE.md` — jelenlegi állapot
- `SOFT_LAUNCH_QA.md` — kézi tesztlista

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

Moduláris monolit. A fő üzleti logika a `src/modules` alatt van. Tartsd meg ezt a struktúrát.

Ne vezess be microservice-t, NestJS-t, event bus-t, komplex DI frameworköt vagy felesleges enterprise mintát.

## UX elvek

- Appos élmény, nem admin panel.
- Az első 3 perc legyen egyszerű: kevés kötelező input.
- Mobilbarát (390px szélességen is használható, nincs vízszintes scroll).
- Fekete/narancs vizuális irány (`black-orange` az ajánlott téma).
- Minden belső oldal egységes app shellben, ne legyen „fehér", témátlan oldal.

## Copy elvek

- Magyar, rövid, természetes. Nincs AI-s marketing szöveg, nincs passzív hivatali stílus.
- Nincs em dash (—) user-facing szövegben.
- Kerülendő: „Demo", „Tudásközpont", „Naplózz", „Futtass", angol hibaszövegek.
- Preferált: „Demó", „Tudástár", „Profilom", „rollereid", „szervizkönyv", „menetnapló", „Km-állás", „Becsült érték".
- API hibaüzenetek mindig magyarul.

## Privacy / security

- Minden privát alapból.
- Publikus profil: explicit opt-in (`User.profileIsPublic`), username nélkül nem kapcsolható be.
- Roller publikus megjelenés: rolleronkénti explicit opt-in (`Scooter.isPublic`).
- Publikus oldalon SOHA: email, user id, token/session/account adat, alvázszám, notes, vételár, vásárlás dátuma, becsült érték, törölt user/roller.
- Privát profil kívülről megkülönböztethetetlen a nem létezőtől (notFound).
- Ne kérj `.env`-t, database URL-t, secretet. Ne logold az auth secretet.
- Ne nyúlj production env változókhoz és auth flow-hoz kérés nélkül.

## Publikus demó szabály

A `/preview/app` demóalkalmazás megszűnt. Az egyetlen bejelentkezés nélküli bemutatóoldal a `/sample-report`:

- csak hardcoded mock adat, nincs Prisma és nincs mentés
- a valódi presentational komponenseket használja (pl. `SaleReport`)
- tilos User-Agent bypass vagy bármilyen login bypass
- ne építs új preview route-okat és ne tarts fenn preview-paritást

## Prisma szabályok

- Prisma schema módosítás és migration CSAK külön engedéllyel.
- Kliens import: `@/generated/prisma/client`
- Generált Prisma enum import kerülendő; UI/logikai rétegben saját const/union.
- Dinamikus route mappák: `[id]`, `[rideId]`
- Schema változás után: `npx prisma generate`, majd szükség esetén TS server restart, `.next` törlés, dev server újraindítás.

## Munkamódszer

- Először értsd meg a feladatot; ha nem világos, kérdezz.
- Kis, commitolható batchekben dolgozz.
- Több fájl esetén előbb írd le a sorrendet.
- Ne építs új mellékfunkciót és ne refaktorálj nagy területet kérés nélkül.
- Batch végén KÖTELEZŐ futtatni:

```bash
npm run build
npm run lint
npx prisma validate
```

- Ha migration is volt: `npx prisma migrate status`
- Commit előtt mindig állj meg és kérj jóváhagyást.

## Devlog szabály

User számára fontos változásnál javasolj devlog bejegyzést, de ne írd be automatikusan.

Mehet: új funkció, user által érzékelhető javítás, stabilitási javítás, launch mérföldkő.

Nem mehet: import/lint fix, apró refaktor, fájl átnevezés, AI/prompt említés, secret/belső biztonsági részlet.

Formátum:

```txt
Devlog javaslat:
- type:
- title:
- summary:
- content:
- miért érdemes publikálni:
```

## AI mód használat

Opus High: architektúra/adatmodell döntés, nehéz bug, biztonsági kockázat, nagy refaktor review, új nagy feature terv.

Sonnet / normál: konkrét kódolás, UI, Tailwind, kis refaktor, szövegcsere.

## Chat lezárási szabály

„Na akkor foglald össze" parancsra ne kódolj, hanem adj strukturált lezáró összefoglalót: cél, elkészült munka, módosult fájlok, schema/migration változás, új dependency, futtatandó tesztek, nyitott hibák, devlog javaslat, PROJECT_STATE.md frissítés kell-e, commit üzenet javaslat.

## Amit most ne építs kérés nélkül

- Full marketplace
- Fórum, komment, moderation
- Chat/üzenetküldés, friend rendszer
- GPS/Bluetooth tracking
- Teljes i18n rendszer
- Profilkép feltöltés
- Előfizetés/fizetés
- Natív mobil app
- AI roller katalógus teljes verziója
- Admin panel
