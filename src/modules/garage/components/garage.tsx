"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

export function Garage() {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loadError, setLoadError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/scooters");
      if (res.ok) {
        setScooters(await res.json());
        setLoadError("");
      } else {
        setLoadError("Nem sikerült betölteni a garázst. Frissítsd az oldalt.");
      }
    } catch {
      setLoadError("Nem sikerült betölteni a garázst. Frissítsd az oldalt.");
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

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
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return data.error ?? "Hiba a mentéskor.";
      }
      setShowForm(false);
      await load();
      return null;
    } catch {
      return "Hálózati hiba a mentéskor.";
    }
  }

  return (
    <div className="space-y-4">
      {/* Roller lista — ELSŐ */}
      {loading ? (
        <p className="text-muted-foreground py-4 text-sm">Betöltés...</p>
      ) : loadError ? (
        <p className="py-4 text-sm text-red-500">{loadError}</p>
      ) : scooters.length === 0 ? (
        !showForm && (
          <div className="rounded-xl border border-dashed px-8 py-10 text-center">
            <p className="text-4xl">🛴</p>
            <p className="mt-4 font-semibold">A garázs üres</p>
            <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
              Add hozzá az első rollered. Ezután használhatod:
            </p>
            <ul className="text-muted-foreground mx-auto mt-3 max-w-xs space-y-1 text-left text-sm">
              <li>🔧 Szervizkönyv: gumicsere, fékállítás, ellenőrzés</li>
              <li>📊 Értékbecslés: becsült érték és értékvesztés</li>
              <li>📋 Állapotlap: ha később eladnád</li>
            </ul>
            <Button className="mt-6" onClick={() => setShowForm(true)}>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              + Új roller hozzáadása
            </Button>
          )}
        </div>
      )}

      {/* Hozzáadás — lépésenkénti wizard */}
      {showForm && (
        <ScooterAddWizard
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
