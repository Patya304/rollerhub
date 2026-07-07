# Soft Launch QA Checklist

Manuális ellenőrzési lista soft launch előtt.

## Build & lint

- [ ] `npm run build` hibák nélkül fut
- [ ] `npm run lint` hibák nélkül fut
- [ ] `npx prisma validate` hibák nélkül fut

## Auth

- [ ] `/sign-up` — regisztráció működik (név, email, jelszó)
- [ ] `/sign-in` — belépés működik
- [ ] Kijelentkezés működik
- [ ] Ismeretlen route → redirect `/sign-in`-re

## Első roller hozzáadása

- [ ] Dashboard onboarding empty state megjelenik
- [ ] Garázs → Roller hozzáadása form megnyílik
- [ ] Roller mentés után megjelenik a listában
- [ ] Roller adatlapra navigálás működik

## Szerviz

- [ ] Roller adatlapján szerviz hozzáadása form működik
- [ ] Szerviz megjelenik a roller adatlapján
- [ ] `/service` oldalon látható a szerviz

## Menetnapló

- [ ] `/rides` oldalon menet rögzítése működik
- [ ] Menet megjelenik a listában
- [ ] Menet törlése működik (confirm dialog)

## Értékbecslés

- [ ] Roller adatlapján Értékbecslés futtatása gomb működik
- [ ] Becsült érték megjelenik a hero card-ban
- [ ] `/value` oldalon látható a becslés
- [ ] Ha nincs vételár: megfelelő fallback szöveg jelenik meg

## Tudástár

- [ ] `/knowledge` — mind a 4 cikk kattintható és megnyílik
- [ ] Cikkoldalakról a "Vissza a Tudástárhoz" link működik

## Settings

- [ ] Profil adatok (username, név) mentése működik
- [ ] Téma váltás (black-orange, black-blue, black-white) mentés után ténylegesen vált
- [ ] Nyelv select lenyíló opciókat mutat és választható

## Preview app (bejelentkezés nélkül)

- [ ] `/preview/app` betölt, sidebar látható
- [ ] `/preview/app/garage` — Ruptor kattintható, Ninebot nem kattintható
- [ ] `/preview/app/garage/demo-ruptor` — teljes adatlap megjelenik
- [ ] `/preview/app/service` — 5 bejegyzés látható
- [ ] `/preview/app/rides` — 4 menet látható
- [ ] `/preview/app/value` — 2 roller értéke látható
- [ ] `/preview/app/knowledge` — 4 disabled téma, kozut.hu + kav.hu linkek működnek
- [ ] `/preview/app/settings` — disabled inputok, mentés gomb disabled

## Mobil (390px)

- [ ] Dashboard hero 2×2 grid nem törik
- [ ] Garázs lista sorok nem lógnak ki
- [ ] Roller adatlap hero kép + szöveg nem vágódik le
- [ ] Preview sidebar helyett mobil nav jelenik meg
- [ ] Settings theme grid 2 oszlopos mobilon

## Publikus oldalak

- [ ] `/pricing` betölt, "Demó app megnyitása" link működik
- [ ] `/sample-report` betölt, demo badge látható
- [ ] `/devlog` betölt
