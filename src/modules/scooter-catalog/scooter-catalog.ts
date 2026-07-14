// Helyi rollerkatalógus az új roller hozzáadásához.
//
// Nincs adatbázis és nincs API: a gyakori márkák és modellek statikus listája,
// hogy az első roller felvétele pár koppintás legyen. A márkák külön
// fájlokban élnek a `brands/` mappában, így a katalógus akár több ezer
// modellig bővíthető anélkül, hogy egyetlen óriásfájl keletkezne.
//
// Adatpolitika: csak megbízhatóan ismert gyári adat kerül be, a bizonytalan
// mezők üresen maradnak. Részletek: `types.ts`.

import type { CatalogBrand, CatalogModel } from "./types";
import { NINEBOT } from "./brands/ninebot";
import { XIAOMI } from "./brands/xiaomi";
import { RUPTOR } from "./brands/ruptor";
import { KUGOO } from "./brands/kugoo";
import { KUKIRIN } from "./brands/kukirin";
import { NAMI } from "./brands/nami";
import { KAABO } from "./brands/kaabo";
import { DUALTRON } from "./brands/dualtron";
import { INMOTION } from "./brands/inmotion";
import { VSETT } from "./brands/vsett";

export type {
  CatalogBrand,
  CatalogModel,
  CatalogModelSpecs,
  ScooterCategory,
} from "./types";

export const OTHER_OPTION = "Egyéb";

// A sorrend a magyar piacon jellemző ismertséget követi: ez határozza meg
// a wizard márkalistájának sorrendjét is.
export const SCOOTER_CATALOG: CatalogBrand[] = [
  NINEBOT,
  XIAOMI,
  RUPTOR,
  KUGOO,
  KUKIRIN,
  NAMI,
  KAABO,
  DUALTRON,
  INMOTION,
  VSETT,
];

/** A márkához tartozó modellnevek (a wizard választólistájához). */
export function getModelsForBrand(brand: string): string[] {
  return (
    SCOOTER_CATALOG.find((b) => b.name === brand)?.models.map((m) => m.name) ??
    []
  );
}

/** Egy katalógusmodell teljes rekordja, ha szerepel a katalógusban. */
export function getCatalogModel(
  brand: string,
  model: string,
): CatalogModel | undefined {
  return SCOOTER_CATALOG.find((b) => b.name === brand)?.models.find(
    (m) => m.name === model,
  );
}
