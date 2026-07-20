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

- Á1 batch: Eladási állapotlap véglegesítve. Új `SaleReport` Prisma modell (rollerenként legfeljebb egy sor, `scooterId` és `publicToken` egyedi), saját, biztonságos `crypto.randomBytes(32)` alapú publikus token, (re)aktiváláskor mindig új tokent kap, régi visszavont token soha nem éled újra. Publikus route: `/report/[token]` (loading/not-found, semleges 404 minden nem-aktív/törölt/idegen esetben). Egységes elnevezés mindenhol: "Eladási állapotlap" / "Állapotlap" (a korábbi "Sale Report", "Értékriport", "Riport" elnevezések eltávolítva). Saját safe DTO (`src/modules/sale-report/dto.ts`), amit a tulajdonosi előnézet és a publikus oldal is ugyanabból épít — nincs vételár, vásárlás dátuma, alvázszám, megjegyzés, értéktörténet, értékmegőrzési %, szerviz költség/megjegyzés, ride adat, belső Service ID. Készültségi checklist: kötelező minimum márka/modell/km-állás (gyakorlatban mindig teljesül), ajánlott: fotó, évjárat, ≥1 szerviz, becslés. A megosztás független a publikus profil/roller kapcsolótól. Tulajdonosi blokk a publikus oldalon csak akkor jelenik meg, ha a profil explicit publikus és van username, saját profilképpel (`ImageWithFallback`). A régi `SaleReport` komponens (`src/modules/garage/components/sale-report.tsx`, Premium badge + PDF-ígéret placeholder) törölve, `/sample-report` és `/pricing` copy-ja frissítve az új elnevezésre.
- Á2+Á3+UX2 batch: az Eladási állapotlap publikálása mostantól snapshot-alapú, nem élő rollerből épül. `SaleReport` additív bővítés: `snapshot` (Json), `snapshotHash`, `snapshotVersion`, `publishedAt` (migráció: `add_sale_report_snapshot`). Létrehozáskor/(re)aktiváláskor és "Megosztás frissítése" művelet során épül a snapshot: élő adatból (`buildSnapshot`) → Zod validáció (`snapshot-schema.ts`) → determinisztikus SHA-256 hash (kanonikus, kulcs szerint rendezett JSON, `snapshot.ts`) → mentés. A token "Megosztás frissítése" közben sosem változik. Ha a friss snapshot hash-e megegyezik a jelenleg publikussal, nem billen a `publishedAt` és nem ígér téves "frissült" üzenetet ("A publikus állapotlap naprakész." vs. "Az állapotlap frissítve."). A tulajdonosi workspace jelzi, ha az élő előnézet eltér a publikustól ("Nem publikált módosítások vannak."). Meglévő, snapshot nélküli (legacy) aktív megosztásoknál a publikus oldal semleges 404-et ad, a tulajdonosi oldal "Az állapotlapot frissíteni kell az új publikálási formátumra." üzenetet mutatja; a frissítés a MEGLÉVŐ tokennel hozza létre az első snapshotot, revoke nélkül.
- Új `ScooterCondition` modell (rollerenként legfeljebb egy sor, `scooterId` egyedi, nincs külön `ownerId` — a jogosultság a Scooter relációján át ellenőrzött): saját, szöveges állapotfelmérés (általános állapot, akku, fékek, gumik, világítás, váz, kozmetikai állapot — `ConditionLevel`: GOOD/FAIR/NEEDS_ATTENTION), és külön ismert hibák nyilatkozat (`KnownIssuesState`: NOT_PROVIDED/NONE_REPORTED/REPORTED + szabad szöveg, max 1000 karakter). Nem hivatalos műszaki vizsgálat vagy RollerHub-tanúsítvány — a feliratok tudatosan "Jó állapot"/"Használt, megfelelő"/"Figyelmet igényel". API: `PUT /api/scooters/[id]/condition`, saját safe DTO, cross-field validáció (REPORTED-nél kötelező szöveg, NONE_REPORTED-nél tiltott). A publikus oldal új "Állapotfelmérés" szekciót mutat, a NEEDS_ATTENTION kategóriák kiemelt blokkban, mindig jelzéssel a "nem helyettesíti a személyes átvizsgálást" jellegről.
- Dedikált tulajdonosi workspace: `/garage/[id]/sale-report` (megosztás-kezelés, állapotfelmérés szerkesztése, élő előnézet, publikált állapot, "Nem publikált módosítások" jelzés egy oldalon). A roller adatlapja (`/garage/[id]`) ehhez képest csak egy kompakt összefoglaló kártyát mutat (megosztva/nincs megosztva, Alap/Részletes állapotlap szint, "Állapotlap szerkesztése" CTA), a teljes szerkesztő/előnézet logika elköltözött a dedikált oldalra.
- Á2+Á3+UX2 végső inspector javítókör: közös szerveroldali `evaluateStoredSnapshot()` helper (`stored-snapshot.ts`) dönti el, hogy egy tárolt `SaleReport` sor snapshotja valid-e (snapshot nem null, `snapshotVersion === 1`, `publishedAt` nem null, Zod parse sikeres, a snapshotból újraszámított hash egyezik a tárolt `snapshotHash`-sel) — ugyanezt használja a publikus service és a tulajdonosi state is, így a négy állapot (`missing`/`invalid`/`up_to_date`/`outdated`) mindkét oldalon konzisztens és pontosan a négy előírt szöveghez van rendelve. A `refreshShare()` mostantól csak akkor jelez naprakészt, ha a MEGLÉVŐ tárolt snapshot valid és hash-e egyezik az élővel — egy corrupt tárolt sor mindig újraírásra kerül, akkor is, ha a nyers `snapshotHash` mező véletlenül egyezne. A refresh írása feltételes `updateMany`-jel (`id` + `isActive: true` előfeltétel) történik: revoke-kal versenyezve sosem ad hamis sikert, egy párhuzamos refresh esetén pedig biztonságosan visszaolvasott, owner-konzisztens állapotot ad vissza. A snapshot szervizsorrendje mostantól determinisztikus (`performedAt` csökkenő, majd `type` növekvő, majd `odometerKm`), függetlenül a DB lekérdezés tényleges sorrendjétől — ugyanez a sorrend érvényesül a tulajdonosi élő előnézetben is. A snapshot-séma szigorodott: minden szint `.strict()` (ismeretlen mező elutasítva), `photoUrl` csak `http(s)://`, ismert hibák állapot cross-validáció a snapshotban is. Az ismert hibák állapot váltásakor (REPORTED → NONE_REPORTED/NOT_PROVIDED) a kliens azonnal törli a rejtett szöveget és a hozzá tartozó field errort; a szerver is nullázza a szöveget minden nem-REPORTED állapotnál, függetlenül a kliens által küldött tartalomtól. Mentés után a kliens a szerver által normalizált választ használja baseline-nak. A checklist linkjei a roller adatlap tényleges anchorjaira mutatnak (`/garage/[id]#fenykep`, `#roller-adatok`, `#szerviz`), a Condition-hoz kapcsolódók helyben (`#allapotfelmeres`) maradnak. A workspace-en egyetlen élő előnézet van (`#elozetes`), a panel megosztás előtti "Állapotlap megtekintése" gombja megszűnt, helyette anchor-link. Az állapotfelmérés dátuma ("Állapotfelmérés rögzítve: ...") mostantól látható a publikus/előnézeti oldalon is, ezért jogosan marad a hash részeként. A `PUT /api/scooters/[id]/condition` route váratlan/Prisma hibára semleges magyar 500-at ad, technikai részlet nélkül.
- Ebben a stabilizálási körben is megtörtént az élő Chrome + DB regresszió (friss QA felhasználóval): condition-mentés után teljes reload nélkül megjelent a "Nem publikált módosítások vannak." állapot és a NEEDS_ATTENTION kiemelés az élő előnézetben, miközben a publikus oldal még a régi tartalmat mutatta; "Megosztás frissítése" után a panel automatikusan naprakészre váltott; legacy (null snapshot) és corrupt (hash mismatch) állapotban a workspace és a garázs-összefoglaló kártya is a helyes CTA-t mutatta halott link nélkül, majd mindkettő javítható volt ugyanazzal a tokennel; két párhuzamos no-op refresh, refresh-vs-revoke verseny (revoke nyert, refresh `not_found`), revoke+reaktiválás+"elavult" refresh (az új tokenre állt rá), és elavult token DELETE (nem érintette az új tokent) szkriptelt teszttel igazolva; privacy grep és `noindex`/`no-referrer` metaadat is tiszta maradt; console/hydration hiba nem jelentkezett. A QA felhasználó (roller, condition, report) a teszt végén teljesen törölve lett, árva rekord nélkül, a védett auditrekordok és a valós felhasználó változatlan.
- Ebben a körben megtörtént a valódi Chrome + DB regresszió: friss QA felhasználóval és rollerrel tesztelve snapshot létrehozás/frissítés/idempotencia, refresh-revoke versenyhelyzet (revoke nyer → refresh 404, nincs hamis siker), két párhuzamos refresh (azonos hash, token, publishedAt), reaktiválás (új token, régi token véglegesen 404, friss élő adatból épült snapshot), három corrupt snapshot forgatókönyv (Zod-invalid JSON, hash mismatch, snapshotVersion mismatch — mindhárom publikusan semleges 404-et ad, tulajdonosi oldalon a "nem olvashatók" üzenetet mutatja, majd `Megosztás frissítése` ugyanazzal a tokennel javítja), legacy (snapshot nélküli) aktív report ugyanígy javítható, determinisztikus szervizsorrend azonos `performedAt` mellett (`BATTERY`/`BRAKE_CHANGE`/`TIRE_CHANGE` sorrendben, stabil két egymást követő frissítés között), publikus HTML privacy grep (nincs email/ownerId/scooterId/serviceId/purchasePrice/stb, a token csak az URL-ben/Next routing payloadban jelenik meg, cím/leírásban nem), és 390px konténerszorításos overflow-teszt (workspace és publikus oldal is `scrollWidth === clientWidth`). A teszt végén a QA felhasználó (roller, condition, report, 3 service) teljes egészében törölve lett cascade-del, árva rekord nem maradt, a három korábban auditált védett rekord és a valódi felhasználói fiók változatlan. Nem történt meg: teljes 62 tételes checklist tételenkénti végigpipálása és valódi 390px-es fizikai eszközön történő teszt (ez utóbbi a fejlesztői környezet korlátja miatt továbbra sem lehetséges, csak a konténerszorításos heurisztika áll rendelkezésre).
- Á2+Á3+UX2 végső pre-commit stabilizálás: a `SaleReportPanel` render-fázisú state-igazítást használ (React ajánlott mintája props->state szinkronra) ahelyett, hogy `useEffect`-ben hívna setState-et — a friss `initialReport`/`initialSnapshotStatus` szerverpropok (pl. `router.refresh()` után) automatikusan felülírják a helyi state-et érték szerinti összehasonlítással, referenciafüggés és effect-kaszkád nélkül. A "Megosztva" állítás, a publikus megnyitás és a linkmásolás gomb mostantól csak akkor jelenik meg, ha a snapshot ténylegesen olvasható (`up_to_date`/`outdated`) — `missing`/`invalid` esetén sosem renderelődik halott link, helyette "Állapotlap frissítése"/"Állapotlap újrapublikálása" elsődleges CTA. A `refreshShare()` optimista concurrency markerként a beolvasott `publicToken`+`updatedAt` párost használja a feltételes update-ben; a "változatlan tartalom" no-op ág mostantól friss visszaolvasással igazolja a naprakész állapotot ahelyett, hogy a kezdeti olvasásban bízna; legfeljebb egy belső újrapróbálkozás fut (nincs korlátlan rekurzió), különben `conflict` státusz (409, "Az adatok közben megváltoztak. Próbáld újra."). A DELETE (`revokeShare`) mostantól megköveteli a kliens által látott `publicToken`-t a bodyban, és csak arra a pontos tokenre vonja vissza a megosztást — egy elavult böngészőfül soha nem vonhatja vissza egy időközben (revoke+reaktiválás után) keletkezett ÚJ tokent (élő teszttel igazolva). A snapshot-séma szigorodott: `knownIssues` mezőszinten `.trim().min(1).max(1000).nullable()`, ezért whitespace-only szöveg és üres string sem fogadható el semmilyen állapotnál; új, kanonikus ISO UTC dátumséma (`isoUtcDateTimeSchema`) round-trip összehasonlítással szűri ki a naptárilag nem létező dátumokat (pl. február 30, nem szökőévi február 29), amit `z.string().datetime()` formátumellenőrzése önmagában nem vett volna észre. A `ConditionForm` mentés közben minden mezőt (kategória gombok, ismert hibák állapot, textarea, submit) letilt, és gépeléskor/kategóriaváltáskor törli a hozzá tartozó mezőhibát. A panel PATCH/DELETE hiba esetén `router.refresh()`-t hív, hogy a következő szerverprop-szinkron a valódi állapotot vegye át, optimista siker beállítása nélkül.
- Á1 inspector javítókör: a `Megosztás frissítése` explicit `updatedAt: new Date()`-et állít be (korábban üres `data: {}` update nem billentette a `@updatedAt` mezőt, régi és új timestamp összehasonlítással igazolva). Minden report-műveletnél (lekérdezés, létrehozás, frissítés) explicit `ownerId` egyezés ellenőrzés, a publikus lekérdezés pedig `report.ownerId === scooter.userId` egyezést is ellenőriz build előtt (eltérésnél semleges 404, szkriptelt teszttel igazolva). `/report` layout `robots: noindex/nofollow/nocache` + `referrer: no-referrer` metadata. Linkmásolás sikere a live regionban is bemondja: "Link másolva".
- Á1 végső pre-commit javítókör: `createOrReactivateShare` mostantól idempotens (már aktív megosztásnál ismételt POST nem generál új tokent, nem billenti az `updatedAt`-et; konkurens POST-ok feltételes `updateMany`/egyedi constraint utáni újraolvasással ugyanarra a ténylegesen aktív tokenre konvergálnak — élő API-hívással is igazolva). Minden állapotlap-dátum explicit `Europe/Budapest` időzónával formázódik (tulajdonosi panel és publikus oldal is). A linkmásolás állapota (`copied`/success/error) teljes életciklust kapott: minden új művelet törli a régit, sikeres másolás után csak akkor törlődik a success üzenet, ha időközben nem jelent meg másik, a timeout unmountkor takarítva.
- G3/S1/E1 batch: rollerfotó és publikus roller adatlap véglegesítve, szervizkönyv soft delete-re állt át (szerkeszthető, törléskor `deletedAt`), értékbecslés stabilizálva. Részletek lent.
- Rollerfotó külön `Fénykép` blokk a roller adatlapon (`ScooterPhotoEditor`), URL-alapú v1 (nincs storage SDK a repóban), broken-image fallback mindenhol (`ImageWithFallback`)
- Roller publikus kapcsoló külön `Publikus megjelenés` blokk (`ScooterVisibility`), 4 privacy-kombináció szövegezve, link másolás
- Új publikus roller adatlap: `/profile/[username]/scooters/[id]`, csak biztonságos mezők
- `Service` modell soft delete-et kapott (`deletedAt`, `updatedAt`), migration: `service_soft_delete`; szerviz szerkeszthető (`PATCH /api/services/[serviceId]`), törlés natív `confirm()` nélkül
- Értékbecslés: `-0 Ft`/NaN% védelem a `/value` oldalon, dedup visszajelzés (`saved` API mező), rövid disclaimer copy
- Roller katalógus v2: márkánként külön fájl (`src/modules/scooter-catalog/brands/`), 10 márka (Ninebot, Xiaomi, Ruptor, Kugoo, Kukirin, Nami, Kaabo, Dualtron, Inmotion, VSett), modellenként stabil `id` slug, változat/piac jelölés (pl. Max G2 E, 4 Pro vs 4 Pro 2nd Gen külön), és előkészített meta mezők (category, insuranceRequired, helmetRecommended, licenseCategory, notes) — az UI a meta mezőket még nem használja; a category termékkategória, nem jogi besorolás
- Katalógus adatpolitika: gyári adat csak hivatalos gyártói forrásból, `sourceUrls` + `verifiedAt` + `specsVerified` mezőkkel; jelenleg 5 ellenőrzött modell (Ninebot Max G2 E, F2 E; Xiaomi Mi Pro 2, 4 Pro, 4 Pro 2nd Gen), a többi specs nélkül
- A wizard kizárólag ellenőrzött (`specsVerified` + `sourceUrls`) változatnál tölti elő a gyári adatokat (akku Wh, végsebesség, hatótáv), látható jelzéssel; nem ellenőrzött katalógusmodellnél jelzi, hogy az adatok változatonként eltérhetnek
- Soft launch polish batch: minden publikus oldal (landing, sign-in, sign-up, devlog, privacy, terms) fix black-orange témát kapott, nincs több fehér oldal; devlog badge színek sötét témára igazítva
- Onboarding gyorsítás: a dashboard „Első roller hozzáadása" CTA `?add=1`-gyel azonnal a wizarddal nyitja a garázst; szerviz form alapból mai dátummal indul; menet form egy roller esetén előválaszt és az indulást mostani időponttal tölti ki
- Egyszerűsített roller hozzáadás wizard (`ScooterAddWizard`, scooter-catalog modul)
- Publikus profil v1, majd explicit privacy: `profileIsPublic` + rolleronkénti `isPublic`, minden alapból privát
- Új `bio` mező, Profilom oldal, settings/profil szétválasztás
- `/pricing`, `/sample-report`, `/profile/@username` téma-wrapper (nem fehér oldal)
- Közös presentational komponensek (RideListItem, ServiceListItem, PublicProfileView, ProfileIdentity, SettingsProfilePointer, SaleReport)
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
- `SaleReport`
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

## Publikus demó állapota

A `/preview/app` demóalkalmazás 2026-07-17-én megszűnt (minden UI-változtatást megduplázott). Az egyetlen bejelentkezés nélküli bemutató a `/sample-report`:

- Hardcoded mock adat az oldalban, nincs Prisma és nincs mentés
- A közös `SaleReport` presentational komponenst használja
- Session-aware fejléc (`PublicSiteHeader`), bejelentkezve app CTA-t mutat
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
