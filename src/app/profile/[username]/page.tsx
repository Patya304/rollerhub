import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getPublicProfileByUsername } from "@/modules/profile/services/public-profile-service";
import { PublicProfileView } from "@/modules/profile/components/public-profile-view";

// A kanonikus URL formátum: /profile/@felhasznalonev
function parseUsername(raw: string): string | null {
  const decoded = decodeURIComponent(raw);
  if (!decoded.startsWith("@")) return null;
  return decoded.slice(1).toLowerCase() || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username: raw } = await params;
  const username = parseUsername(raw);
  const profile = username ? await getPublicProfileByUsername(username) : null;
  if (!profile) {
    return { title: "Ez a profil nem található – RollerHub" };
  }
  const displayName = profile.name ?? `@${profile.username}`;
  return {
    title: `${displayName} (@${profile.username}) – RollerHub`,
    description: `${displayName} publikus profilja a RollerHubon.`,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: raw } = await params;
  const username = parseUsername(raw);

  // @ nélküli URL-t átirányítunk a kanonikus @-os formára
  if (username === null) {
    const bare = decodeURIComponent(raw).toLowerCase();
    if (bare) redirect(`/profile/@${bare}`);
    notFound();
  }

  const profile = await getPublicProfileByUsername(username);
  if (!profile) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const isOwnProfile = session?.user.id === profile.id;

  const displayName = profile.name ?? `@${profile.username}`;

  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          ← RollerHub
        </Link>
        {isOwnProfile && (
          <Link
            href="/profile/me"
            className="text-primary text-sm font-medium hover:underline"
          >
            Profil szerkesztése
          </Link>
        )}
      </div>

      <PublicProfileView
        name={displayName}
        username={profile.username ?? username}
        image={profile.image}
        bio={profile.bio}
        memberSinceYear={profile.createdAt.getFullYear()}
        scooters={profile.scooters}
        totalKm={profile.totalKm}
        serviceCount={profile.serviceCount}
      />
    </main>
  );
}
