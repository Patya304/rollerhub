"use client";

import { useState } from "react";
import {
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "@/modules/services/service-types";

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
  const [showForm, setShowForm] = useState(false);

  const filtered =
    filter === "all"
      ? services
      : services.filter((s) => s.scooterId === filter);

  const totalCost = filtered.reduce((sum, s) => sum + (s.cost ?? 0), 0);

  return (
    <div className="space-y-4">
      {/* Info panel — ha üres */}
      {services.length === 0 && (
        <div className="rounded-xl border border-dashed px-8 py-14 text-center">
          <p className="text-4xl">🔧</p>
          <p className="mt-4 font-semibold">Még nincs szerviz-bejegyzés</p>
          <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
            Rögzíts gumicserét, fékállítást, akkumulátor-ellenőrzést — minden
            roller egy helyen.
          </p>
        </div>
      )}

      {/* Filter + összesítő */}
      {services.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              {filtered.length} bejegyzés
            </span>
            <span className="bg-muted/60 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold tabular-nums">
              {totalCost.toLocaleString("hu-HU")} Ft
            </span>
          </div>
        </div>
      )}

      {/* Lista */}
      {filtered.length > 0 && (
        <div className="bg-card overflow-hidden rounded-xl border">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="[&:not(:last-child)]:border-border/40 flex items-start justify-between gap-3 px-5 py-4 text-sm [&:not(:last-child)]:border-b"
            >
              <div className="min-w-0">
                <p className="font-semibold">{SERVICE_TYPE_LABELS[s.type]}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {s.scooterName}
                  {s.odometerKm != null
                    ? ` · ${s.odometerKm.toLocaleString("hu-HU")} km`
                    : ""}
                </p>
                {s.notes && (
                  <p className="text-muted-foreground mt-1.5 text-xs leading-snug">
                    {s.notes}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-muted-foreground text-xs">
                  {new Date(s.performedAt).toLocaleDateString("hu-HU")}
                </p>
                {s.cost != null && (
                  <p className="mt-0.5 font-mono text-xs font-semibold tabular-nums">
                    {s.cost.toLocaleString("hu-HU")} Ft
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && services.length > 0 && (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Ehhez a rollerhez még nincs szerviz-bejegyzés.
        </p>
      )}
    </div>
  );
}
