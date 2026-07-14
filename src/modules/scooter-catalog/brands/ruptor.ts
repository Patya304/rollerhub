import type { CatalogBrand } from "../types";

// Gyári adatok egyelőre nem kerültek be: a Ruptor modellek specifikációi
// verziónként eltérnek, hivatalos gyártói forrásból pótolandók.
export const RUPTOR: CatalogBrand = {
  name: "Ruptor",
  models: [
    { id: "ruptor-r1", name: "R1" },
    { id: "ruptor-r1-v2", name: "R1 V2" },
    { id: "ruptor-r2", name: "R2" },
    { id: "ruptor-r3", name: "R3" },
  ],
};
