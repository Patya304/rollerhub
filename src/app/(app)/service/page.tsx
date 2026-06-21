import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getScootersByUser } from "@/modules/garage/services/scooter-service";
import { getServicesByUser } from "@/modules/services/services/service-log-service";
import { ServiceOverview } from "@/modules/services/components/service-overview";
import { type ServiceType } from "@/modules/services/service-types";

export default async function ServicePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [scooters, services] = await Promise.all([
    getScootersByUser(session.user.id),
    getServicesByUser(session.user.id),
  ]);

  const scooterOptions = scooters.map((s) => ({
    id: s.id,
    name: `${s.brand} ${s.model}`,
  }));

  const items = services.map((s) => ({
    id: s.id,
    type: s.type as ServiceType,
    performedAt: s.performedAt.toISOString(),
    odometerKm: s.odometerKm,
    cost: s.cost,
    notes: s.notes,
    scooterId: s.scooterId,
    scooterName: `${s.scooter.brand} ${s.scooter.model}`,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Szerviz</h1>
      <p className="text-muted-foreground text-sm">
        Az összes rollered szerviztörténete egy helyen.
      </p>
      <ServiceOverview scooters={scooterOptions} services={items} />
    </div>
  );
}
