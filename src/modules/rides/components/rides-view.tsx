"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RideListItem } from "@/modules/rides/components/ride-list-item";

/** Helyi idő szerinti "éééé-hh-nnTóó:pp" a datetime-local inputhoz. */
function nowForDatetimeInput(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

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
  // Egyetlen roller esetén nincs mit választani, azzal indul a form.
  const [scooterId, setScooterId] = useState(
    scooters.length === 1 ? scooters[0].id : "",
  );
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [avgSpeed, setAvgSpeed] = useState("");
  const [maxSpeed, setMaxSpeed] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  function openForm() {
    // Az indulás alapból a mostani időpont, elég csak a távot beírni.
    setStartAt((v) => v || nowForDatetimeInput());
    setShowForm(true);
  }

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
            <Label htmlFor="ride-end">Érkezés (opcionális)</Label>
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
            <Label htmlFor="ride-avg">Átlagsebesség (km/h)</Label>
            <Input
              id="ride-avg"
              type="number"
              value={avgSpeed}
              onChange={(e) => setAvgSpeed(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ride-max">Max. sebesség (km/h)</Label>
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
          {scooters.length > 0 ? (
            <Button className="mt-6" onClick={openForm}>
              Első menet rögzítése
            </Button>
          ) : (
            <Button asChild className="mt-6">
              <Link href="/garage?add=1">Roller hozzáadása</Link>
            </Button>
          )}
        </div>
        {rideForm}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter + összesítő — szűrő csak több roller esetén */}
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
        <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
          {filtered.map((r) => (
            <RideListItem
              key={r.id}
              scooterName={r.scooterName}
              startAt={r.startAt}
              endAt={r.endAt}
              distanceKm={r.distanceKm}
              avgSpeed={r.avgSpeed}
              maxSpeed={r.maxSpeed}
              action={
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={busy}
                  className="text-muted-foreground hover:text-foreground mt-0.5 shrink-0 text-xs transition-colors disabled:opacity-40"
                >
                  Törlés
                </button>
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Ehhez a rollerhez még nincs menet.
        </p>
      )}

      {!showForm && scooters.length > 0 && (
        <Button variant="outline" size="sm" onClick={openForm}>
          + Új menet rögzítése
        </Button>
      )}

      {rideForm}
    </div>
  );
}
