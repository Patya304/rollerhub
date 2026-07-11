// Egyszerű helyi rollerkatalógus az új roller hozzáadásához.
// Nincs adatbázis és nincs API: csak a gyakori márkák és modellek,
// hogy az első roller felvétele pár koppintás legyen.

export const OTHER_OPTION = "Egyéb";

export type CatalogBrand = {
  name: string;
  models: string[];
};

export const SCOOTER_CATALOG: CatalogBrand[] = [
  {
    name: "Ninebot",
    models: ["Max G2", "Max G30", "F2", "F40", "E2"],
  },
  {
    name: "Xiaomi",
    models: ["Mi 1S", "Mi Pro 2", "Mi 3", "Mi 4 Pro"],
  },
  {
    name: "Ruptor",
    models: ["R1", "R1 V2", "R2", "R3"],
  },
  {
    name: "Kugoo",
    models: ["S1", "M4", "M4 Pro", "G2 Pro"],
  },
  {
    name: "Nami",
    models: ["Klima", "Burn-E 2", "Burn-E 2 Max"],
  },
];

export function getModelsForBrand(brand: string): string[] {
  return SCOOTER_CATALOG.find((b) => b.name === brand)?.models ?? [];
}
