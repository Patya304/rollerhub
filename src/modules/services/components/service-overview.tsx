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

  const filtered =
    filter === "all"
      ? services
      : services.filter((s) => s.scooterId === filter);

  const totalCost = filtered.reduce((sum, s) => sum + (s.cost ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
        >
          <option value="all">Összes roller</option>
          {scooters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <p className="text-muted-foreground text-sm">
          {filtered.length} bejegyzés · Összes költség:{" "}
          <span className="font-medium">
            {totalCost.toLocaleString("hu-HU")} Ft
          </span>
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nincs szerviz-bejegyzés.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((s) => (
            <li key={s.id} className="rounded-lg border p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">
                  {SERVICE_TYPE_LABELS[s.type]}
                </span>
                <span className="text-muted-foreground">
                  {new Date(s.performedAt).toLocaleDateString("hu-HU")}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                {s.scooterName}
                {s.odometerKm != null ? ` · ${s.odometerKm} km` : ""}
                {s.cost != null
                  ? ` · ${s.cost.toLocaleString("hu-HU")} Ft`
                  : ""}
              </p>
              {s.notes && <p className="mt-1">{s.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
