import { prisma } from "@/lib/prisma";
import { ServiceType } from "@/modules/services/service-types";

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
    where: { scooterId, deletedAt: null },
    orderBy: { performedAt: "desc" },
  });
}

export async function getServicesByUser(userId: string) {
  return prisma.service.findMany({
    where: { scooter: { userId, deletedAt: null }, deletedAt: null },
    orderBy: { performedAt: "desc" },
    include: { scooter: { select: { id: true, brand: true, model: true } } },
  });
}

export async function createService(
  userId: string,
  scooterId: string,
  data: {
    type: ServiceType;
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

export async function updateService(
  userId: string,
  serviceId: string,
  data: {
    type?: ServiceType;
    performedAt?: Date;
    odometerKm?: number | null;
    cost?: number | null;
    notes?: string | null;
  },
) {
  const result = await prisma.service.updateMany({
    where: {
      id: serviceId,
      deletedAt: null,
      scooter: { userId, deletedAt: null },
    },
    data,
  });
  return result.count;
}

export async function deleteService(userId: string, serviceId: string) {
  const result = await prisma.service.updateMany({
    where: {
      id: serviceId,
      deletedAt: null,
      scooter: { userId, deletedAt: null },
    },
    data: { deletedAt: new Date() },
  });
  return result.count;
}
