"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "@/modules/services/service-types";
import { ServiceListItem } from "@/modules/services/components/service-list-item";

type ServiceItem = {
  id: string;
  type: ServiceType;
  performedAt: string;
  odometerKm: number | null;
  cost: number | null;
  notes: string | null;
  scooterId: string;
  scooterName: string;
};

export function ServiceOverview({
  scooters,
  services,
}: {
  scooters: { id: string; name: string }[];
  services: ServiceItem[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? services
      : services.filter((s) => s.scooterId === filter);

  const totalCost = filtered.reduce((sum, s) => sum + (s.cost ?? 0), 0);

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-8 py-14 text-center">
        <p className="text-4xl">🔧</p>
        <p className="mt-4 font-semibold">Még nincs szervizbejegyzés</p>
        <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
          {scooters.length > 0
            ? "Rögzítsd az első javítást vagy ellenőrzést a roller adatlapján."
            : "Előbb add hozzá az első rollered."}
        </p>
        <Button asChild className="mt-6">
          {scooters.length > 0 ? (
            <Link href={`/garage/${scooters[0].id}#szerviz`}>
              Szerviz rögzítése
            </Link>
          ) : (
            <Link href="/garage?add=1">Roller hozzáadása</Link>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter + összesítő sor — szűrő csak több roller esetén */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {scooters.length > 1 ? (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="all">Összes roller</option>
            {scooters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {filtered.length} bejegyzés
          </span>
          {totalCost > 0 && (
            <span className="bg-muted/60 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold tabular-nums">
              {totalCost.toLocaleString("hu-HU")} Ft
            </span>
          )}
        </div>
      </div>

      {/* Szerviz lista */}
      {filtered.length > 0 ? (
        <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
          {filtered.map((s) => (
            <ServiceListItem
              key={s.id}
              title={SERVICE_TYPE_LABELS[s.type]}
              scooterName={s.scooterName}
              performedAt={s.performedAt}
              odometerKm={s.odometerKm}
              cost={s.cost}
              notes={s.notes}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Ehhez a rollerhez még nincs szervizbejegyzés.
        </p>
      )}
    </div>
  );
}
