import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  buildPublicSaleReportDto,
  type SaleReportDto,
  type SaleReportOwner,
} from "@/modules/sale-report/dto";
import { evaluateStoredSnapshot } from "@/modules/sale-report/stored-snapshot";

// Publikus token alapú lekérdezés: kizárólag a validált, publikáláskor
// mentett snapshotból épül - SOHA nem élő roller adatból. A tulajdonosi
// blokk egy külön, élő privacy-lekérdezésből érkezik, hogy azonnal
// eltűnjön/visszatérjen a profil publikusságának változásakor, anélkül,
// hogy ez a snapshotot vagy annak hash-ét érintené.
// Semleges null minden hibás esetben (nincs ilyen token, vissza lett vonva,
// törölt roller/user, tulajdonos-inkonzisztencia, hiányzó snapshot, hibás
// snapshotVersion, hiányzó hash/publishedAt, hash mismatch, Zod-invalid
// JSON) - a hívó oldal mindig ugyanazt a semleges 404-et adja, nem
// különböztet ok szerint. Az `evaluateStoredSnapshot` helper garantálja,
// hogy ugyanaz a "valid tárolt snapshot" fogalom érvényesül itt, mint a
// tulajdonosi workspace-en.
export const getPublicSaleReportByToken = cache(
  async (token: string): Promise<SaleReportDto | null> => {
    const report = await prisma.saleReport.findUnique({
      where: { publicToken: token },
      select: {
        isActive: true,
        snapshot: true,
        snapshotHash: true,
        snapshotVersion: true,
        publishedAt: true,
        ownerId: true,
        scooter: {
          select: {
            deletedAt: true,
            userId: true,
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
    // adatinkonzisztencia) semleges null-t adunk vissza.
    if (report.ownerId !== report.scooter.userId) return null;

    const stored = evaluateStoredSnapshot(report);
    if (stored.status !== "valid") return null;

    const owner: SaleReportOwner =
      report.scooter.user.profileIsPublic && report.scooter.user.username
        ? {
            name:
              report.scooter.user.name ?? `@${report.scooter.user.username}`,
            username: report.scooter.user.username,
            image: report.scooter.user.image,
          }
        : null;

    return buildPublicSaleReportDto(
      stored.snapshot,
      report.publishedAt!,
      owner,
    );
  },
);
