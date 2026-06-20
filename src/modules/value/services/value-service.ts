import { prisma } from "@/lib/prisma";

const ALGORITHM_VERSION = "v1";

export function calculateEstimate(input: {
  purchasePrice: number;
  year: number | null;
  currentMileage: number;
}): number {
  const currentYear = new Date().getFullYear();
  const ageYears = input.year ? Math.max(0, currentYear - input.year) : 0;
  const ageDep = ageYears * 0.12; // 12% / év
  const kmDep = (input.currentMileage / 1000) * 0.01; // 1% / 1000 km
  const totalDep = Math.min(0.8, ageDep + kmDep); // max 80%
  return Math.round(input.purchasePrice * (1 - totalDep));
}

export async function estimateScooterValue(userId: string, scooterId: string) {
  const scooter = await prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
  });

  if (!scooter) {
    return { status: "not_found" as const };
  }
  if (!scooter.purchasePrice) {
    return { status: "no_price" as const };
  }

  const estimatedValue = calculateEstimate({
    purchasePrice: scooter.purchasePrice,
    year: scooter.year,
    currentMileage: scooter.currentMileage,
  });

  await prisma.valueEstimate.create({
    data: {
      scooterId,
      estimatedValue,
      algorithmVersion: ALGORITHM_VERSION,
    },
  });

  return { status: "ok" as const, estimatedValue };
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
