import { prisma } from "@/lib/prisma";

export async function getScootersByUser(userId: string) {
  return prisma.scooter.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function createScooter(
  userId: string,
  data: {
    brand: string;
    model: string;
    year?: number;
    currentMileage?: number;
    purchasePrice?: number;
    notes?: string;
  },
) {
  return prisma.scooter.create({
    data: {
      userId,
      brand: data.brand,
      model: data.model,
      year: data.year ?? null,
      currentMileage: data.currentMileage ?? 0,
      purchasePrice: data.purchasePrice ?? null,
      notes: data.notes ?? null,
    },
  });
}

export async function updateScooter(
  userId: string,
  id: string,
  data: {
    brand?: string;
    model?: string;
    year?: number | null;
    currentMileage?: number;
    notes?: string | null;
  },
) {
  const result = await prisma.scooter.updateMany({
    where: { id, userId, deletedAt: null },
    data,
  });
  return result.count;
}

export async function deleteScooter(userId: string, id: string) {
  const result = await prisma.scooter.updateMany({
    where: { id, userId, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  return result.count;
}
