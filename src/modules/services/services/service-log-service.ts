import { prisma } from "@/lib/prisma";

async function ownsScooter(userId: string, scooterId: string) {
  const scooter = await prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
    select: { id: true },
  });
  return !!scooter;
}

export async function getServicesByScooter(userId: string, scooterId: string) {
  if (!(await ownsScooter(userId, scooterId))) return null;
  return prisma.service.findMany({
    where: { scooterId },
    orderBy: { performedAt: "desc" },
  });
}

export async function createService(
  userId: string,
  scooterId: string,
  data: {
    type: string;
    performedAt: Date;
    odometerKm?: number;
    cost?: number;
    notes?: string;
  },
) {
  if (!(await ownsScooter(userId, scooterId))) return null;
  return prisma.service.create({
    data: {
      scooterId,
      type: data.type,
      performedAt: data.performedAt,
      odometerKm: data.odometerKm ?? null,
      cost: data.cost ?? null,
      notes: data.notes ?? null,
    },
  });
}

export async function deleteService(userId: string, serviceId: string) {
  const result = await prisma.service.deleteMany({
    where: { id: serviceId, scooter: { userId, deletedAt: null } },
  });
  return result.count;
}
