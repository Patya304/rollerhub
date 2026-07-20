import type { ServiceType } from "@/modules/services/service-types";
import type { ConditionEntry } from "@/modules/sale-report/condition";
import type { SaleReportSnapshot } from "@/modules/sale-report/snapshot";

// Az Eladási állapotlap safe DTO-ja. Ugyanez az alak épül fel a tulajdonosi
// élő előnézetben és a publikus, snapshot-alapú oldalon is. Soha nem
// tartalmazhat: emailt, user ID-t, alvázszámot, megjegyzést, vételárat,
// vásárlás dátumát, értéktörténetet, értékmegőrzési százalékot, szerviz
// költséget/megjegyzést, ride adatot.
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

export type SaleReportConditionEntry =
  | (ConditionEntry & { updatedAt: string | null })
  | null;

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
  condition: SaleReportConditionEntry;
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
    condition: SaleReportConditionEntry;
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
// mert a roller állapotlapja meg van osztva - az Eladási állapotlap saját
// megosztási engedélye nem teszi publikussá a tulajdonos kilétét. Ez a
// tulajdonosi élő ELŐNÉZET DTO-ja - a publikus oldal a snapshotból épül
// (lásd buildPublicSaleReportDto).
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
    condition: scooter.condition,
    updatedAt: updatedAt.toISOString(),
    owner,
  };
}

// A publikus oldal EZT használja: a validált snapshotból épül, a
// tulajdonosi blokk pedig egy külön, élő privacy-lekérdezésből érkezik. A
// snapshot tartalma privacy-safe, de a DTO összeállítás itt sem bízik
// vakon benne - a hívó felelőssége, hogy csak `saleReportSnapshotSchema`
// által validált adatot adjon át.
export function buildPublicSaleReportDto(
  snapshot: SaleReportSnapshot,
  publishedAt: Date,
  owner: SaleReportOwner,
): SaleReportDto {
  return {
    brand: snapshot.vehicle.brand,
    model: snapshot.vehicle.model,
    year: snapshot.vehicle.year,
    photoUrl: snapshot.vehicle.photoUrl,
    currentMileage: snapshot.vehicle.currentMileage,
    batteryCapacity: snapshot.vehicle.batteryCapacityWh,
    topSpeed: snapshot.vehicle.factoryTopSpeedKmh,
    rangeKm: snapshot.vehicle.factoryRangeKm,
    color: snapshot.vehicle.color,
    estimatedValue: snapshot.estimate?.estimatedValue ?? null,
    serviceCount: snapshot.services.length,
    services: snapshot.services.map((s) => ({
      type: s.type,
      performedAt: s.performedAt,
      odometerKm: s.odometerKm,
    })),
    condition: snapshot.condition,
    updatedAt: publishedAt.toISOString(),
    owner,
  };
}
