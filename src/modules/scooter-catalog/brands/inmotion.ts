import type { CatalogBrand } from "../types";

// Gyári adatok egyelőre nem kerültek be: verziónként eltérő specifikációk,
// hivatalos gyártói forrásból pótolandók.
export const INMOTION: CatalogBrand = {
  name: "Inmotion",
  models: [
    { id: "inmotion-air", name: "Air", category: "commuter" },
    { id: "inmotion-air-pro", name: "Air Pro", category: "commuter" },
    { id: "inmotion-l9", name: "L9", category: "commuter" },
    { id: "inmotion-climber", name: "Climber", category: "commuter" },
  ],
};
