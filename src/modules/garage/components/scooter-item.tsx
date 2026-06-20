"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceLog } from "@/modules/services/components/service-log";
import { ValueHistory } from "@/modules/value/components/value-history";

type Scooter = {
  id: string;
  brand: string;
  model: string;
  year: number | null;
  currentMileage: number;
  purchasePrice: number | null;
};

export function ScooterItem({
  scooter,
  onChanged,
}: {
  scooter: Scooter;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [brand, setBrand] = useState(scooter.brand);
  const [model, setModel] = useState(scooter.model);
  const [year, setYear] = useState(scooter.year?.toString() ?? "");
  const [mileage, setMileage] = useState(scooter.currentMileage.toString());
  const [busy, setBusy] = useState(false);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [estimateMsg, setEstimateMsg] = useState("");
  const [showServices, setShowServices] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  async function handleSave() {
    setBusy(true);
    await fetch(`/api/scooters/${scooter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand,
        model,
        year: year || null,
        currentMileage: mileage || 0,
      }),
    });
    setBusy(false);
    setEditing(false);
    onChanged();
  }

  async function handleDelete() {
    if (!confirm("Biztosan törlöd ezt a rollert?")) return;
    setBusy(true);
    await fetch(`/api/scooters/${scooter.id}`, { method: "DELETE" });
    setBusy(false);
    onChanged();
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
    }
    setBusy(false);
  }

  if (editing) {
    return (
      <li className="space-y-3 rounded-lg border p-3">
        <div className="grid grid-cols-2 gap-3">
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
            <Label>Km</Label>
            <Input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
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
      </li>
    );
  }

  return (
    <li className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium">
            {scooter.brand} {scooter.model}
          </p>
          <p className="text-muted-foreground text-sm">
            {scooter.year ? `${scooter.year} · ` : ""}
            {scooter.currentMileage} km
            {scooter.purchasePrice
              ? ` · ${scooter.purchasePrice.toLocaleString("hu-HU")} Ft`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button size="sm" onClick={handleEstimate} disabled={busy}>
            Becsült érték
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowHistory((v) => !v)}
          >
            Értéktörténet
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowServices((v) => !v)}
          >
            Szervizek
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
      </div>
      {estimate !== null && (
        <p className="text-sm font-medium text-green-600">
          Becsült érték: {estimate.toLocaleString("hu-HU")} Ft
        </p>
      )}
      {estimateMsg && <p className="text-sm text-red-500">{estimateMsg}</p>}
      {showHistory && <ValueHistory scooterId={scooter.id} />}
      {showServices && <ServiceLog scooterId={scooter.id} />}
    </li>
  );
}
