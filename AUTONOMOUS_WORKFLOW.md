# RollerHub Autonomous Workflow

Hogyan dolgozz autonóm batchben, minimális mikromenedzsmenttel.

## Batch menete

1. Olvasd el a releváns dokumentumokat:
   - `CLAUDE.md`
   - `ROADMAP.md`
   - `PRODUCT_PRINCIPLES.md`
   - `TASKS.md`
   - `PROJECT_STATE.md`
2. Válassz egy P0 vagy P1 feladatot a `TASKS.md`-ből (P0 előbb).
3. Készíts rövid tervet: érintett fájlok, sorrend, kell-e engedély.
4. Csak kis, commitolható batchben dolgozz. Egy batch = egy feladat.
5. Módosítsd a szükséges fájlokat.
6. Futtasd:

```bash
npm run build
npm run lint
npx prisma validate
```

7. Ha hiba van, javítsd és futtasd újra.
8. Írj végső összefoglalót (mi változott, mely fájlok, teszteredmények, nyitott kérdések).
9. Commit előtt állj meg és kérj jóváhagyást.

## Mit tehetsz önállóan

- Copy polish (a CLAUDE.md copy elvei szerint)
- UI konzisztencia javítás
- Kisebb komponens refaktor
- App shell konzisztencia
- Read-only presentational komponensek közösítése
- Dokumentáció frissítés (ROADMAP, TASKS, PROJECT_STATE)
- Nem veszélyes bugfix

## Mihez kell jóváhagyás

- Prisma schema módosítás
- Migration futtatás
- Package install
- Auth módosítás
- Payment módosítás
- Bármi, ami adatvesztéssel járhat
- Route törlés
- Nagy redesign
- Marketplace/chat/friend rendszer építés
- Production adatot érintő változás

## Tiltott

- User-Agent bypass
- Login bypass
- Production user adat mock/demó oldalon
- Token vagy secret commitolása
- `git reset --hard`
- `git clean -fd`
- Tömeges törlés jóváhagyás nélkül

## Acceptance criteria minden batchhez

- `npm run build` zöld
- `npm run lint` zöld
- `npx prisma validate` zöld
- Nincs auth/Prisma import és mentés a `/sample-report` mock oldalon
- Nincs user-facing angol hibaszöveg magyar UI-ban
- Nincs fehér, shellből/témából kilógó belső oldal
- A végső összefoglaló konkrét: fájlok, változások, teszteredmény, nyitott kérdés

## Batch utáni karbantartás

- `TASKS.md`: kész feladatot jelöld készre, új felfedezett feladatot vedd fel prioritással.
- `PROJECT_STATE.md`: nagyobb változásnál frissítsd röviden.
- Devlog: ha user által érzékelhető a változás, adj devlog javaslatot (ne írd be magad).
