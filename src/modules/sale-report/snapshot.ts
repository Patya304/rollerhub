import { createHash } from "crypto";
import type { ConditionEntry } from "@/modules/sale-report/condition";
import type { ServiceType } from "@/modules/services/service-types";

// A publikus állapotlap TARTALMÁNAK gépi lenyomata: publikálásonként
// rögzített, privacy-safe pillanatkép. Soha nem tartalmazhat: user/owner/
// scooter/report/service ID-t, emailt, usernevet, tulajdonos nevét vagy
// profilképét, alvázszámot, vételárat, vásárlás dátumát, megjegyzést,
// szerviz költséget/megjegyzést, ride adatot, értéktörténetet vagy
// algorithmVersion-t. A tulajdonosi blokk tudatosan NEM része a
// snapshotnak - az mindig külön, élő, privacy-függő lekérdezésből épül.
export type SaleReportSnapshot = {
  version: 1;
  vehicle: {
    brand: string;
    model: string;
    year: number | null;
    currentMileage: number;
    photoUrl: string | null;
    batteryCapacityWh: number | null;
    factoryTopSpeedKmh: number | null;
    factoryRangeKm: number | null;
    color: string | null;
  };
  condition: (ConditionEntry & { updatedAt: string | null }) | null;
  services: Array<{
    type: ServiceType;
    performedAt: string;
    odometerKm: number | null;
  }>;
  estimate: { estimatedValue: number } | null;
};

export function buildSnapshot(input: {
  brand: string;
  model: string;
  year: number | null;
  currentMileage: number;
  photoUrl: string | null;
  batteryCapacity: number | null;
  topSpeed: number | null;
  rangeKm: number | null;
  color: string | null;
  condition: (ConditionEntry & { updatedAt: string | null }) | null;
  services: { type: string; performedAt: Date; odometerKm: number | null }[];
  estimatedValue: number | null;
}): SaleReportSnapshot {
  return {
    version: 1,
    vehicle: {
      brand: input.brand,
      model: input.model,
      year: input.year,
      currentMileage: input.currentMileage,
      photoUrl: input.photoUrl,
      batteryCapacityWh: input.batteryCapacity,
      factoryTopSpeedKmh: input.topSpeed,
      factoryRangeKm: input.rangeKm,
      color: input.color,
    },
    condition: input.condition,
    services: sortServicesDeterministically(input.services).map((s) => ({
      type: s.type as ServiceType,
      performedAt: s.performedAt.toISOString(),
      odometerKm: s.odometerKm,
    })),
    estimate:
      input.estimatedValue != null
        ? { estimatedValue: input.estimatedValue }
        : null,
  };
}

// A DB-lekérdezés csak `performedAt desc` szerint rendez, ami több
// azonos (dátum-only) `performedAt` értékű bejegyzésnél nem garantál
// stabil sorrendet - ez hamis hash-eltérést okozhatna két, tartalmilag
// azonos újraolvasás között. A snapshotépítés előtt ezért kizárólag safe,
// publikus mezők alapján (soha nem Service ID vagy createdAt) újra
// rendezzük determinisztikusan: performedAt csökkenő, majd type növekvő,
// majd odometerKm (null mindig a végén).
export function sortServicesDeterministically<
  T extends { performedAt: Date; type: string; odometerKm: number | null },
>(services: T[]): T[] {
  return [...services].sort((a, b) => {
    const dateDiff = b.performedAt.getTime() - a.performedAt.getTime();
    if (dateDiff !== 0) return dateDiff;
    if (a.type !== b.type) return a.type < b.type ? -1 : 1;
    if (a.odometerKm == null && b.odometerKm == null) return 0;
    if (a.odometerKm == null) return 1;
    if (b.odometerKm == null) return -1;
    return a.odometerKm - b.odometerKm;
  });
}

// Rekurzív, kulcs szerint rendezett kanonikus alak - a hash így független
// attól, hogy a JS motor milyen sorrendben tartja számon az object kulcsokat.
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    const sortedEntries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, val]) => [key, canonicalize(val)] as const);
    return Object.fromEntries(sortedEntries);
  }
  return value;
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

// A hash kizárólag a vevő számára látható tartalmat követi: tulajdonosi
// blokk, publishedAt, token és report ID sosem kerül bele.
export function hashSnapshot(snapshot: SaleReportSnapshot): string {
  return createHash("sha256").update(stableStringify(snapshot)).digest("hex");
}
