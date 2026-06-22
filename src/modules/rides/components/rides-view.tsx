"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RideItem = {
  id: string;
  scooterId: string;
  scooterName: string;
  startAt: string;
  endAt: string | null;
  distanceKm: number | null;
  avgSpeed: number | null;
  maxSpeed: number | null;
};

export function RidesView({
  scooters,
  rides,
}: {
  scooters: { id: string; name: string }[];
  rides: RideItem[];
}) {
  const router = useRouter();
  const [scooterId, setScooterId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [avgSpeed, setAvgSpeed] = useState("");
  const [maxSpeed, setMaxSpeed] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");

  async function handleAdd() {
    setError("");
    if (!scooterId || !startAt) {
      setError("Válassz rollert és add meg az indulás időpontját.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/scooters/${scooterId}/rides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startAt,
          endAt: endAt || undefined,
          distanceKm: distanceKm || undefined,
          avgSpeed: avgSpeed || undefined,
          maxSpeed: maxSpeed || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Hiba a mentéskor.");
        return;
      }
      setStartAt("");
      setEndAt("");
      setDistanceKm("");
      setAvgSpeed("");
      setMaxSpeed("");
      router.refresh();
    } catch {
      setError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Törlöd ezt a menetet?")) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/rides/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Hiba a törléskor.");
        return;
      }
      router.refresh();
    } catch {
      setError("Hálózati hiba a törléskor.");
    } finally {
      setBusy(false);
    }
  }

  const filtered =
    filter === "all" ? rides : rides.filter((r) => r.scooterId === filter);
  const totalKm = filtered.reduce((sum, r) => sum + (r.distanceKm ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-medium">Új menet rögzítése</h2>
        {scooters.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Előbb vegyél fel egy rollert a Garázsban.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="ride-scooter">Roller</Label>
                <select
                  id="ride-scooter"
                  value={scooterId}
                  onChange={(e) => setScooterId(e.target.value)}
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                >
                  <option value="">Válassz rollert…</option>
                  {scooters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="ride-start">Indulás</Label>
                <Input
                  id="ride-start"
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ride-end">Érkezés (opc.)</Label>
                <Input
                  id="ride-end"
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ride-dist">Táv (km, opc.)</Label>
                <Input
                  id="ride-dist"
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ride-avg">Átlagseb. (km/h, opc.)</Label>
                <Input
                  id="ride-avg"
                  type="number"
                  value={avgSpeed}
                  onChange={(e) => setAvgSpeed(e.target.value)}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="ride-max">Max seb. (km/h, opc.)</Label>
                <Input
                  id="ride-max"
                  type="number"
                  value={maxSpeed}
                  onChange={(e) => setMaxSpeed(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleAdd} disabled={busy}>
              Menet hozzáadása
            </Button>
          </>
        )}
      </div>

      <div className="space-y-3">
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
            {filtered.length} menet · Összes táv:{" "}
            <span className="font-medium">
              {totalKm.toLocaleString("hu-HU")} km
            </span>
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Még nincs menet rögzítve.
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((r) => (
              <li key={r.id} className="rounded-lg border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{r.scooterName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {new Date(r.startAt).toLocaleString("hu-HU")}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(r.id)}
                      disabled={busy}
                    >
                      Törlés
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground mt-1">
                  {[
                    r.distanceKm != null
                      ? `${r.distanceKm.toLocaleString("hu-HU")} km`
                      : null,
                    r.avgSpeed != null ? `átlag ${r.avgSpeed} km/h` : null,
                    r.maxSpeed != null ? `max ${r.maxSpeed} km/h` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Nincs részletadat"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
