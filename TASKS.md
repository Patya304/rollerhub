# RollerHub Tasks

Priorizált backlog. Autonóm batch mindig P0-ból induljon, ha van nyitott P0.

Jelölés: `[ ]` nyitott, `[x]` kész.

## P0 — soft launch előtti kötelezők

- [ ] Live deploy audit: a Vercelen tényleg a legfrissebb commit fut-e (utolsó lokális commitok pusholva vannak-e)
- [ ] `/preview/app` live ellenőrzés (review index, minden képernyő megnyílik, semmi nem menthető)
- [ ] `/profile/me` live ellenőrzés (védett, app shellben, mentés működik)
- [ ] `/settings` live ellenőrzés (csak megjelenés/nyelv/fiók, Profilom mutató kártya)
- [ ] `/pricing` és `/sample-report` live shell ellenőrzés (sötét téma, nem fehér oldal)
- [ ] Public profile privacy manuális flow (be/ki kapcsolás, privát roller nem látszik, privát profil 404)
- [ ] First scooter onboarding manuális flow (üres garázs → wizard → roller a listában)
- [ ] Production migration/deploy checklist (migrate status, env-ek, `add_public_profile_privacy` élesben)
- [ ] Hibás/összecsúszott magyar copy keresés (tiltólista + törött mondatok)

## P1 — soft launch utáni első kör

- [ ] Eladó rollereim v1 (csak jelölés + megjelenítés, nem marketplace)
- [ ] Publikus roller adatlap v1 (publikus rollerhez megosztható, biztonságos adatlap)
- [ ] Profil előnézet finomítás
- [ ] Soft launch QA oldal/lista karbantartás (`SOFT_LAUNCH_QA.md` frissítés az új funkciókkal)
- [ ] Onboarding copy polish
- [ ] Értékbecslés UX visszajelzés javítás
- [ ] Tudástár cikkek disclaimer és hivatalos linkek ellenőrzése

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
