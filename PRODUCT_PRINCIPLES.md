# RollerHub Product Principles

Döntési alapelvek. Ha egy feladat ezekkel ütközik, jelezd, mielőtt megépíted.

## Termék

1. A RollerHub nem admin panel, hanem appos digitális garázs.
2. Az első 3 perc döntő: regisztrációtól az első rollerig ne legyen súrlódás.
3. Minél kevesebb kötelező input. Ami elhagyható, az opcionális vagy később kitölthető.
4. A user először értéket kapjon, ne űrlapot.
5. Ha egy feature túl nagy, v1-re kell vágni. A v1 szállítható, a "teljes verzió" roadmap.

## Privacy

6. Minden privát alapból.
7. Publikus megjelenés csak explicit kapcsolóval (profil ÉS roller szinten külön).
8. Privát adat (email, user id, token, alvázszám, notes, vételár) publikus oldalra soha nem kerülhet.

## Szerkezet

9. A profil nem settings: profil jellegű dolgok a Profilom oldalra tartoznak.
10. A settings nem szemetesláda: csak megjelenés, nyelv, fiók, biztonság.
11. Belső oldalak egységes app shellben jelenjenek meg, a beállított témával.
12. Ne legyen random fehér, témátlan oldal, az appból linkelt oldalakon sem.

## Preview

13. A preview az AI és emberi review eszköze, nem külön termék.
14. A preview mock-only és csak megtekintésre való: nincs auth, Prisma, API/fetch, mentés.
15. A preview a valódi presentational komponenseket használja, hogy ne tudjon széttartani a valódi UI-tól.

## Copy

16. Magyar copy: rövid, természetes, nem marketinges. Tiltó- és preferencialista: CLAUDE.md „Copy elvek".
