# RollerHub Roadmap

## Jelenlegi állapot (kész)

- Garázs
- Egyszerűsített roller hozzáadás (márka/modell wizard, Egyéb opcióval)
- Szervizkönyv
- Menetek
- Értékbecslés és értéktörténet
- Tudástár
- Profilom oldal (`/profile/me`)
- Publikus profil (`/profile/@username`) explicit privacy-vel (profil + rolleronkénti opt-in)
- Preview / AI review oldal (`/preview/app`) review indexszel

## Soft launch előtti kötelezők

- [ ] App shellből kilógó oldalak végigellenőrzése
- [ ] Live deploy ellenőrzés (a Vercelen a legfrissebb commit fut-e)
- [ ] Public profile privacy flow kézi teszt
- [ ] Első roller hozzáadás kézi teszt
- [ ] Settings/Profilom szétválasztás live ellenőrzés
- [ ] Preview review index live ellenőrzés
- [ ] Production migration/deploy checklist
- [ ] Hibás magyar copy keresés (tiltólista: CLAUDE.md „Copy elvek")

## Következő 5–10 batch

1. Live deploy audit
2. App shell / fehér háttér regresszió audit
3. Soft launch QA checklist végigfuttatása (SOFT_LAUNCH_QA.md)
4. Eladó rollereim v1
5. Publikus roller adatlap v1
6. Profil előnézet finomítás
7. User keresés
8. Friend request
9. Üzenetküldés
10. Billing/premium alapok

A 7–10. csak a soft launch stabilizálása után induljon.

## Nem most

- Full marketplace
- Chat (a 9. batch üzenetküldése is csak alap, nem valós idejű chat)
- Teljes friend rendszer social feeddel
- Mobil app (natív)
- Hardware GPS
- AI becslés automatizmus
- Nagy redesign
