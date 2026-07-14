import type { CatalogBrand } from "../types";

// Gyári adatok egyelőre nem kerültek be: a Kukirin (Kugoo Kirin) modellek
// specifikációi forgalmazónként eltérnek, hivatalos forrásból pótolandók.
export const KUKIRIN: CatalogBrand = {
  name: "Kukirin",
  models: [
    { id: "kukirin-g2", name: "G2", category: "performance" },
    { id: "kukirin-g2-max", name: "G2 Max", category: "performance" },
    { id: "kukirin-g3", name: "G3", category: "performance" },
    { id: "kukirin-m4-pro", name: "M4 Pro", category: "commuter" },
  ],
};
