import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getScootersByUser } from "@/modules/garage/services/scooter-service";
import { calculateEstimate } from "@/modules/value/services/value-service";

export default async function ValuePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const scooters = await getScootersByUser(session.user.id);

  const rows = scooters.map((s) => {
    const estimate =
      s.purchasePrice != null
        ? calculateEstimate({
            purchasePrice: s.purchasePrice,
            year: s.year,
            currentMileage: s.currentMileage,
          })
        : null;
    const depreciation =
      s.purchasePrice != null && estimate != null
        ? s.purchasePrice - estimate
        : null;
    return { scooter: s, estimate, depreciation };
  });

  const totalPurchase = rows.reduce(
    (sum, r) => sum + (r.scooter.purchasePrice ?? 0),
    0,
  );
  const totalValue = rows.reduce((sum, r) => sum + (r.estimate ?? 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Értékbecslés</h1>
      <p className="text-muted-foreground text-sm">
        A becsült érték automatikusan frissül a vételár, évjárat és km-óra állás
        alapján.
      </p>

      {scooters.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Még nincs rollered. Vegyél fel egyet a Garázsban.
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {rows.map(({ scooter, estimate, depreciation }) => (
              <li key={scooter.id} className="rounded-lg border p-4">
                <p className="font-medium">
                  {scooter.brand} {scooter.model}
                </p>
                {estimate == null ? (
                  <p className="text-muted-foreground mt-1 text-sm">
                    Adj meg vételárat a Garázsban a becsléshez.
                  </p>
                ) : (
                  <div className="mt-1 text-sm">
                    <p>
                      Vételár: {scooter.purchasePrice!.toLocaleString("hu-HU")}{" "}
                      Ft
                    </p>
                    <p className="font-medium text-green-600">
                      Becsült érték most: {estimate.toLocaleString("hu-HU")} Ft
                    </p>
                    <p className="text-muted-foreground">
                      Értékvesztés: {depreciation!.toLocaleString("hu-HU")} Ft (
                      {Math.round(
                        (depreciation! / scooter.purchasePrice!) * 100,
                      )}
                      %)
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {totalPurchase > 0 && (
            <div className="rounded-lg border p-4">
              <p className="font-medium">Összesen</p>
              <p className="text-muted-foreground text-sm">
                Vételárak: {totalPurchase.toLocaleString("hu-HU")} Ft ·
                Jelenlegi becsült érték:{" "}
                <span className="font-medium text-green-600">
                  {totalValue.toLocaleString("hu-HU")} Ft
                </span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
