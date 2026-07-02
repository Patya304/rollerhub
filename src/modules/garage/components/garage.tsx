"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateEstimate } from "@/modules/value/utils/calculate-estimate";
import { GarageVehicleListItem } from "@/components/garage-vehicle-list-item";

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
};

export function Garage() {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [battery, setBattery] = useState("");
  const [topSpeed, setTopSpeed] = useState("");
  const [rangeKm, setRangeKm] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
    setBusy(true);
    try {
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
          purchaseDate: purchaseDate || undefined,
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
      setPurchaseDate("");
      setBattery("");
      setTopSpeed("");
      setRangeKm("");
      setPhotoUrl("");
      setShowMore(false);
      setShowForm(false);
      await load();
    } catch {
      setError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Roller lista — ELSŐ */}
      {loading ? (
        <p className="text-muted-foreground py-4 text-sm">Betöltés...</p>
      ) : scooters.length === 0 ? (
        <div className="rounded-xl border border-dashed px-8 py-10 text-center">
          <p className="text-4xl">🛴</p>
          <p className="mt-4 font-semibold">A garázs üres</p>
          <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
            Add hozzá az első rollered. Ezután használhatod:
          </p>
          <ul className="text-muted-foreground mx-auto mt-3 max-w-xs space-y-1 text-left text-sm">
            <li>🔧 Szervizkönyv: gumicsere, fékállítás, ellenőrzés</li>
            <li>📊 Értékbecslés: becsült érték és értékvesztés</li>
            <li>📋 Állapotlap: ha később eladnád</li>
          </ul>
          <Button className="mt-6" onClick={() => setShowForm(true)}>
            Roller hozzáadása
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
            {scooters.map((s, idx) => {
              const est =
                s.purchasePrice != null
                  ? calculateEstimate({
                      purchasePrice: s.purchasePrice,
                      year: s.year,
                      currentMileage: s.currentMileage,
                      purchaseDate: s.purchaseDate,
                    })
                  : null;
              const meta = [
                s.year ? String(s.year) : null,
                `${s.currentMileage.toLocaleString("hu-HU")} km`,
                est != null ? `~${est.toLocaleString("hu-HU")} Ft` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <GarageVehicleListItem
                  key={s.id}
                  marker={String(idx + 1).padStart(2, "0")}
                  title={`${s.brand} ${s.model}`}
                  meta={meta}
                  href={`/garage/${s.id}`}
                  photoUrl={s.photoUrl}
                />
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Mégsem" : "+ Új roller hozzáadása"}
          </Button>
        </div>
      )}

      {/* Add form — MÁSODLAGOS, toggle-olt */}
      {showForm && scooters.length > 0 && (
        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="border-border/50 border-b px-5 py-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
              Új roller
            </p>
            <p className="mt-0.5 font-semibold">
              Roller hozzáadása a garázshoz
            </p>
          </div>
          <div className="space-y-4 px-5 py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="brand">Márka</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="pl. Ninebot"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="model">Modell</Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="pl. Max G2"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="year">Évjárat</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="pl. 2023"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mileage">Km-állás</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="pl. 1500"
                />
                <p className="text-muted-foreground text-xs">
                  A szervizek és az értékbecslés ettől lesz pontosabb.
                </p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="price">Vételár (Ft)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="pl. 250 000"
                />
                <p className="text-muted-foreground text-xs">
                  Ebből számoljuk az értékvesztést és a becsült piaci árat.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMore((v) => !v)}
              className="text-muted-foreground text-xs"
            >
              {showMore
                ? "▴ Kevesebb mező"
                : "▾ Szín, alvázszám, műszaki adatok"}
            </Button>

            {showMore && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="purchaseDate">Vásárlás dátuma</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="color">Szín</Label>
                  <Input
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="serialNumber">Alvázszám</Label>
                  <Input
                    id="serialNumber"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="battery">Akku (Wh)</Label>
                  <Input
                    id="battery"
                    type="number"
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="topSpeed">Végsebesség (km/h)</Label>
                  <Input
                    id="topSpeed"
                    type="number"
                    value={topSpeed}
                    onChange={(e) => setTopSpeed(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rangeKm">Hatótáv (km)</Label>
                  <Input
                    id="rangeKm"
                    type="number"
                    value={rangeKm}
                    onChange={(e) => setRangeKm(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="photoUrl">Fénykép URL</Label>
                  <Input
                    id="photoUrl"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={busy}>
                {busy ? "Mentés..." : "Hozzáadás a garázshoz"}
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
      )}
    </div>
  );
}
