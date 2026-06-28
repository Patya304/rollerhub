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
      emailVerified: true,
      preferredLanguage: true,
      theme: true,
    },
  });
}

export async function updateUserSettings(
  userId: string,
  data: {
    username: string | null;
    name: string | null;
    image: string | null;
    preferredLanguage: Language;
    theme: Theme;
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

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        name: data.name,
        image: data.image,
        preferredLanguage: data.preferredLanguage,
        theme: data.theme,
      },
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return { status: "username_taken" as const };
    }
    throw e;
  }

  return { status: "ok" as const };
}
