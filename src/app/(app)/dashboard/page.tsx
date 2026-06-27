import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/modules/dashboard/services/dashboard-service";
import {
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "@/modules/services/service-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatFt(n: number) {
  return `${n.toLocaleString("hu-HU")} Ft`;
}

export default async function OverviewPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const data = await getDashboardData(session.user.id);
  const { stats } = data;

  if (stats.scooterCount === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Áttekintés</h1>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">Még nincs rollered</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Add hozzá az első rollered, és itt megjelennek az összesítők: érték,
            szervizköltség, megtett táv.
          </p>
          <Button asChild className="mt-4">
            <Link href="/garage">Új roller hozzáadása</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Rollerek", value: String(stats.scooterCount) },
    {
      label: "Összes km",
      value: `${stats.totalKm.toLocaleString("hu-HU")} km`,
    },
    { label: "Becsült összérték", value: formatFt(stats.totalValue) },
    { label: "Összes vételár", value: formatFt(stats.totalPurchase) },
    { label: "Értékvesztés", value: formatFt(stats.totalDepreciation) },
    { label: "Szervizek", value: String(stats.serviceCount) },
    { label: "Szervizköltség", value: formatFt(stats.totalServiceCost) },
    { label: "Menetek", value: String(stats.rideCount) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Áttekintés</h1>
        <Button asChild size="sm" variant="outline">
          <Link href="/garage">Új roller hozzáadása</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">{c.label}</p>
            <p className="mt-1 text-lg font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Legutóbbi rollerek</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentScooters.length === 0 ? (
              <p className="text-muted-foreground text-sm">–</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.recentScooters.map((s) => (
                  <li key={s.id}>
                    <Link href={`/garage/${s.id}`} className="hover:underline">
                      <span className="font-medium">{s.name}</span>
                    </Link>
                    <span className="text-muted-foreground">
                      {" · "}
                      {[
                        s.year ? `${s.year}` : null,
                        `${s.currentMileage.toLocaleString("hu-HU")} km`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legutóbbi szervizek</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentServices.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Még nincs szerviz.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.recentServices.map((s) => (
                  <li key={s.id}>
                    <span className="font-medium">
                      {SERVICE_TYPE_LABELS[s.type as ServiceType]}
                    </span>
                    <span className="text-muted-foreground">
                      {" · "}
                      {s.scooterName}
                      {" · "}
                      {new Date(s.performedAt).toLocaleDateString("hu-HU")}
                      {s.cost != null
                        ? ` · ${s.cost.toLocaleString("hu-HU")} Ft`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legutóbbi értékbecslések</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentEstimates.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Még nincs becslés.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.recentEstimates.map((e) => (
                  <li key={e.id}>
                    <span className="font-medium">
                      {e.estimatedValue.toLocaleString("hu-HU")} Ft
                    </span>
                    <span className="text-muted-foreground">
                      {" · "}
                      {e.scooterName}
                      {" · "}
                      {new Date(e.createdAt).toLocaleDateString("hu-HU")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
