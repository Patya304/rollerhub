import { prisma } from "@/lib/prisma";
import { calculateEstimate } from "@/modules/value/utils/calculate-estimate";

const ALGORITHM_VERSION = "v1";

export async function estimateScooterValue(userId: string, scooterId: string) {
  const scooter = await prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
  });

  if (!scooter) {
    return { status: "not_found" as const };
  }
  // A vételár csak akkor használható becslési alapnak, ha pozitív.
  if (scooter.purchasePrice == null || scooter.purchasePrice <= 0) {
    return { status: "no_price" as const };
  }

  const estimatedValue = calculateEstimate({
    purchasePrice: scooter.purchasePrice,
    year: scooter.year,
    currentMileage: scooter.currentMileage,
    purchaseDate: scooter.purchaseDate,
  });

  // Dedup: ha az utolsó becslés ugyanaz az érték és algoritmus-verzió,
  // ne hozzunk létre új rekordot (ne szemeteljük az értéktörténetet).
  const last = await prisma.valueEstimate.findFirst({
    where: { scooterId },
    orderBy: { createdAt: "desc" },
  });

  if (
    last &&
    last.estimatedValue === estimatedValue &&
    last.algorithmVersion === ALGORITHM_VERSION
  ) {
    return { status: "ok" as const, estimatedValue, saved: false };
  }

  await prisma.valueEstimate.create({
    data: {
      scooterId,
      estimatedValue,
      algorithmVersion: ALGORITHM_VERSION,
    },
  });

  return { status: "ok" as const, estimatedValue, saved: true };
}

export async function getValueHistory(userId: string, scooterId: string) {
  const scooter = await prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
    select: { id: true },
  });
  if (!scooter) return null;

  return prisma.valueEstimate.findMany({
    where: { scooterId },
    orderBy: { createdAt: "asc" },
    select: { id: true, estimatedValue: true, createdAt: true },
  });
}
