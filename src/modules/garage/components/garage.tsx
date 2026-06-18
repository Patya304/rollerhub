"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScooterItem } from "./scooter-item";

type Scooter = {
  id: string;
  brand: string;
  model: string;
  year: number | null;
  currentMileage: number;
  purchasePrice: number | null;
};

export function Garage() {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/scooters");
    if (res.ok) setScooters(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleAdd() {
    setError("");
    const res = await fetch("/api/scooters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand,
        model,
        year: year || undefined,
        currentMileage: mileage || undefined,
        purchasePrice: price || undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Hiba a mentéskor.");
      return;
    }
    setBrand("");
    setModel("");
    setYear("");
    setMileage("");
    setPrice("");
    await load();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-medium">Új roller hozzáadása</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="brand">Márka</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="model">Modell</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="year">Évjárat</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mileage">Km óra állás</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="price">Vételár (Ft)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button onClick={handleAdd}>Hozzáadás</Button>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">A rollerjeid</h2>
        {loading ? (
          <p className="text-muted-foreground text-sm">Betöltés...</p>
        ) : scooters.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Még nincs rollered. Adj hozzá egyet fent!
          </p>
        ) : (
          <ul className="space-y-2">
            {scooters.map((s) => (
              <ScooterItem key={s.id} scooter={s} onChanged={load} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
