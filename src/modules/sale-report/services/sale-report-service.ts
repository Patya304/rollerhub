import { prisma } from "@/lib/prisma";
import { generateShareToken } from "@/modules/sale-report/token";
import {
  computeReadiness,
  type Readiness,
} from "@/modules/sale-report/readiness";
import {
  buildSaleReportDto,
  type SaleReportDto,
} from "@/modules/sale-report/dto";

const reportScooterSelect = {
  brand: true,
  model: true,
  year: true,
  photoUrl: true,
  currentMileage: true,
  batteryCapacity: true,
  topSpeed: true,
  rangeKm: true,
  color: true,
  services: {
    where: { deletedAt: null },
    orderBy: { performedAt: "desc" as const },
    select: { type: true, performedAt: true, odometerKm: true },
  },
  _count: { select: { services: { where: { deletedAt: null } } } },
  valueEstimates: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
    select: { estimatedValue: true },
  },
  user: {
    select: { name: true, username: true, image: true, profileIsPublic: true },
  },
};

async function findOwnedScooterForReport(userId: string, scooterId: string) {
  return prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
    select: reportScooterSelect,
  });
}

function toReadinessInput(
  scooter: NonNullable<Awaited<ReturnType<typeof findOwnedScooterForReport>>>,
) {
  return {
    brand: scooter.brand,
    model: scooter.model,
    currentMileage: scooter.currentMileage,
    photoUrl: scooter.photoUrl,
    year: scooter.year,
    serviceCount: scooter._count.services,
    hasEstimate: scooter.valueEstimates.length > 0,
  };
}

function toDto(
  scooter: NonNullable<Awaited<ReturnType<typeof findOwnedScooterForReport>>>,
  updatedAt: Date,
): SaleReportDto {
  return buildSaleReportDto({
    scooter: {
      brand: scooter.brand,
      model: scooter.model,
      year: scooter.year,
      photoUrl: scooter.photoUrl,
      currentMileage: scooter.currentMileage,
      batteryCapacity: scooter.batteryCapacity,
      topSpeed: scooter.topSpeed,
      rangeKm: scooter.rangeKm,
      color: scooter.color,
      services: scooter.services,
      serviceCount: scooter._count.services,
      estimatedValue: scooter.valueEstimates[0]?.estimatedValue ?? null,
      user: scooter.user,
    },
    updatedAt,
  });
}

export type OwnerSaleReportState =
  | { status: "not_found" }
  | {
      status: "ok";
      readiness: Readiness;
      report: {
        isActive: boolean;
        publicToken: string;
        updatedAt: Date;
      } | null;
      preview: SaleReportDto;
    };

export async function getOwnerSaleReportState(
  userId: string,
  scooterId: string,
): Promise<OwnerSaleReportState> {
  const scooter = await findOwnedScooterForReport(userId, scooterId);
  if (!scooter) return { status: "not_found" };

  const report = await prisma.saleReport.findFirst({
    where: { scooterId, ownerId: userId },
  });
  const readiness = computeReadiness(toReadinessInput(scooter));
  const previewUpdatedAt = report?.updatedAt ?? new Date();

  return {
    status: "ok",
    readiness,
    report: report
      ? {
          isActive: report.isActive,
          publicToken: report.publicToken,
          updatedAt: report.updatedAt,
        }
      : null,
    preview: toDto(scooter, previewUpdatedAt),
  };
}

export type ShareMutationResult =
  | { status: "not_found" }
  | { status: "not_ready"; missingRequired: string[] }
  | { status: "ok"; publicToken: string; updatedAt: Date };

