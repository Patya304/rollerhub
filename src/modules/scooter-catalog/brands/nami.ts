import type { CatalogBrand } from "../types";

// Gyári adatok egyelőre nem kerültek be: verziónként eltérő specifikációk,
// hivatalos gyártói forrásból pótolandók.
export const NAMI: CatalogBrand = {
  name: "Nami",
  models: [
    { id: "nami-klima", name: "Klima", category: "performance" },
    { id: "nami-klima-max", name: "Klima Max", category: "performance" },
    { id: "nami-burn-e-2", name: "Burn-E 2", category: "performance" },
    { id: "nami-burn-e-2-max", name: "Burn-E 2 Max", category: "performance" },
  ],
};
