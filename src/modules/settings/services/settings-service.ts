import { prisma } from "@/lib/prisma";
import type {
  Language,
  Theme,
} from "@/modules/settings/schemas/settings-schema";

export async function getUserSettings(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      image: true,
      username: true,
      bio: true,
      profileIsPublic: true,
      emailVerified: true,
      preferredLanguage: true,
      theme: true,
    },
  });
}

// Részleges frissítés: csak a payloadban szereplő mezők módosulnak.
export async function updateUserSettings(
  userId: string,
  data: {
    username?: string | null;
    name?: string | null;
    image?: string | null;
    bio?: string | null;
    profileIsPublic?: boolean;
    preferredLanguage?: Language;
    theme?: Theme;
  },
) {
  if (data.username) {
    const existing = await prisma.user.findFirst({
      where: { username: data.username, id: { not: userId } },
      select: { id: true },
    });
    if (existing) {
      return { status: "username_taken" as const };
    }
  }

  const update: {
    username?: string | null;
    name?: string | null;
    image?: string | null;
    bio?: string | null;
    profileIsPublic?: boolean;
    preferredLanguage?: Language;
    theme?: Theme;
  } = {};

  if (data.username !== undefined) update.username = data.username;
  if (data.name !== undefined) update.name = data.name;
  if (data.image !== undefined) update.image = data.image;
  if (data.bio !== undefined) update.bio = data.bio;
  if (data.profileIsPublic !== undefined) {
    // Username nélkül a profil nem lehet publikus (a schema is védi).
    update.profileIsPublic = data.username ? data.profileIsPublic : false;
  }
  // Ha a username törlődik, a profil ne maradhasson publikus.
  if (data.username === null) update.profileIsPublic = false;
  if (data.preferredLanguage !== undefined)
    update.preferredLanguage = data.preferredLanguage;
  if (data.theme !== undefined) update.theme = data.theme;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: update,
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return { status: "username_taken" as const };
    }
    throw e;
  }

  return { status: "ok" as const };
}
