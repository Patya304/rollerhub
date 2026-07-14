import type { CatalogBrand } from "../types";

// Egy bejegyzés = egy konkrét változat: a 4 Pro és a 4 Pro (2nd Gen) külön
// modell, eltérő gyári adatokkal. A gyári adatok kizárólag a hivatalos
// mi.com spec oldalakról származnak (sourceUrls); a Xiaomi a névleges
// akkukapacitást közli, ezt tároljuk. A legacy modellek (Essential, 1S, 3)
// hivatalos spec oldala már nem érhető el megbízhatóan, ezért specs nélkül
// szerepelnek.
export const XIAOMI: CatalogBrand = {
  name: "Xiaomi",
  models: [
    {
      id: "xiaomi-mi-essential",
      name: "Mi Essential",
      category: "commuter",
    },
    {
      id: "xiaomi-mi-1s",
      name: "Mi 1S",
      category: "commuter",
    },
    {
      id: "xiaomi-mi-pro-2",
      name: "Mi Pro 2",
      market: "EU",
      category: "commuter",
      specs: {
        topSpeedKmh: 25,
        batteryWh: 446,
      },
      sourceUrls: ["https://www.mi.com/global/mi-electric-scooter-Pro2/specs/"],
      verifiedAt: "2026-07-14",
      specsVerified: true,
    },
    {
      id: "xiaomi-mi-3",
      name: "Mi 3",
      category: "commuter",
    },
    {
      id: "xiaomi-4-pro",
      name: "4 Pro",
      market: "EU",
      category: "commuter",
      specs: {
        topSpeedKmh: 25,
        batteryWh: 446,
        rangeKm: 55,
      },
      sourceUrls: [
        "https://www.mi.com/global/product/xiaomi-electric-scooter-4-pro/specs/",
      ],
      verifiedAt: "2026-07-14",
      specsVerified: true,
    },
    {
      id: "xiaomi-4-pro-2nd-gen",
      name: "4 Pro (2nd Gen)",
      variant: "2nd Gen",
      market: "EU",
      category: "commuter",
      specs: {
        topSpeedKmh: 25,
        batteryWh: 468,
        motorW: 400,
        rangeKm: 60,
        weightKg: 19,
      },
      sourceUrls: [
        "https://www.mi.com/global/product/xiaomi-electric-scooter-4-pro-2nd-gen/specs/",
      ],
      verifiedAt: "2026-07-14",
      specsVerified: true,
    },
  ],
};
