import { cache } from "react";
import { prisma } from "@/lib/prisma";

// Publikus profil lekérdezés: csak biztonságos mezőket ad vissza.
// Privát profil (profileIsPublic: false) ugyanúgy null, mint a nem létező,
// így kívülről nem deríthető ki, hogy a felhasználó létezik-e.
// Rollerek közül csak az isPublic: true jelenik meg, a statok is csak
// ezekből számolódnak.
// Soha nem kerülhet ide: email, account/session adat, alvázszám,
// privát megjegyzés, vételár, becsült érték, törölt user vagy roller.
// A user.id csak a "saját profil" ellenőrzéshez kell, a UI nem jeleníti meg.
export const getPublicProfileByUsername = cache(async (username: string) => {
  const user = await prisma.user.findFirst({
    where: { username, deletedAt: null, profileIsPublic: true },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
      scooters: {
        where: { deletedAt: null, isPublic: true },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          currentMileage: true,
          photoUrl: true,
        },
      },
    },
  });
  if (!user) return null;

  const serviceCount = await prisma.service.count({
    where: {
      deletedAt: null,
      scooter: { userId: user.id, deletedAt: null, isPublic: true },
    },
  });

  const totalKm = user.scooters.reduce((sum, s) => sum + s.currentMileage, 0);

  return { ...user, serviceCount, totalKm };
});

// Publikus roller adatlap: csak akkor ad vissza adatot, ha a user és a
// roller is publikus, nincs törölve, és a roller tényleg az adott userhez
// tartozik. Soha nem tartalmazhat: alvázszám, megjegyzés, vételár, vásárlás
// dátuma, becsült érték, szervizrészletek.
export const getPublicScooter = cache(
  async (username: string, scooterId: string) => {
    const scooter = await prisma.scooter.findFirst({
      where: {
        id: scooterId,
        isPublic: true,
        deletedAt: null,
        user: { username, deletedAt: null, profileIsPublic: true },
      },
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        currentMileage: true,
        photoUrl: true,
        _count: { select: { services: { where: { deletedAt: null } } } },
        user: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });
    if (!scooter) return null;
    return scooter;
  },
);
