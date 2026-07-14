// A rollerkatalógus típusai.
//
// A katalógus a roller hozzáadás alapja, és hosszú távon több funkció épül rá
// (értékbecslés, KRESZ/biztosítás információk, karbantartási ajánlások,
// eladási állapotlap). A meta mezők ezért már most léteznek, de az UI még
// nem használja őket.
//
// Adatpolitika: gyári adat csak hivatalos gyártói forrásból kerülhet be,
// a forrás URL-jével együtt (`sourceUrls`). Egy modellbejegyzés mindig egy
// konkrét változatot/piaci verziót jelöl (pl. Max G2 E, 4 Pro 2nd Gen) —
// generációkat és régiós változatokat tilos összemosni. Ami bizonytalan,
// az üresen marad, és `specsVerified` nélkül a wizard nem tölt elő semmit.

/**
 * Termékkategória, NEM jogi besorolás. A commuter/performance/offroad csak a
 * termék jellegét írja le; a jogi kategóriát (KRESZ, biztosítás, jogosítvány)
 * a külön szabályozási mezők fedik majd le (insuranceRequired,
 * licenseCategory), amelyeket hivatalos forrás alapján kell kitölteni.
 */
export type ScooterCategory =
  | "commuter" // városi/közlekedő roller
  | "performance" // nagy teljesítményű
  | "offroad" // terep
  | "seated"; // üléses

/** Gyári specifikációk. Minden mező opcionális: csak biztos adat kerül be. */
export type CatalogModelSpecs = {
  /** Gyári végsebesség (km/h) ehhez a konkrét változathoz. */
  topSpeedKmh?: number;
  /** Akkumulátor névleges kapacitás (Wh). */
  batteryWh?: number;
  /** Névleges motorteljesítmény (W). Csúcsteljesítmény ide nem kerülhet. */
  motorW?: number;
  /** Gyári hatótáv (km). */
  rangeKm?: number;
  /** Tömeg (kg). */
  weightKg?: number;
};

export type CatalogModel = {
  /** Stabil, egyedi slug (pl. "ninebot-max-g2-e"). Sosem változhat. */
  id: string;
  name: string;
  /** Változat megnevezés, ha a névből nem egyértelmű (pl. "2nd Gen"). */
  variant?: string;
  /** Piac, amelyre a specifikációk vonatkoznak (pl. "EU", "DE"). */
  market?: string;
  specs?: CatalogModelSpecs;
  /** Hivatalos gyártói forrás URL-ek, amelyekből a specs származik. */
  sourceUrls?: readonly string[];
  /** Mikor lettek utoljára ellenőrizve a gyári adatok (ISO dátum). */
  verifiedAt?: string;
  /**
   * Csak akkor true, ha a specs minden értéke hivatalos gyártói forrásból
   * ellenőrzött. A wizard kizárólag ekkor tölt elő gyári adatot.
   */
  specsVerified?: boolean;
  // ---- Meta mezők későbbi funkciókhoz (az UI még nem használja őket) ----
  category?: ScooterCategory;
  /** Kötelező-e biztosítás a hatályos magyar szabályok szerint. */
  insuranceRequired?: boolean;
  /** Ajánlott-e bukósisak ehhez a kategóriához. */
  helmetRecommended?: boolean;
  /** Szükséges jogosítvány-kategória, ha van. */
  licenseCategory?: string;
  /** Szabad szöveges megjegyzés (pl. verzióeltérések). */
  notes?: string;
};

export type CatalogBrand = {
  name: string;
  models: CatalogModel[];
};
