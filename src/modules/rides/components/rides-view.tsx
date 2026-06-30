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
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false);
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

  const rideForm = showForm && scooters.length > 0 && (
    <div className="bg-card overflow-hidden rounded-xl border">
      <div className="border-border/50 border-b px-5 py-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
          Új menet
        </p>
        <p className="mt-0.5 font-semibold">Menet rögzítése</p>
      </div>
      <div className="space-y-4 px-5 py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
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
          <div className="space-y-1.5">
            <Label htmlFor="ride-start">Indulás</Label>
            <Input
              id="ride-start"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ride-end">Érkezés (opc.)</Label>
            <Input
              id="ride-end"
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ride-dist">Táv (km)</Label>
            <Input
              id="ride-dist"
              type="number"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ride-avg">Átlagseb. (km/h)</Label>
            <Input
              id="ride-avg"
              type="number"
              value={avgSpeed}
              onChange={(e) => setAvgSpeed(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ride-max">Max seb. (km/h)</Label>
            <Input
              id="ride-max"
              type="number"
              value={maxSpeed}
              onChange={(e) => setMaxSpeed(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={handleAdd} disabled={busy}>
            {busy ? "Mentés..." : "Menet rögzítése"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowForm(false)}
            disabled={busy}
          >
            Mégsem
          </Button>
        </div>
      </div>
    </div>
  );

  if (rides.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed px-8 py-14 text-center">
          <p className="text-4xl">🛣️</p>
          <p className="mt-4 font-semibold">Még nincs menet rögzítve</p>
          <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
            Naplózd az első kiszállásodat — indulás, megtett táv, sebesség.
          </p>
          {scooters.length > 0 ? (
            <Button className="mt-6" onClick={() => setShowForm(true)}>
              Első menet rögzítése
            </Button>
          ) : (
            <p className="text-muted-foreground mt-4 text-xs">
              Előbb adj hozzá egy rollert a Garázsban.
            </p>
          )}
        </div>
        {rideForm}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter + összesítő */}
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
            {filtered.length} menet
          </span>
          {totalKm > 0 && (
            <span className="bg-muted/60 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold tabular-nums">
              {totalKm.toLocaleString("hu-HU")} km
            </span>
          )}
        </div>
      </div>

      {/* Menet lista */}
      {filtered.length > 0 ? (
        <div className="bg-card overflow-hidden rounded-xl border">
          {filtered.map((r, idx) => (
            <div
              key={r.id}
              className={`flex items-start gap-4 px-5 py-4 text-sm ${
                idx < filtered.length - 1 ? "border-border/40 border-b" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{r.scooterName}</p>
                <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                  {new Date(r.startAt).toLocaleString("hu-HU")}
                  {r.endAt
                    ? ` – ${new Date(r.endAt).toLocaleTimeString("hu-HU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : ""}
                </p>
                {(r.distanceKm != null ||
                  r.avgSpeed != null ||
                  r.maxSpeed != null) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.distanceKm != null && (
                      <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                        {r.distanceKm.toLocaleString("hu-HU")} km
                      </span>
                    )}
                    {r.avgSpeed != null && (
                      <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                        átl. {r.avgSpeed} km/h
                      </span>
                    )}
                    {r.maxSpeed != null && (
                      <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                        max {r.maxSpeed} km/h
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                disabled={busy}
                className="text-muted-foreground hover:text-foreground mt-0.5 shrink-0 text-xs transition-colors disabled:opacity-40"
              >
                Törlés
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Ehhez a rollerhez még nincs menet.
        </p>
      )}

      {!showForm && scooters.length > 0 && (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
          + Új menet rögzítése
        </Button>
      )}

      {rideForm}
    </div>
  );
}
