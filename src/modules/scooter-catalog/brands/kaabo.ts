import type { CatalogBrand } from "../types";

// Gyári adatok egyelőre nem kerültek be: verziónként eltérő specifikációk,
// hivatalos gyártói forrásból pótolandók.
export const KAABO: CatalogBrand = {
  name: "Kaabo",
  models: [
    { id: "kaabo-mantis-8", name: "Mantis 8", category: "performance" },
    { id: "kaabo-mantis-10", name: "Mantis 10", category: "performance" },
    {
      id: "kaabo-wolf-warrior-11",
      name: "Wolf Warrior 11",
      category: "offroad",
    },
    {
      id: "kaabo-wolf-king-gt-pro",
      name: "Wolf King GT Pro",
      category: "offroad",
    },
  ],
};
