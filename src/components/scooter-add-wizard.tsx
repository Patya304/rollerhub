"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SCOOTER_CATALOG,
  OTHER_OPTION,
  getModelsForBrand,
  getCatalogModel,
} from "@/modules/scooter-catalog/scooter-catalog";

export type ScooterAddValues = {
  brand: string;
  model: string;
  year: string;
  currentMileage: string;
  purchasePrice: string;
  purchaseDate: string;
  notes: string;
  /** Gyári adatok a katalógusból, ha ismertek. */
  batteryCapacity?: number;
  topSpeed?: number;
  rangeKm?: number;
};

type ScooterAddWizardProps = {
  /** Mentés. Hibaüzenettel tér vissza, vagy null-lal, ha sikerült. */
  onSubmit: (values: ScooterAddValues) => Promise<string | null>;
  onCancel?: () => void;
};

const STEP_TITLES = {
  1: "Márka kiválasztása",
  2: "Modell kiválasztása",
  3: "Alapadatok",
} as const;

type Step = 1 | 2 | 3;

export function ScooterAddWizard({
  onSubmit,
  onCancel,
}: ScooterAddWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [brandChoice, setBrandChoice] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [modelChoice, setModelChoice] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isOtherBrand = brandChoice === OTHER_OPTION;
  const isOtherModel = isOtherBrand || modelChoice === OTHER_OPTION;
  const brand = isOtherBrand ? customBrand.trim() || OTHER_OPTION : brandChoice;
  const model = isOtherModel ? customModel.trim() : modelChoice;
  const models = getModelsForBrand(brandChoice);

  const catalogModel = isOtherModel ? undefined : getCatalogModel(brand, model);
  // Gyári adatot csak akkor töltünk elő, ha a kiválasztott pontos változat
  // adatai hivatalos gyártói forrásból ellenőrzöttek.
  const verifiedSpecs =
    catalogModel?.specsVerified === true &&
    (catalogModel.sourceUrls?.length ?? 0) > 0
      ? catalogModel.specs
      : undefined;
  const specParts = verifiedSpecs
    ? [
        verifiedSpecs.batteryWh != null
          ? `${verifiedSpecs.batteryWh} Wh akku`
          : null,
        verifiedSpecs.topSpeedKmh != null
          ? `${verifiedSpecs.topSpeedKmh} km/h végsebesség`
          : null,
        verifiedSpecs.rangeKm != null
          ? `${verifiedSpecs.rangeKm} km hatótáv`
          : null,
      ].filter((p): p is string => p !== null)
    : [];

  function pickBrand(name: string) {
    setBrandChoice(name);
    setModelChoice("");
    setCustomModel("");
    setError("");
    if (name !== OTHER_OPTION) {
      setStep(2);
    }
  }

  function pickModel(name: string) {
    setModelChoice(name);
    setError("");
    if (name !== OTHER_OPTION) {
      setStep(3);
    }
  }

  function goToModelStep() {
    setError("");
    setStep(2);
  }

  function confirmCustomModel() {
    if (!customModel.trim()) {
      setError("Add meg a modell nevét.");
      return;
    }
    setError("");
    setStep(3);
  }

  function goBack() {
    setError("");
    setStep((s) => (s === 3 ? 2 : 1));
  }

  async function handleSubmit() {
    setError("");
    setBusy(true);
    try {
      const submitError = await onSubmit({
        brand,
        model,
        year,
        currentMileage: mileage,
        purchasePrice: price,
        purchaseDate,
        notes,
        batteryCapacity: verifiedSpecs?.batteryWh,
        topSpeed: verifiedSpecs?.topSpeedKmh,
        rangeKm: verifiedSpecs?.rangeKm,
      });
      if (submitError) setError(submitError);
    } finally {
      setBusy(false);
    }
  }

  const optionClass =
    "hover:border-primary/60 hover:bg-muted/40 min-w-0 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors";

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      <div className="border-border/50 border-b px-5 py-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
          Roller hozzáadása · {step}/3
        </p>
        <p className="mt-0.5 font-semibold">{STEP_TITLES[step]}</p>
      </div>

      <div className="space-y-4 px-5 py-4">
        {/* 1. lépés: márka */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SCOOTER_CATALOG.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => pickBrand(b.name)}
                  className={optionClass}
                >
                  {b.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => pickBrand(OTHER_OPTION)}
                className={`${optionClass} ${isOtherBrand ? "border-primary" : ""}`}
              >
                {OTHER_OPTION}
              </button>
            </div>

            {isOtherBrand && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  goToModelStep();
                }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="customBrand">Márka neve</Label>
                  <Input
                    id="customBrand"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="pl. VSett"
                    autoFocus
                  />
                  <p className="text-muted-foreground text-xs">
                    Ha nem tudod pontosan, üresen is hagyhatod.
                  </p>
                </div>
                <Button type="submit" size="sm">
                  Tovább
                </Button>
              </form>
            )}
          </>
        )}

        {/* 2. lépés: modell */}
        {step === 2 && (
          <>
            <p className="text-muted-foreground text-sm">
              Kiválasztott márka:{" "}
              <span className="text-foreground font-medium">{brand}</span>
            </p>

            {!isOtherBrand && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {models.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => pickModel(m)}
                    className={optionClass}
                  >
                    {m}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => pickModel(OTHER_OPTION)}
                  className={`${optionClass} ${modelChoice === OTHER_OPTION ? "border-primary" : ""}`}
                >
                  {OTHER_OPTION}
                </button>
              </div>
            )}

            {isOtherModel && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  confirmCustomModel();
                }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="customModel">Modell neve</Label>
                  <Input
                    id="customModel"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="pl. Max G2"
                    autoFocus
                  />
                </div>
                <Button type="submit" size="sm">
                  Tovább
                </Button>
              </form>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="button" variant="ghost" size="sm" onClick={goBack}>
              ‹ Vissza a márkákhoz
            </Button>
          </>
        )}

        {/* 3. lépés: alapadatok */}
        {step === 3 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <p className="text-muted-foreground text-sm">
              Új roller:{" "}
              <span className="text-foreground font-medium">
                {brand} {model}
              </span>
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="wizardYear">Évjárat (nem kötelező)</Label>
                <Input
                  id="wizardYear"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="pl. 2024"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wizardMileage">Km-állás</Label>
                <Input
                  id="wizardMileage"
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="0"
                />
                <p className="text-muted-foreground text-xs">
                  Ha üresen hagyod, 0 km-rel indul.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wizardPrice">Vételár (Ft, nem kötelező)</Label>
                <Input
                  id="wizardPrice"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="pl. 250 000"
                />
                <p className="text-muted-foreground text-xs">
                  Ebből számoljuk a becsült értéket.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wizardPurchaseDate">
                  Vásárlás dátuma (nem kötelező)
                </Label>
                <Input
                  id="wizardPurchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="wizardNotes">Megjegyzés (nem kötelező)</Label>
                <Input
                  id="wizardNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="pl. használtan vettem"
                />
              </div>
            </div>

            {specParts.length > 0 ? (
              <p className="text-muted-foreground text-xs">
                Gyári adatok az EU-változathoz: {specParts.join(" · ")}.
                Mentéskor kitöltjük, az adatlapon módosíthatod.
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                A többi adatot később is kitöltheted a roller adatlapján.
              </p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? "Mentés..." : "Hozzáadás a garázshoz"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={goBack}
                disabled={busy}
              >
                ‹ Vissza
              </Button>
            </div>
          </form>
        )}

        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={busy}
            className="text-muted-foreground"
          >
            Mégsem
          </Button>
        )}
      </div>
    </div>
  );
}
