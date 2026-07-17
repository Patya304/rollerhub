"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateEstimate } from "@/modules/value/utils/calculate-estimate";
import { GarageVehicleListItem } from "@/components/garage-vehicle-list-item";
import {
  ScooterAddWizard,
  type ScooterAddValues,
} from "@/components/scooter-add-wizard";

type Scooter = {
  id: string;
  brand: string;
  model: string;
  color: string | null;
  serialNumber: string | null;
  year: number | null;
  currentMileage: number;
  purchasePrice: number | null;
  purchaseDate: string | null;
  batteryCapacity: number | null;
  topSpeed: number | null;
  rangeKm: number | null;
  photoUrl: string | null;
};

type AddedScooter = { id: string; name: string };

/**
 * Eltávolít egy query paramétert az URL-ből, minden más paraméter és a hash
 * fragment megőrzésével. Nem hoz létre history bejegyzést.
 */
function stripQueryParam(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  name: string,
) {
  const params = new URLSearchParams(window.location.search);
  if (!params.has(name)) return false;
  params.delete(name);
  const query = params.toString();
  router.replace(
    `${pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    { scroll: false },
  );
  return true;
}

function GarageListSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Garázs betöltése"
      className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="flex items-center gap-4 px-5 py-4"
        >
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Garage({
  initialShowForm = false,
}: {
  initialShowForm?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(initialShowForm);
  const [loadError, setLoadError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [justAdded, setJustAdded] = useState<AddedScooter | null>(null);
  const [deletedBannerVisible, setDeletedBannerVisible] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/scooters");
      if (res.ok) {
        setScooters(await res.json());
        setLoadError(false);
      } else {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    }
    setLoading(false);
    setRetrying(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  // Ha a rollerlapról ?deleted=1-gyel érkeztünk, mutassuk a visszajelzést,
  // majd tüntessük el a paramétert, hogy frissítéskor ne jelenjen meg újra.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("deleted")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeletedBannerVisible(true);
      stripQueryParam(router, pathname, "deleted");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ha a wizard ?add=1-ről nyílt, bezáráskor (mégsem vagy siker esetén is)
  // el kell tüntetni a paramétert, nehogy frissítéskor újra megnyíljon.
  // Csak az add paramétert töröljük: a többi query paraméter és a hash
  // fragment változatlanul megmarad.
  function closeForm() {
    setShowForm(false);
    stripQueryParam(router, pathname, "add");
  }

  function handleRetry() {
    setRetrying(true);
    setLoading(true);
    load();
  }

  function openForm() {
    setJustAdded(null);
    setShowForm(true);
  }

  async function handleAdd(values: ScooterAddValues): Promise<string | null> {
    try {
      const res = await fetch("/api/scooters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: values.brand,
          model: values.model,
          year: values.year || undefined,
          currentMileage: values.currentMileage || undefined,
          purchasePrice: values.purchasePrice || undefined,
          purchaseDate: values.purchaseDate || undefined,
          notes: values.notes || undefined,
          // Gyári adatok a katalógusból, ha ismertek
          batteryCapacity: values.batteryCapacity,
          topSpeed: values.topSpeed,
          rangeKm: values.rangeKm,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return data.error ?? "Hiba a mentéskor.";
      }
      const created = await res.json().catch(() => null);
      closeForm();
      setJustAdded(
        created?.id
          ? {
              id: created.id as string,
              name: `${values.brand} ${values.model}`,
            }
          : null,
      );
      await load();
      return null;
    } catch {
      return "Hálózati hiba a mentéskor.";
    }
  }

  return (
    <div className="space-y-4">
      {deletedBannerVisible && (
        <div
          role="status"
          aria-live="polite"
          className="border-primary/30 bg-primary/5 flex items-center justify-between gap-3 rounded-xl border px-5 py-4"
        >
          <p className="font-semibold">Roller törölve</p>
          <button
            type="button"
            onClick={() => setDeletedBannerVisible(false)}
            aria-label="Bezárás"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {justAdded && (
        <div
          role="status"
          aria-live="polite"
          className="border-primary/30 bg-primary/5 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4"
        >
          <div className="min-w-0">
            <p className="font-semibold">Roller hozzáadva</p>
            <p className="text-muted-foreground truncate text-sm">
              {justAdded.name}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button asChild size="sm">
              <Link href={`/garage/${justAdded.id}`}>Adatlap megnyitása →</Link>
            </Button>
            <button
              type="button"
              onClick={() => setJustAdded(null)}
              aria-label="Bezárás"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Roller lista — ELSŐ */}
      {loading ? (
        <GarageListSkeleton />
      ) : loadError ? (
        <div
          role="alert"
          className="rounded-xl border border-dashed px-8 py-10 text-center"
        >
          <p className="font-semibold">Nem sikerült betölteni a garázst.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Ellenőrizd a kapcsolatot, majd próbáld újra.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? "Próbálkozás..." : "Próbáld újra"}
          </Button>
        </div>
      ) : scooters.length === 0 ? (
        !showForm && (
          <div className="rounded-xl border border-dashed px-8 py-10 text-center">
            <p className="text-4xl">🛴</p>
            <p className="mt-4 font-semibold">A garázs üres</p>
            <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
              Add hozzá az első rollered. Ezzel indul a szervizkönyv és az
              értékbecslés, 2 perc az egész.
            </p>
            <Button className="mt-6" onClick={openForm}>
              Roller hozzáadása
            </Button>
          </div>
        )
      ) : (
        <div className="space-y-3">
          <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
            {scooters.map((s, idx) => {
              const est =
                s.purchasePrice != null
                  ? calculateEstimate({
                      purchasePrice: s.purchasePrice,
                      year: s.year,
                      currentMileage: s.currentMileage,
                      purchaseDate: s.purchaseDate,
                    })
                  : null;
              const meta = [
                s.year ? String(s.year) : null,
                `${s.currentMileage.toLocaleString("hu-HU")} km`,
                est != null ? `~${est.toLocaleString("hu-HU")} Ft` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <GarageVehicleListItem
                  key={s.id}
                  marker={String(idx + 1).padStart(2, "0")}
                  title={`${s.brand} ${s.model}`}
                  meta={meta}
                  href={`/garage/${s.id}`}
                  photoUrl={s.photoUrl}
                />
              );
            })}
          </div>

          {!showForm && (
            <Button variant="outline" size="sm" onClick={openForm}>
              + Új roller hozzáadása
            </Button>
          )}
        </div>
      )}

      {/* Hozzáadás — lépésenkénti wizard */}
      {showForm && (
        <ScooterAddWizard onSubmit={handleAdd} onCancel={closeForm} />
      )}
    </div>
  );
}
