import { prisma } from "@/lib/prisma";
import { calculateEstimate } from "@/modules/value/utils/calculate-estimate";

export async function getDashboardData(userId: string) {
  const scooters = await prisma.scooter.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
  const scooterIds = scooters.map((s) => s.id);
  const byId = new Map(scooters.map((s) => [s.id, s]));

  let totalKm = 0;
  let totalPurchase = 0;
  let totalValue = 0;
  for (const s of scooters) {
    totalKm += s.currentMileage;
    if (s.purchasePrice != null) {
      totalPurchase += s.purchasePrice;
      totalValue += calculateEstimate({
        purchasePrice: s.purchasePrice,
        year: s.year,
        currentMileage: s.currentMileage,
        purchaseDate: s.purchaseDate,
      });
    }
  }
  const totalDepreciation = totalPurchase - totalValue;

  const [
    serviceCount,
    serviceCostAgg,
    rideCount,
    recentServices,
    recentEstimates,
  ] = await Promise.all([
    prisma.service.count({ where: { scooterId: { in: scooterIds } } }),
    prisma.service.aggregate({
      where: { scooterId: { in: scooterIds } },
      _sum: { cost: true },
    }),
    prisma.ride.count({ where: { scooterId: { in: scooterIds } } }),
    prisma.service.findMany({
      where: { scooterId: { in: scooterIds } },
      orderBy: { performedAt: "desc" },
      take: 5,
    }),
    prisma.valueEstimate.findMany({
      where: { scooterId: { in: scooterIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const nameOf = (scooterId: string) => {
    const s = byId.get(scooterId);
    return s ? `${s.brand} ${s.model}` : "Ismeretlen roller";
  };

  return {
    stats: {
      scooterCount: scooters.length,
      totalKm,
      totalValue,
      totalPurchase,
      totalDepreciation,
      serviceCount,
      totalServiceCost: serviceCostAgg._sum.cost ?? 0,
      rideCount,
    },
    recentScooters: scooters.slice(0, 5).map((s) => ({
      id: s.id,
      name: `${s.brand} ${s.model}`,
      year: s.year,
      currentMileage: s.currentMileage,
    })),
    recentServices: recentServices.map((s) => ({
      id: s.id,
      type: s.type,
      performedAt: s.performedAt,
      cost: s.cost,
      scooterName: nameOf(s.scooterId),
    })),
    recentEstimates: recentEstimates.map((e) => ({
      id: e.id,
      estimatedValue: e.estimatedValue,
      createdAt: e.createdAt,
      scooterName: nameOf(e.scooterId),
    })),
  };
}
