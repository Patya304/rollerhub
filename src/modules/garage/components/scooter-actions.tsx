"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  notes: string | null;
  isPublic: boolean;
};

export function ScooterActions({ scooter }: { scooter: Scooter }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [brand, setBrand] = useState(scooter.brand);
  const [model, setModel] = useState(scooter.model);
  const [color, setColor] = useState(scooter.color ?? "");
  const [serialNumber, setSerialNumber] = useState(scooter.serialNumber ?? "");
  const [year, setYear] = useState(scooter.year?.toString() ?? "");
  const [mileage, setMileage] = useState(scooter.currentMileage.toString());
  const [price, setPrice] = useState(scooter.purchasePrice?.toString() ?? "");
  const [purchaseDate, setPurchaseDate] = useState(scooter.purchaseDate ?? "");
  const [battery, setBattery] = useState(
    scooter.batteryCapacity?.toString() ?? "",
  );
  const [topSpeed, setTopSpeed] = useState(scooter.topSpeed?.toString() ?? "");
  const [rangeKm, setRangeKm] = useState(scooter.rangeKm?.toString() ?? "");
  const [photoUrl, setPhotoUrl] = useState(scooter.photoUrl ?? "");
  const [notes, setNotes] = useState(scooter.notes ?? "");
  const [isPublic, setIsPublic] = useState(scooter.isPublic);
  const [busy, setBusy] = useState(false);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [estimateMsg, setEstimateMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/scooters/${scooter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          model,
          color: color || null,
          serialNumber: serialNumber || null,
          year: year || null,
          currentMileage: mileage || 0,
          purchasePrice: price || null,
          purchaseDate: purchaseDate || null,
          batteryCapacity: battery || null,
          topSpeed: topSpeed || null,
          rangeKm: rangeKm || null,
          photoUrl: photoUrl || null,
          notes: notes || null,
          isPublic,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Hiba a mentéskor.");
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Biztosan törlöd ezt a rollert?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/scooters/${scooter.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Hiba a törléskor.");
        setBusy(false);
        return;
      }
      router.push("/garage");
    } catch {
      setError("Hálózati hiba a törléskor.");
      setBusy(false);
    }
  }

  async function handleEstimate() {
    setBusy(true);
    setEstimateMsg("");
    setEstimate(null);
    try {
      const res = await fetch(`/api/scooters/${scooter.id}/estimate`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEstimateMsg(data.error ?? "Hiba a becslésnél.");
      } else {
        setEstimate(data.estimatedValue);
        router.refresh();
      }
    } catch {
      setEstimateMsg("Hálózati hiba a becslésnél.");
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Márka</Label>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Modell</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Évjárat</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Km-állás</Label>
            <Input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Vételár (Ft)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Vásárlás dátuma</Label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Szín</Label>
            <Input value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Alvázszám</Label>
            <Input
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Akku (Wh)</Label>
            <Input
              type="number"
              value={battery}
              onChange={(e) => setBattery(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Végsebesség (km/h)</Label>
            <Input
              type="number"
              value={topSpeed}
              onChange={(e) => setTopSpeed(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Hatótáv (km)</Label>
            <Input
              type="number"
              value={rangeKm}
              onChange={(e) => setRangeKm(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Fénykép URL</Label>
            <Input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Megjegyzés</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <input
              id="scooterIsPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="accent-primary mt-0.5 h-4 w-4"
            />
            <div>
              <Label htmlFor="scooterIsPublic">Publikus a profilomon</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Csak a márka, modell, évjárat és km-állás jelenik meg.
              </p>
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={busy}>
            {busy ? "Mentés..." : "Mentés"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing(false)}
            disabled={busy}
          >
            Mégse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Elsődleges műveletek */}
      <div>
        <p className="text-muted-foreground mb-2.5 text-xs">
          Értékbecslés vételár és km-állás alapján, vagy adatok szerkesztése.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handleEstimate} disabled={busy}>
            {busy ? "Számítás..." : "Értékbecslés indítása"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing(true)}
            disabled={busy}
          >
            Adatok szerkesztése
          </Button>
        </div>
      </div>

      {estimate !== null && (
        <div className="bg-muted/40 rounded-lg px-4 py-3">
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Friss becsült érték
          </p>
          <p className="mt-1 font-mono text-lg font-bold tabular-nums">
            {estimate.toLocaleString("hu-HU")} Ft
          </p>
        </div>
      )}

      {estimateMsg && <p className="text-sm text-red-500">{estimateMsg}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Veszélyes zóna */}
      <div className="border-border/40 border-t pt-3">
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-muted-foreground text-xs transition-colors hover:text-red-500 disabled:opacity-40"
        >
          Roller törlése
        </button>
      </div>
    </div>
  );
}
