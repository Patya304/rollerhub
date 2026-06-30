import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getScootersByUser } from "@/modules/garage/services/scooter-service";
import { getRidesByUser } from "@/modules/rides/services/ride-service";
import { RidesView } from "@/modules/rides/components/rides-view";
import { AppPage, AppPageHeader } from "@/components/app-page";

export default async function RidesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [scooters, rides] = await Promise.all([
    getScootersByUser(session.user.id),
    getRidesByUser(session.user.id),
  ]);

  const scooterOptions = scooters.map((s) => ({
    id: s.id,
    name: `${s.brand} ${s.model}`,
  }));

  const items = rides.map((r) => ({
    id: r.id,
    scooterId: r.scooterId,
    scooterName: `${r.scooter.brand} ${r.scooter.model}`,
    startAt: r.startAt.toISOString(),
    endAt: r.endAt ? r.endAt.toISOString() : null,
    distanceKm: r.distanceKm,
    avgSpeed: r.avgSpeed,
    maxSpeed: r.maxSpeed,
  }));

  return (
    <AppPage>
      <AppPageHeader
        title="Menetek"
        description="Rögzítsd a menetidet, és kövesd a megtett távot rollerenként."
      />
      <RidesView scooters={scooterOptions} rides={items} />
    </AppPage>
  );
}
