"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "@/modules/services/service-types";

type Service = {
  id: string;
  type: ServiceType;
  performedAt: string;
  odometerKm: number | null;
  cost: number | null;
  notes: string | null;
};

export function ServiceLog({ scooterId }: { scooterId: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ServiceType | "">("");
  const [date, setDate] = useState("");
  const [km, setKm] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch(`/api/scooters/${scooterId}/services`);
    if (res.ok) setServices(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleAdd() {
    setError("");
    if (!type || !date) {
      setError("A típus és a dátum kötelező.");
      return;
    }
    const res = await fetch(`/api/scooters/${scooterId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        performedAt: date,
        odometerKm: km || undefined,
        cost: cost || undefined,
        notes: notes || undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Hiba a mentéskor.");
      return;
    }
    setType("");
    setDate("");
    setKm("");
    setCost("");
    setNotes("");
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Törlöd ezt a szerviz-bejegyzést?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mt-3 space-y-3 border-t pt-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`type-${scooterId}`}>Típus</Label>
          <select
            id={`type-${scooterId}`}
            value={type}
            onChange={(e) => setType(e.target.value as ServiceType | "")}
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          >
            <option value="">Válassz típust…</option>
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>
                {SERVICE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`date-${scooterId}`}>Dátum</Label>
          <Input
            id={`date-${scooterId}`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`km-${scooterId}`}>Km (opc.)</Label>
          <Input
            id={`km-${scooterId}`}
            type="number"
            value={km}
            onChange={(e) => setKm(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`cost-${scooterId}`}>Költség Ft (opc.)</Label>
          <Input
            id={`cost-${scooterId}`}
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label htmlFor={`notes-${scooterId}`}>Megjegyzés (opc.)</Label>
          <Input
            id={`notes-${scooterId}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button size="sm" onClick={handleAdd}>
        Szerviz hozzáadása
      </Button>

      {loading ? (
        <p className="text-muted-foreground text-sm">Betöltés...</p>
      ) : services.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Még nincs szerviz-bejegyzés.
        </p>
      ) : (
        <ul className="space-y-1">
          {services.map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between gap-2 rounded border p-2 text-sm"
            >
              <div>
                <span>
                  <strong>{SERVICE_TYPE_LABELS[s.type]}</strong> ·{" "}
                  {new Date(s.performedAt).toLocaleDateString("hu-HU")}
                  {s.odometerKm ? ` · ${s.odometerKm} km` : ""}
                  {s.cost ? ` · ${s.cost.toLocaleString("hu-HU")} Ft` : ""}
                </span>
                {s.notes && <p className="text-muted-foreground">{s.notes}</p>}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(s.id)}
              >
                Törlés
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
