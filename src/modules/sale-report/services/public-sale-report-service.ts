import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  buildSaleReportDto,
  type SaleReportDto,
} from "@/modules/sale-report/dto";

// Publikus token alapú lekérdezés: csak akkor ad vissza adatot, ha a
// megosztás aktív, a roller és a tulajdonos sincs törölve. Minden más
// esetben null (a hívó oldal semleges notFound()-ot ad, nem különböztet
// "nincs ilyen token" és "vissza lett vonva" között).
// Soha nem kerülhet ide: email, user id, alvázszám, megjegyzés, vételár,
// vásárlás dátuma, értéktörténet, szerviz költség/megjegyzés, ride adat.
export const getPublicSaleReportByToken = cache(
  async (token: string): Promise<SaleReportDto | null> => {
    const report = await prisma.saleReport.findUnique({
      where: { publicToken: token },
      select: {
        isActive: true,
        updatedAt: true,
        ownerId: true,
        scooter: {
          select: {
            deletedAt: true,
            userId: true,
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
              orderBy: { performedAt: "desc" },
              select: { type: true, performedAt: true, odometerKm: true },
            },
            _count: { select: { services: { where: { deletedAt: null } } } },
            valueEstimates: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { estimatedValue: true },
            },
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                profileIsPublic: true,
                deletedAt: true,
              },
            },
          },
        },
      },
    });

    if (!report) return null;
    if (!report.isActive) return null;
    if (report.scooter.deletedAt != null) return null;
    if (report.scooter.user.deletedAt != null) return null;
    // Tulajdonosi konzisztencia: a report ownerId-jének pontosan a roller
    // tényleges userId-jével kell egyeznie. Eltérés esetén (pl. korábbi
    // adatinkonzisztencia) semleges null-t adunk vissza — nem javítunk
    // automatikusan, és nem adunk ki tulajdonosi/rolleradatot.
    if (report.ownerId !== report.scooter.userId) return null;

    return buildSaleReportDto({
      scooter: {
        brand: report.scooter.brand,
        model: report.scooter.model,
        year: report.scooter.year,
        photoUrl: report.scooter.photoUrl,
        currentMileage: report.scooter.currentMileage,
        batteryCapacity: report.scooter.batteryCapacity,
        topSpeed: report.scooter.topSpeed,
        rangeKm: report.scooter.rangeKm,
        color: report.scooter.color,
        services: report.scooter.services,
        serviceCount: report.scooter._count.services,
        estimatedValue:
          report.scooter.valueEstimates[0]?.estimatedValue ?? null,
        user: {
          name: report.scooter.user.name,
          username: report.scooter.user.username,
          image: report.scooter.user.image,
          profileIsPublic: report.scooter.user.profileIsPublic,
        },
      },
      updatedAt: report.updatedAt,
    });
  },
);
