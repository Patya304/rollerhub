# RollerHub Tasks

Priorizált backlog. Autonóm batch mindig P0-ból induljon, ha van nyitott P0.

Jelölés: `[ ]` nyitott, `[x]` kész.

## P0 — soft launch előtti kötelezők

- [ ] Live deploy audit: a Vercelen tényleg a legfrissebb commit fut-e (utolsó lokális commitok pusholva vannak-e)
- [ ] `/sample-report` live ellenőrzés (mock riport megjelenik, session-aware fejléc, semmi nem menthető)
- [ ] `/profile/me` live ellenőrzés (védett, app shellben, mentés működik)
- [ ] `/settings` live ellenőrzés (csak megjelenés/nyelv/fiók, Profilom mutató kártya)
- [ ] `/pricing` és `/sample-report` live shell ellenőrzés (sötét téma, nem fehér oldal)
- [ ] Public profile privacy manuális flow (be/ki kapcsolás, privát roller nem látszik, privát profil 404)
- [ ] First scooter onboarding manuális flow (üres garázs → wizard → roller a listában)
- [ ] Production migration/deploy checklist (migrate status, env-ek, `add_public_profile_privacy` élesben)
- [ ] Hibás/összecsúszott magyar copy keresés (tiltólista + törött mondatok)

## P1 — soft launch utáni első kör

- [ ] Katalógus gyári adatok pótlása hivatalos gyártói forrásból, `sourceUrls` + `specsVerified` kitöltésével (Ninebot Max G30/F40/F2 Pro E/E2 E, Xiaomi legacy modellek, Ruptor, Kugoo, Kukirin, Nami, Kaabo, Dualtron, Inmotion, VSett — most szándékosan üresek)
- [ ] Katalógus meta mezők kitöltése és UI-használat (category, insuranceRequired, licenseCategory) a KRESZ/biztosítás funkciókhoz
- [ ] Free csomag rollerkorlát döntés: a /pricing „1 roller nyilvántartása"-t ígér, de az API nem érvényesít limitet (vagy limit bevezetése, vagy pricing copy igazítása)
- [ ] Eladó rollereim v1 (csak jelölés + megjelenítés, nem marketplace)
- [x] Publikus roller adatlap v1 (`/profile/[username]/scooters/[id]`, csak biztonságos mezők, notFound minden nem publikus/törölt/idegen esetben)
- [x] Eladási állapotlap v1 (Á1): saját `SaleReport` modell + megosztható, visszavonható publikus token-link (`/report/[token]`), egységes névhasználat, készültségi checklist, tulajdonosi előnézet ugyanabból a safe DTO-ból, mint a publikus oldal. Nyitva: PDF export (Premium), valódi 390 px eszközteszt.
- [x] Eladási állapotlap v2 (Á2+Á3+UX2): snapshot-alapú publikálás (`snapshot`/`snapshotHash`/`snapshotVersion`/`publishedAt`, additív migráció), "Nem publikált módosítások" jelzés, legacy (snapshot nélküli) reportok kezelése új tokencsere nélkül, saját `ScooterCondition` modell + `PUT /api/scooters/[id]/condition`, dedikált `/garage/[id]/sale-report` workspace, roller adatlap kompakt összefoglaló kártyára egyszerűsítve.
- [x] Eladási állapotlap v2 végső inspector (Á2+Á3+UX2 javítókör): közös `evaluateStoredSnapshot()` (missing/invalid/up_to_date/outdated 4 állapot mindkét oldalon), refresh-revoke versenyhelyzet védelme feltételes `updateMany`-jel, determinisztikus szervizsorrend a hashben, snapshot-séma `.strict()` szigorítás + URL-protokoll validáció, ismert hibák állapotváltás normalizálás (kliens+szerver), checklist-linkek javítása a valódi anchorokra, duplikált előnézet megszüntetése a workspace-en, állapotfelmérés dátumának megjelenítése a publikus oldalon, `/api/scooters/[id]/condition` biztonságos 500-hibakezelés. Valódi Chrome+DB regresszió megtörtént (snapshot/refresh/revoke/reaktiválás/corrupt/legacy/szervizsorrend/privacy/mobil-overflow), QA adat törölve.
- [x] Eladási állapotlap v2 pre-commit stabilizálás: `SaleReportPanel` render-fázisú props->state szinkron (effect-kaszkád nélkül), publikus link/badge csak ténylegesen olvasható snapshotnál, `refreshShare()` optimista concurrency (token+updatedAt marker, friss visszaolvasás a no-op ágban, legfeljebb egy belső retry, `conflict`/409 végállapot), `revokeShare()` kliens által látott token elleni ellenőrzéssel (elavult fül nem vonhat vissza új tokent), snapshot-séma `knownIssues` whitespace-only tiltás + kanonikus, round-trippel ellenőrzött ISO dátumséma, `ConditionForm` teljes mezőzárolás mentés közben. Nyitva: teljes 62 tételes checklist tételenkénti végigpipálása, valódi 390 px fizikai eszközteszt, PDF export (Premium).
- [ ] Profil előnézet finomítás
- [ ] Soft launch QA oldal/lista karbantartás (`SOFT_LAUNCH_QA.md` frissítés az új funkciókkal)
- [ ] Onboarding copy polish
- [x] Értékbecslés UX visszajelzés javítás (dedup visszajelzés, `saved` API mező, disclaimer, `-0 Ft`/NaN% védelem a `/value` oldalon)
- [x] Natív `confirm()` lecserélése app-stílusú megerősítő dialógusra a szervizbejegyzés törlésénél (roller törlésénél már korábban megvolt); menet törlése (`/rides`) még natív `confirm()`-ot használ, ez nyitva maradt
- [ ] 390 px-es valódi eszközös/devtools ellenőrzés (a Chrome ablak ebben a környezetben sem ment 500 px alá `resize_window`-val, a 390-es réteg továbbra is csak heurisztikával volt tesztelve)
- [ ] Tudástár cikkek disclaimer és hivatalos linkek ellenőrzése
- [ ] Valódi fájlfeltöltés (rollerfotó, profilkép) — jelenleg nincs storage SDK a repóban; lásd a G3 storage bevezetési tervet a devlog/beszámoló mellett
- [ ] Szervizfotó, számla, dokumentumtár, szervizemlékeztető (külön későbbi batch)

## P2 — később

- [ ] User keresés
- [ ] Friend request
- [ ] Üzenetküldés
- [ ] Billing/premium
- [ ] Devlog/admin felület
- [ ] Android app előkészítés
- [ ] iOS később

## PARKOLÓ — nem tervezett

- Full marketplace
- GPS tracker business
- Automatikus AI értékbecslés külső adatokból
- Komplex social feed
- Komment rendszer
- Moderation rendszer
