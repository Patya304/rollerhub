import type { CatalogBrand } from "../types";

// Gyári adatok egyelőre nem kerültek be: a Kugoo modellek specifikációi
// forgalmazónként eltérnek, hivatalos gyártói forrásból pótolandók.
export const KUGOO: CatalogBrand = {
  name: "Kugoo",
  models: [
    { id: "kugoo-s1", name: "S1", category: "commuter" },
    { id: "kugoo-m4", name: "M4", category: "commuter" },
    { id: "kugoo-m4-pro", name: "M4 Pro", category: "commuter" },
    { id: "kugoo-g2-pro", name: "G2 Pro", category: "performance" },
  ],
};
