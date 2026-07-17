import { prisma } from "@/lib/prisma";

export async function getScootersByUser(userId: string) {
  return prisma.scooter.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getScooterDetails(userId: string, scooterId: string) {
  return prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
    include: {
      services: { orderBy: { performedAt: "desc" }, take: 3 },
      valueEstimates: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { services: true, rides: true } },
    },
  });
}

export async function createScooter(
  userId: string,
  data: {
    brand: string;
    model: string;
    color?: string;
    serialNumber?: string;
    year?: number;
    currentMileage?: number;
    purchasePrice?: number;
    purchaseDate?: Date;
    batteryCapacity?: number;
    topSpeed?: number;
    rangeKm?: number;
    photoUrl?: string;
    notes?: string;
  },
) {
  return prisma.scooter.create({
    data: {
      userId,
      brand: data.brand,
      model: data.model,
      color: data.color ?? null,
      serialNumber: data.serialNumber ?? null,
      year: data.year ?? null,
      currentMileage: data.currentMileage ?? 0,
      purchasePrice: data.purchasePrice ?? null,
      purchaseDate: data.purchaseDate ?? null,
      batteryCapacity: data.batteryCapacity ?? null,
      topSpeed: data.topSpeed ?? null,
      rangeKm: data.rangeKm ?? null,
      photoUrl: data.photoUrl ?? null,
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
    color?: string | null;
    serialNumber?: string | null;
    year?: number | null;
    currentMileage?: number;
    purchasePrice?: number | null;
    purchaseDate?: Date | null;
    batteryCapacity?: number | null;
    topSpeed?: number | null;
    rangeKm?: number | null;
    photoUrl?: string | null;
    notes?: string | null;
    isPublic?: boolean;
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
