"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ServiceType | "">("");
  const [date, setDate] = useState("");
  const [km, setKm] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/scooters/${scooterId}/services`);
      if (res.ok) {
        setServices(await res.json());
        setLoadError("");
      } else {
        setLoadError(
          "Nem sikerült betölteni a szervizeket. Frissítsd az oldalt.",
        );
      }
    } catch {
      setLoadError(
        "Nem sikerült betölteni a szervizeket. Frissítsd az oldalt.",
      );
    }
    setLoading(false);
  }, [scooterId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // A dátum alapból a mai nap, mert a legtöbb szervizt aznap rögzítik.
  // useEffect-ben, hogy a szerver és a kliens időzónája ne térhessen el.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate((d) => d || new Date().toLocaleDateString("sv"));
  }, []);

  async function handleAdd() {
    setError("");
    if (!type || !date) {
      setError("A típus és a dátum kötelező.");
      return;
    }
    setBusy(true);
    try {
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
      setDate(new Date().toLocaleDateString("sv"));
      setKm("");
      setCost("");
      setNotes("");
      await load();
      router.refresh();
    } catch {
      setError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Törlöd ezt a szervizbejegyzést?")) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Hiba a törléskor.");
        return;
      }
      await load();
      router.refresh();
    } catch {
      setError("Hálózati hiba a törléskor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Meglévő szervizek */}
      {loading ? (
        <p className="text-muted-foreground text-sm">Betöltés...</p>
      ) : loadError ? (
        <p className="text-sm text-red-500">{loadError}</p>
      ) : services.length === 0 ? (
        <div className="rounded-lg border border-dashed px-5 py-8 text-center">
          <p className="text-2xl">🔧</p>
          <p className="mt-2.5 font-semibold">Nincs szerviz rögzítve</p>
          <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm">
            Rögzítsd az első javítást vagy ellenőrzést.
          </p>
        </div>
      ) : (
        <div className="divide-border/30 divide-y">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex items-start justify-between gap-3 py-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{SERVICE_TYPE_LABELS[s.type]}</p>
                <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                  {new Date(s.performedAt).toLocaleDateString("hu-HU")}
                  {s.odometerKm
                    ? ` · ${s.odometerKm.toLocaleString("hu-HU")} km`
                    : ""}
                  {s.cost ? ` · ${s.cost.toLocaleString("hu-HU")} Ft` : ""}
                </p>
                {s.notes && (
                  <p className="text-muted-foreground mt-1 text-xs leading-snug">
                    {s.notes}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                disabled={busy}
                className="text-muted-foreground hover:text-foreground shrink-0 text-xs transition-colors disabled:opacity-40"
              >
                Törlés
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Új szerviz form */}
      <div className="border-border/40 border-t pt-4">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.15em] uppercase">
          Szerviz hozzáadása
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
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
          <div className="space-y-1.5">
            <Label htmlFor={`date-${scooterId}`}>Dátum</Label>
            <Input
              id={`date-${scooterId}`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`km-${scooterId}`}>Km-állás (opcionális)</Label>
            <Input
              id={`km-${scooterId}`}
              type="number"
              value={km}
              onChange={(e) => setKm(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`cost-${scooterId}`}>
              Költség (Ft, opcionális)
            </Label>
            <Input
              id={`cost-${scooterId}`}
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Segít követni, mennyit költöttél a rollerre.
            </p>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor={`notes-${scooterId}`}>
              Megjegyzés (opcionális)
            </Label>
            <Input
              id={`notes-${scooterId}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-3">
          <Button size="sm" onClick={handleAdd} disabled={busy}>
            {busy ? "Mentés..." : "Szerviz rögzítése"}
          </Button>
        </div>
      </div>
    </div>
  );
}
