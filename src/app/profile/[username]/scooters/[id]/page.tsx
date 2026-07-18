import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPublicScooter } from "@/modules/profile/services/public-profile-service";
import { PublicScooterView } from "@/modules/profile/components/public-scooter-view";

function parseUsername(raw: string): string | null {
  const decoded = decodeURIComponent(raw);
  if (!decoded.startsWith("@")) return null;
  return decoded.slice(1).toLowerCase() || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}): Promise<Metadata> {
  const { username: raw, id } = await params;
  const username = parseUsername(raw);
  const scooter = username ? await getPublicScooter(username, id) : null;
  if (!scooter) {
    return { title: "Ez a roller nem található – RollerHub" };
  }
  return {
    title: `${scooter.brand} ${scooter.model} – RollerHub`,
    description: `${scooter.brand} ${scooter.model} publikus roller adatlapja a RollerHubon.`,
  };
}

export default async function PublicScooterPage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { username: raw, id } = await params;
  const username = parseUsername(raw);

  if (username === null) {
    const bare = decodeURIComponent(raw).toLowerCase();
    if (bare) redirect(`/profile/@${bare}/scooters/${id}`);
    notFound();
  }

  const scooter = await getPublicScooter(username, id);
  if (!scooter) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 px-4 py-10">
      <Link
        href={`/profile/@${username}`}
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        ← Profil
      </Link>

      <PublicScooterView
        brand={scooter.brand}
        model={scooter.model}
        year={scooter.year}
        currentMileage={scooter.currentMileage}
        photoUrl={scooter.photoUrl}
        serviceCount={scooter._count.services}
        ownerName={scooter.user.name ?? `@${scooter.user.username}`}
        ownerUsername={scooter.user.username ?? username}
      />
    </main>
  );
}
