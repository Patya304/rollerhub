import type { ServiceType } from "@/modules/services/service-types";

// Az Eladási állapotlap safe DTO-ja. Ugyanez az alak épül fel a tulajdonosi
// előnézetben és a publikus oldalon is, hogy a kettő garantáltan azonos
// adatot mutasson. Soha nem tartalmazhat: emailt, user ID-t, alvázszámot,
// megjegyzést, vételárat, vásárlás dátumát, értéktörténetet,
// értékmegőrzési százalékot, szerviz költséget/megjegyzést, ride adatot.
export type SaleReportServiceEntry = {
  type: ServiceType;
  performedAt: string;
  odometerKm: number | null;
};

export type SaleReportOwner = {
  name: string;
  username: string;
  image: string | null;
} | null;

export type SaleReportDto = {
  brand: string;
  model: string;
  year: number | null;
  photoUrl: string | null;
  currentMileage: number;
  batteryCapacity: number | null;
  topSpeed: number | null;
  rangeKm: number | null;
  color: string | null;
  estimatedValue: number | null;
  serviceCount: number;
  services: SaleReportServiceEntry[];
  updatedAt: string;
  owner: SaleReportOwner;
};

type BuildInput = {
  scooter: {
    brand: string;
    model: string;
    year: number | null;
    photoUrl: string | null;
    currentMileage: number;
    batteryCapacity: number | null;
    topSpeed: number | null;
    rangeKm: number | null;
    color: string | null;
    serviceCount: number;
    services: {
      type: string;
      performedAt: Date;
      odometerKm: number | null;
    }[];
    estimatedValue: number | null;
    user: {
      name: string | null;
      username: string | null;
      image: string | null;
      profileIsPublic: boolean;
    };
  };
  updatedAt: Date;
};

// A tulajdonosi blokk csak akkor jelenik meg, ha a profil explicit publikus
// és van username. Privát profilnál a valódi név sem szivárog ki csak azért,
// mert a roller állapotlapja meg van osztva — az Eladási állapotlap saját
// megosztási engedélye nem teszi publikussá a tulajdonos kilétét.
export function buildSaleReportDto({
  scooter,
  updatedAt,
}: BuildInput): SaleReportDto {
  const owner: SaleReportOwner =
    scooter.user.profileIsPublic && scooter.user.username
      ? {
          name: scooter.user.name ?? `@${scooter.user.username}`,
          username: scooter.user.username,
          image: scooter.user.image,
        }
      : null;

  return {
    brand: scooter.brand,
    model: scooter.model,
    year: scooter.year,
    photoUrl: scooter.photoUrl,
    currentMileage: scooter.currentMileage,
    batteryCapacity: scooter.batteryCapacity,
    topSpeed: scooter.topSpeed,
    rangeKm: scooter.rangeKm,
    color: scooter.color,
    estimatedValue: scooter.estimatedValue,
    serviceCount: scooter.serviceCount,
    services: scooter.services.map((s) => ({
      type: s.type as ServiceType,
      performedAt: s.performedAt.toISOString(),
      odometerKm: s.odometerKm,
    })),
    updatedAt: updatedAt.toISOString(),
    owner,
  };
}
