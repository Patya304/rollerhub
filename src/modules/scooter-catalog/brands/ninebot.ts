import type { CatalogBrand } from "../types";

// Egy bejegyzés = egy konkrét változat. A gyári adatok kizárólag a hivatalos
// eu-en.segway.com termékoldalakról származnak (sourceUrls). A motorW mező
// üres, mert a Segway a maximális teljesítményt közli, nem a névlegeset.
// A legacy modellek (Max G30, F40) hivatalos oldala már nem elérhető, ezért
// specs nélkül szerepelnek.
export const NINEBOT: CatalogBrand = {
  name: "Ninebot",
  models: [
    {
      id: "ninebot-max-g2-e",
      name: "Max G2 E",
      market: "EU",
      category: "commuter",
      specs: {
        topSpeedKmh: 25,
        batteryWh: 551,
        rangeKm: 70,
      },
      sourceUrls: [
        "https://eu-en.segway.com/products/ninebot-kickscooter-max-g2e-powered-by-segway",
      ],
      verifiedAt: "2026-07-14",
      specsVerified: true,
    },
    {
      id: "ninebot-max-g30",
      name: "Max G30",
      category: "commuter",
    },
    {
      id: "ninebot-f2-e",
      name: "F2 E",
      market: "EU",
      category: "commuter",
      specs: {
        topSpeedKmh: 25,
        batteryWh: 367,
      },
      sourceUrls: [
        "https://eu-en.segway.com/products/ninebot-kickscooter-f2-powered-by-segway",
      ],
      verifiedAt: "2026-07-14",
      specsVerified: true,
    },
    {
      id: "ninebot-f2-pro-e",
      name: "F2 Pro E",
      market: "EU",
      category: "commuter",
    },
    {
      id: "ninebot-f40",
      name: "F40",
      category: "commuter",
    },
    {
      id: "ninebot-e2-e",
      name: "E2 E",
      market: "EU",
      category: "commuter",
    },
  ],
};
