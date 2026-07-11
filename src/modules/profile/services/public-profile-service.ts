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
          brand: true,
          model: true,
          year: true,
          currentMileage: true,
        },
      },
    },
  });
  if (!user) return null;

  const serviceCount = await prisma.service.count({
    where: {
      scooter: { userId: user.id, deletedAt: null, isPublic: true },
    },
  });

  const totalKm = user.scooters.reduce((sum, s) => sum + s.currentMileage, 0);

  return { ...user, serviceCount, totalKm };
});
