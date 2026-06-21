"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
};

function liveEstimate(s: Scooter): number | null {
  if (s.purchasePrice == null) return null;
  const currentYear = new Date().getFullYear();
  const ageYears = s.year ? Math.max(0, currentYear - s.year) : 0;
  const ageDep = ageYears * 0.12;
  const kmDep = (s.currentMileage / 1000) * 0.01;
  const totalDep = Math.min(0.8, ageDep + kmDep);
  return Math.round(s.purchasePrice * (1 - totalDep));
}

export function Garage() {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [battery, setBattery] = useState("");
  const [topSpeed, setTopSpeed] = useState("");
  const [rangeKm, setRangeKm] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
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
        color: color || undefined,
        serialNumber: serialNumber || undefined,
        year: year || undefined,
        currentMileage: mileage || undefined,
        purchasePrice: price || undefined,
        batteryCapacity: battery || undefined,
        topSpeed: topSpeed || undefined,
        rangeKm: rangeKm || undefined,
        photoUrl: photoUrl || undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Hiba a mentéskor.");
      return;
    }
    setBrand("");
    setModel("");
    setColor("");
    setSerialNumber("");
    setYear("");
    setMileage("");
    setPrice("");
    setBattery("");
    setTopSpeed("");
    setRangeKm("");
    setPhotoUrl("");
    setShowMore(false);
    await load();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-medium">Új roller hozzáadása</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="price">Vételár (Ft)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowMore((v) => !v)}
        >
          {showMore ? "Kevesebb adat ▴" : "További adatok ▾"}
        </Button>

        {showMore && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="color">Szín</Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="serialNumber">Alvázszám</Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="battery">Akku (Wh)</Label>
              <Input
                id="battery"
                type="number"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="topSpeed">Végsebesség (km/h)</Label>
              <Input
                id="topSpeed"
                type="number"
                value={topSpeed}
                onChange={(e) => setTopSpeed(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rangeKm">Hatótáv (km)</Label>
              <Input
                id="rangeKm"
                type="number"
                value={rangeKm}
                onChange={(e) => setRangeKm(e.target.value)}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="photoUrl">Fénykép URL</Label>
              <Input
                id="photoUrl"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
          </div>
        )}

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
            {scooters.map((s) => {
              const est = liveEstimate(s);
              return (
                <li key={s.id}>
                  <Link
                    href={`/garage/${s.id}`}
                    className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {s.brand} {s.model}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {[
                          s.year ? `${s.year}` : null,
                          `${s.currentMileage.toLocaleString("hu-HU")} km`,
                          est != null
                            ? `~${est.toLocaleString("hu-HU")} Ft`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-sm">
                      Megnyitás →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
