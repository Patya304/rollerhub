// Demo/mock adatok a preview route-csoporthoz.
// Nincs auth, nincs Prisma, nincs API hívás.

export const DEMO_SCOOTERS = [
  {
    id: "demo-ruptor",
    brand: "Ruptor",
    model: "R1 v2",
    year: 2024,
    currentMileage: 2000,
    purchasePrice: 200000,
    purchaseDate: "2024-03-10",
    estimate: 148000,
    retention: 74,
    depreciation: 52000,
    batteryCapacity: 551,
    topSpeed: 25,
    rangeKm: 70,
    color: "Fekete",
    serialNumber: "RP24-00142",
    photoUrl: null,
    notes: null,
    serviceCount: 3,
    rideCount: 12,
    marker: "01",
  },
  {
    id: "demo-ninebot",
    brand: "Ninebot",
    model: "Max G2",
    year: 2023,
    currentMileage: 1240,
    purchasePrice: 180000,
    purchaseDate: "2023-07-22",
    estimate: 150000,
    retention: 83,
    depreciation: 30000,
    batteryCapacity: 551,
    topSpeed: 25,
    rangeKm: 65,
    color: "Fekete",
    serialNumber: "NB23-55819",
    photoUrl: null,
    notes: null,
    serviceCount: 2,
    rideCount: 6,
    marker: "02",
  },
] as const;

export const DEMO_STATS = {
  scooterCount: 2,
  totalKm: 3240,
  totalValue: 298000,
  serviceCount: 5,
  totalServiceCost: 42000,
  rideCount: 18,
  totalPurchase: 380000,
};

export const DEMO_SERVICES = [
  {
    id: "svc-1",
    scooterId: "demo-ruptor",
    scooterName: "Ruptor R1 v2",
    type: "Gumicsere",
    performedAt: "2026-04-15",
    odometerKm: 800,
    cost: 12000,
    notes: "Első és hátsó gumi cserélve.",
  },
  {
    id: "svc-2",
    scooterId: "demo-ruptor",
    scooterName: "Ruptor R1 v2",
    type: "Fékállítás",
    performedAt: "2026-05-20",
    odometerKm: 1500,
    cost: 5000,
    notes: null,
  },
  {
    id: "svc-3",
    scooterId: "demo-ruptor",
    scooterName: "Ruptor R1 v2",
    type: "Akkuellenőrzés",
    performedAt: "2026-06-01",
    odometerKm: 1900,
    cost: 8000,
    notes: "Kapacitás 94%-on, normális.",
  },
  {
    id: "svc-4",
    scooterId: "demo-ninebot",
    scooterName: "Ninebot Max G2",
    type: "Általános karbantartás",
    performedAt: "2026-03-10",
    odometerKm: 600,
    cost: 9000,
    notes: null,
  },
  {
    id: "svc-5",
    scooterId: "demo-ninebot",
    scooterName: "Ninebot Max G2",
    type: "Gumicsere",
    performedAt: "2026-05-05",
    odometerKm: 1100,
    cost: 8000,
    notes: "Hátsó gumi cserélve.",
  },
];

export const DEMO_RIDES = [
  {
    id: "ride-1",
    scooterId: "demo-ruptor",
    scooterName: "Ruptor R1 v2",
    startAt: "2026-06-20T08:15:00",
    endAt: "2026-06-20T08:47:00",
    distanceKm: 9.2,
    avgSpeed: 18,
    maxSpeed: 24,
  },
  {
    id: "ride-2",
    scooterId: "demo-ruptor",
    scooterName: "Ruptor R1 v2",
    startAt: "2026-06-18T17:30:00",
    endAt: "2026-06-18T17:58:00",
    distanceKm: 7.5,
    avgSpeed: 16,
    maxSpeed: 23,
  },
  {
    id: "ride-3",
    scooterId: "demo-ninebot",
    scooterName: "Ninebot Max G2",
    startAt: "2026-06-19T09:00:00",
    endAt: "2026-06-19T09:35:00",
    distanceKm: 11.4,
    avgSpeed: 19,
    maxSpeed: 25,
  },
  {
    id: "ride-4",
    scooterId: "demo-ruptor",
    scooterName: "Ruptor R1 v2",
    startAt: "2026-06-15T12:00:00",
    endAt: "2026-06-15T12:22:00",
    distanceKm: 5.8,
    avgSpeed: 15,
    maxSpeed: 22,
  },
];

export const DEMO_VALUE_HISTORY = [
  { date: "2026-03-10", value: 200000 },
  { date: "2026-04-01", value: 182000 },
  { date: "2026-05-01", value: 165000 },
  { date: "2026-06-01", value: 154000 },
  { date: "2026-06-28", value: 148000 },
];

export const DEMO_SALE_CHECKLIST = [
  { label: "Vételár megadva", ok: true },
  { label: "Futásteljesítmény megadva", ok: true },
  { label: "Becsült érték elérhető", ok: true },
  { label: "Fotó hozzáadva", ok: false },
  { label: "Legalább 1 szerviz rögzítve", ok: true },
  { label: "Legalább 1 menet rögzítve", ok: true },
];

export const DEMO_USER = {
  name: "Demo Felhasználó",
  username: "demo_rider",
  email: "demo@rollerhub.app",
  emailVerified: true,
  theme: "black-orange",
  language: "Magyar",
};

export const KNOWLEDGE_TOPICS = [
  {
    marker: "01",
    eyebrow: "Közlekedési szabályok",
    title: "KRESZ",
    description: "Rollerrel az úton — mi szabad, mi nem, hol közlekedhetsz.",
  },
  {
    marker: "02",
    eyebrow: "Felelősségvállalás",
    title: "Biztosítás",
    description:
      "Kötelező és ajánlott biztosítási formák elektromos rollerekhez.",
  },
  {
    marker: "03",
    eyebrow: "Okmányok",
    title: "Jogosítvány",
    description: "Mikor kell jogosítvány? Milyen kategória vonatkozik rád?",
  },
  {
    marker: "04",
    eyebrow: "Szabályozás",
    title: "Roller szabályok",
    description: "Aktuális szabályok, zónák, sebességhatárok Magyarországon.",
  },
];

export const THEME_OPTIONS = [
  {
    value: "default",
    label: "Alap",
    hint: "Shadcn default",
    recommended: false,
  },
  {
    value: "black-white",
    label: "Fekete / fehér",
    hint: "Letisztult",
    recommended: false,
  },
  {
    value: "black-orange",
    label: "Fekete / narancs",
    hint: "Sport",
    recommended: true,
  },
  {
    value: "black-blue",
    label: "Fekete / kék",
    hint: "Tech",
    recommended: false,
  },
] as const;