// Új megosztás létrehozása, vagy visszavont/inaktív megosztás
// újraaktiválása. Már AKTÍV, megfelelő ownerű reportnál a művelet
// idempotens: nem generál új tokent, nem billenti az updatedAt-et, a
// korábban kiküldött link érvényben marad. Inaktívból aktívba váltáskor a
// token MINDIG új értéket kap — egy korábban visszavont link tokenje így
// soha nem térhet vissza érvényesként. Párhuzamos kérések ellen feltételes
// `updateMany`/egyedi constraint utáni újraolvasással védekezünk, nem a
// kliens `busy` state-jére támaszkodva.
export async function createOrReactivateShare(
  userId: string,
  scooterId: string,
): Promise<ShareMutationResult> {
  const scooter = await findOwnedScooterForReport(userId, scooterId);
  if (!scooter) return { status: "not_found" };

  const readiness = computeReadiness(toReadinessInput(scooter));
  if (!readiness.canShare) {
    return { status: "not_ready", missingRequired: readiness.missingRequired };
  }

  const existing = await prisma.saleReport.findFirst({
    where: { scooterId, ownerId: userId },
  });

  // Már aktív: idempotens válasz, semmilyen írás nem történik.
  if (existing?.isActive) {
    return {
      status: "ok",
      publicToken: existing.publicToken,
      updatedAt: existing.updatedAt,
    };
  }

  const token = await generateUniqueToken();

  if (existing) {
    // Inaktív/visszavont sor újraaktiválása. Feltételes `updateMany`: csak
    // akkor aktiválunk, ha a sor a mi olvasásunk óta is inaktív maradt —
    // ha egy párhuzamos kérés közben már reaktiválta, nem írjuk felül
    // csendben, hanem visszaolvassuk a ténylegesen aktív állapotot.
    await prisma.saleReport.updateMany({
      where: { scooterId, isActive: false },
      data: {
        ownerId: userId,
        publicToken: token,
        isActive: true,
        revokedAt: null,
      },
    });
    const current = await prisma.saleReport.findUnique({
      where: { scooterId },
      select: {
        ownerId: true,
        isActive: true,
        publicToken: true,
        updatedAt: true,
      },
    });
    if (current?.isActive && current.ownerId === userId) {
      return {
        status: "ok",
        publicToken: current.publicToken,
        updatedAt: current.updatedAt,
      };
    }
    return { status: "not_found" };
  }

  // Még nem létező sor: create. Egyedi constraint ütközés esetén (egy
  // párhuzamos kérés közben már létrehozta) visszaolvassuk a ténylegesen
  // létrejött reportot, de csak akkor adjuk vissza sikeres válaszként, ha
  // az aktív ÉS a megfelelő ownerhez tartozik — eltérésnél nem szivárogtatunk
  // részletet, se nem javítunk automatikusan, csak semleges not_found-ot
  // adunk, mint egy sikertelen másodikat.
  try {
    const created = await prisma.saleReport.create({
      data: { scooterId, ownerId: userId, publicToken: token, isActive: true },
    });
    return {
      status: "ok",
      publicToken: created.publicToken,
      updatedAt: created.updatedAt,
    };
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      const current = await prisma.saleReport.findUnique({
        where: { scooterId },
        select: {
          ownerId: true,
          isActive: true,
          publicToken: true,
          updatedAt: true,
        },
      });
      if (current?.isActive && current.ownerId === userId) {
        return {
          status: "ok",
          publicToken: current.publicToken,
          updatedAt: current.updatedAt,
        };
      }
      return { status: "not_found" };
    }
    throw e;
  }
}

// Megosztás frissítése: nem generál új tokent, csak újraellenőrzi a
// readinesst és tudatosan megbillenti az `updatedAt`-et, hogy a publikus
// oldalon a "Frissítve" dátum a tulajdonos valódi műveletét tükrözze.
export async function refreshShare(
  userId: string,
  scooterId: string,
): Promise<ShareMutationResult> {
  const scooter = await findOwnedScooterForReport(userId, scooterId);
  if (!scooter) return { status: "not_found" };

  const readiness = computeReadiness(toReadinessInput(scooter));
  if (!readiness.canShare) {
    return { status: "not_ready", missingRequired: readiness.missingRequired };
  }

  const existing = await prisma.saleReport.findFirst({
    where: { scooterId, ownerId: userId, isActive: true },
  });
  if (!existing) return { status: "not_found" };

  // Explicit `updatedAt`: a Prisma `@updatedAt` mezője üres `data: {}`
  // update esetén nem billen, így a "Frissítve" dátum tudatosan, kézzel
  // kerül a jelenlegi időpontra.
  const refreshedAt = new Date();
  const report = await prisma.saleReport.update({
    where: { scooterId, ownerId: userId },
    data: { updatedAt: refreshedAt },
  });

  return {
    status: "ok",
    publicToken: report.publicToken,
    updatedAt: report.updatedAt,
  };
}

export async function revokeShare(
  userId: string,
  scooterId: string,
): Promise<{ status: "not_found" } | { status: "ok" }> {
  const result = await prisma.saleReport.updateMany({
    where: { scooterId, ownerId: userId, isActive: true },
    data: { isActive: false, revokedAt: new Date() },
  });
  return result.count > 0 ? { status: "ok" } : { status: "not_found" };
}

async function generateUniqueToken(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const token = generateShareToken();
    const existing = await prisma.saleReport.findUnique({
      where: { publicToken: token },
      select: { id: true },
    });
    if (!existing) return token;
  }
  throw new Error("Nem sikerült egyedi tokent generálni.");
}
