import { prisma } from "@/lib/prisma";

async function ownsScooter(userId: string, scooterId: string) {
  const scooter = await prisma.scooter.findFirst({
    where: { id: scooterId, userId, deletedAt: null },
    select: { id: true },
  });
  return !!scooter;
}

export async function getRidesByScooter(userId: string, scooterId: string) {
  if (!(await ownsScooter(userId, scooterId))) return null;
  return prisma.ride.findMany({
    where: { scooterId },
    orderBy: { startAt: "desc" },
  });
}

export async function createRide(
  userId: string,
  scooterId: string,
  data: {
    startAt: Date;
    endAt?: Date;
    distanceKm?: number;
    avgSpeed?: number;
    maxSpeed?: number;
  },
) {
  if (!(await ownsScooter(userId, scooterId))) return null;
  return prisma.ride.create({
    data: {
      scooterId,
      startAt: data.startAt,
      endAt: data.endAt ?? null,
      distanceKm: data.distanceKm ?? null,
      avgSpeed: data.avgSpeed ?? null,
      maxSpeed: data.maxSpeed ?? null,
    },
  });
}

export async function deleteRide(userId: string, rideId: string) {
  const result = await prisma.ride.deleteMany({
    where: { id: rideId, scooter: { userId, deletedAt: null } },
  });
  return result.count;
}
