import type { CatalogBrand } from "../types";

// Gyári adatok egyelőre nem kerültek be: verziónként eltérő specifikációk,
// hivatalos gyártói forrásból pótolandók.
export const DUALTRON: CatalogBrand = {
  name: "Dualtron",
  models: [
    { id: "dualtron-mini", name: "Mini", category: "performance" },
    { id: "dualtron-victor", name: "Victor", category: "performance" },
    { id: "dualtron-thunder-2", name: "Thunder 2", category: "performance" },
    { id: "dualtron-storm", name: "Storm", category: "performance" },
  ],
};
