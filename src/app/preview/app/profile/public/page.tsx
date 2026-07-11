import Link from "next/link";
import { AppPage } from "@/components/app-page";
import { PublicProfileView } from "@/modules/profile/components/public-profile-view";
import { DEMO_SCOOTERS, DEMO_USER } from "@/modules/preview/demo-data";

export default function PreviewPublicProfilePage() {
  // Csak a publikusra jelölt rollerek — a privát (Ninebot) nem jelenik meg,
  // és a statokba sem számít bele.
  const publicScooters = DEMO_SCOOTERS.filter((s) => s.isPublic);
  const totalKm = publicScooters.reduce((sum, s) => sum + s.currentMileage, 0);
  const serviceCount = publicScooters.reduce(
    (sum, s) => sum + s.serviceCount,
    0,
  );

  return (
    <AppPage>
      <Link
        href="/preview/app/profile/me"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        ← Profilom
      </Link>

      <PublicProfileView
        name={DEMO_USER.name}
        username={DEMO_USER.username}
        image={null}
        bio={DEMO_USER.bio}
        memberSinceYear={2026}
        scooters={publicScooters.map((s) => ({
          brand: s.brand,
          model: s.model,
          year: s.year,
          currentMileage: s.currentMileage,
        }))}
        totalKm={totalKm}
        serviceCount={serviceCount}
        eyebrow="Publikus profil · Előnézet"
      />

      <p className="text-muted-foreground text-xs">
        Előnézet demóadatokkal: a garázsban lévő Ninebot privát, ezért itt nem
        látszik.
      </p>
    </AppPage>
  );
}
