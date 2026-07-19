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

## Minta riport (bejelentkezés nélkül)

- [ ] `/sample-report` betölt, sötét témával
- [ ] A riportban látszik a roller neve, évjárata, km-állása és a becsült eladási ár
- [ ] Szervizelőzmények: 3 bejegyzés dátummal és km-állással
- [ ] Kijelentkezve Belépés / Regisztráció, bejelentkezve „Vissza az appba" a fejlécben
- [ ] Semmi nem menthető vagy módosítható

## Mobil (390px)

- [ ] Dashboard hero 2×2 grid nem törik
- [ ] Garázs lista sorok nem lógnak ki
- [ ] Roller adatlap hero kép + szöveg nem vágódik le
- [ ] Settings theme grid 2 oszlopos mobilon

## Publikus oldalak

- [ ] `/pricing` betölt, "Demó app megnyitása" link működik
- [ ] `/sample-report` betölt, demo badge látható
- [ ] `/devlog` betölt

## Fotó

- [ ] Érvényes kép megjelenik a roller adatlapján, a Garázs listában és a publikus rolleroldalon
- [ ] Hibás (formailag rossz) URL mezőközeli hibát ad, nem menthető el
- [ ] Formailag helyes, de nem betölthető kép URL-nél mezőközeli hiba jelenik meg, a mentés nem indul el
- [ ] Kép eltávolítása külön success üzenetet ad ("Fénykép eltávolítva"), nem ugyanazt, mint a hozzáadás/csere
- [ ] Broken-image ikon helyett mindenhol a placeholder (🛴 vagy monogram) jelenik meg

## Privacy

- [ ] Privát profil + publikus rollerre jelölés esetén nincs publikus link és nincs "Link másolása"
- [ ] Publikus profil + privát roller esetén nincs publikus rollerlink
- [ ] Publikus profil + publikus roller esetén a publikus oldal megnyílik és a link másolható
- [ ] Rossz username/roller páros, törölt roller vagy idegen roller a publikus URL-en 404-et ad

## Szerviz

- [ ] Szerviz hozzáadása működik, mezőközeli validációval
- [ ] Szerviz szerkesztése működik, csak változtatás esetén menthető
- [ ] Szerviz törlése soft delete-tel történik, natív `confirm()` nélkül
- [ ] Törölt szerviz nem számít bele a service countokba (dashboard, Sale Report, publikus profil)
- [ ] Nyitott törlési megerősítés mellett nem indítható új szerviz hozzáadása vagy szerkesztés

## Értékbecslés

- [ ] Nulla vagy hiányzó vételárnál nincs értelmes retention-számítás, nincs téves becslés
- [ ] Pozitív vételárnál helyes becslés készül
- [ ] Ismételt becslés (dedup) esetén a UI jelzi, hogy nem történt új mentés
- [ ] Renderelt oldalakon sehol nincs `NaN`, `Infinity`, `-0 Ft` vagy `−0 Ft`
- [ ] Az értéktörténetben a pozitív változás nem jelenik meg automatikusan "sikeres/zöld" színnel

A valódi 390 px-es eszközteszt ez idáig nem történt meg (a Chrome ablak ebben a fejlesztői környezetben nem ment 500 px alá), ez továbbra is nyitott, kézi ellenőrzést igénylő tétel.

## Eladási állapotlap

- [ ] Roller adatlapján az "Eladási állapotlap" blokk mutatja a készültségi checklistet, hiányzó adatnál közvetlen javítási linkkel
- [ ] "Megosztás létrehozása" csak akkor aktív/érdemi, ha márka/modell/km-állás megvan
- [ ] "Állapotlap megtekintése" előnézet pontosan ugyanazt mutatja, mint a publikus oldal (nincs vételár, vásárlás dátuma, alvázszám, megjegyzés, értéktörténet, értékmegőrzési %, szerviz költség/megjegyzés, ride adat)
- [ ] "Megosztás létrehozása" után publikus link, "Link másolása" és "Publikus állapotlap megnyitása" működik
- [ ] "Megosztás frissítése" a `Frissítve` dátumot frissíti, a token nem változik
- [ ] "Megosztás visszavonása" inline megerősítést kér (nincs natív `confirm()`), sikeres visszavonás után a régi link 404
- [ ] Új megosztás mindig új tokent kap, a régi visszavont token soha nem éled újra
- [ ] Törölt (soft-deleted) rollerhez tartozó aktív megosztás publikus linkje is 404
- [ ] A publikus `/report/[token]` oldal working, semleges 404 hibás/ismeretlen tokennél
- [ ] Tulajdonosi blokk a publikus oldalon csak akkor jelenik meg, ha a profil explicit publikus és van username
- [ ] A megosztás nem igényel publikus profilt vagy publikus rollert (független privacy-engedély)
- [ ] A `/report/[token]` oldal `robots` metája `noindex, nofollow, nocache`, `referrer` metája `no-referrer`
- [ ] Tulajdonosi profilkép megjelenik a publikus oldalon, ha a profil publikus és van kép; hibás/hiányzó képnél monogram fallback
- [ ] Service ID nem jelenik meg sem a DTO-ban, sem a publikus HTML/RSC tartalomban
- [ ] Linkmásolás sikere képernyőolvasóval is érzékelhető (`role="status"` élő régió mondja: "Link másolva")
