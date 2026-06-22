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
  batteryCapacity: number | null;
  topSpeed: number | null;
  rangeKm: number | null;
  photoUrl: string | null;
  notes: string | null;
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
  const [battery, setBattery] = useState(
    scooter.batteryCapacity?.toString() ?? "",
  );
  const [topSpeed, setTopSpeed] = useState(scooter.topSpeed?.toString() ?? "");
  const [rangeKm, setRangeKm] = useState(scooter.rangeKm?.toString() ?? "");
  const [photoUrl, setPhotoUrl] = useState(scooter.photoUrl ?? "");
  const [notes, setNotes] = useState(scooter.notes ?? "");
  const [busy, setBusy] = useState(false);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [estimateMsg, setEstimateMsg] = useState("");

  async function handleSave() {
    setBusy(true);
    await fetch(`/api/scooters/${scooter.id}`, {
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
        batteryCapacity: battery || null,
        topSpeed: topSpeed || null,
        rangeKm: rangeKm || null,
        photoUrl: photoUrl || null,
        notes: notes || null,
      }),
    });
    setBusy(false);
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Biztosan törlöd ezt a rollert?")) return;
    setBusy(true);
    await fetch(`/api/scooters/${scooter.id}`, { method: "DELETE" });
    router.push("/garage");
  }

  async function handleEstimate() {
    setBusy(true);
    setEstimateMsg("");
    const res = await fetch(`/api/scooters/${scooter.id}/estimate`, {
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setEstimate(null);
      setEstimateMsg(data.error ?? "Hiba a becslésnél.");
    } else {
      setEstimate(data.estimatedValue);
      router.refresh();
    }
    setBusy(false);
  }

  if (editing) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Márka</Label>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Modell</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Évjárat</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Km óra állás</Label>
            <Input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Vételár (Ft)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Szín</Label>
            <Input value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Alvázszám</Label>
            <Input
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Akku (Wh)</Label>
            <Input
              type="number"
              value={battery}
              onChange={(e) => setBattery(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Végsebesség (km/h)</Label>
            <Input
              type="number"
              value={topSpeed}
              onChange={(e) => setTopSpeed(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Hatótáv (km)</Label>
            <Input
              type="number"
              value={rangeKm}
              onChange={(e) => setRangeKm(e.target.value)}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Fénykép URL</Label>
            <Input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Megjegyzés</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={busy}>
            Mentés
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
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={handleEstimate} disabled={busy}>
          Becsült érték
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditing(true)}
          disabled={busy}
        >
          Szerkesztés
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          disabled={busy}
        >
          Törlés
        </Button>
      </div>
      {estimate !== null && (
        <p className="text-sm font-medium text-green-600">
          Becsült érték: {estimate.toLocaleString("hu-HU")} Ft
        </p>
      )}
      {estimateMsg && <p className="text-sm text-red-500">{estimateMsg}</p>}
    </div>
  );
}
