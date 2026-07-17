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

const currentYear = new Date().getFullYear();
const maxYear = currentYear + 1;

/** Helyi (nem UTC) dátum "ÉÉÉÉ-HH-NN" formátumban, dátum input max attribútumhoz. */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const isOtherBrand = brandChoice === OTHER_OPTION;
  const isOtherModel = isOtherBrand || modelChoice === OTHER_OPTION;
  const brand = isOtherBrand ? customBrand.trim() : brandChoice;
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

  const isDirty =
    step > 1 ||
    brandChoice !== "" ||
    customBrand.trim() !== "" ||
    modelChoice !== "" ||
    customModel.trim() !== "" ||
    year !== "" ||
    mileage !== "" ||
    price !== "" ||
    purchaseDate !== "" ||
    notes !== "";

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
    if (!customBrand.trim()) {
      setError("Add meg a márka nevét.");
      return;
    }
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

  function validateStep3(): string | null {
    if (year) {
      const y = Number(year);
      if (!Number.isFinite(y) || y < 1990 || y > maxYear) {
        return `Add meg az évjáratot 1990 és ${maxYear} között.`;
      }
    }
    if (mileage) {
      const m = Number(mileage);
      if (!Number.isFinite(m) || m < 0) {
        return "A km-állás nem lehet negatív.";
      }
    }
    if (price) {
      const p = Number(price);
      if (!Number.isFinite(p) || p < 0) {
        return "A vételár nem lehet negatív.";
      }
    }
    if (purchaseDate) {
      const purchase = new Date(purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (purchase.getTime() > today.getTime()) {
        return "A vásárlás dátuma nem lehet jövőbeli.";
      }
    }
    return null;
  }

  async function handleSubmit() {
    setError("");
    const validationError = validateStep3();
    if (validationError) {
      setError(validationError);
      return;
    }
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

  function handleCancelClick() {
    if (isDirty) {
      setConfirmDiscard(true);
    } else {
      onCancel?.();
    }
  }

  const optionClass =
    "hover:border-primary/60 hover:bg-muted/40 min-w-0 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors";
  const todayStr = formatLocalDate(new Date());

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
                Egyéb márka
              </button>
            </div>

            {isOtherBrand && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  goToModelStep();
                }}
                noValidate
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="customBrand">Márka neve</Label>
                  <Input
                    id="customBrand"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="pl. VSett"
                    autoComplete="off"
                    required
                    autoFocus
                  />
                  <p className="text-muted-foreground text-xs">
                    Ez lesz a roller márkaneve.
                  </p>
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-500">
                    {error}
                  </p>
                )}
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
              <span className="text-foreground font-medium break-words">
                {brand}
              </span>
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
                  Egyéb modell
                </button>
              </div>
            )}

            {isOtherModel && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  confirmCustomModel();
                }}
                noValidate
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="customModel">Modell neve</Label>
                  <Input
                    id="customModel"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="pl. Max G2"
                    autoComplete="off"
                    required
                    autoFocus
                  />
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-500">
                    {error}
                  </p>
                )}
                <Button type="submit" size="sm">
                  Tovább
                </Button>
              </form>
            )}

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
            noValidate
            className="space-y-4"
          >
            <p className="text-muted-foreground text-sm">
              Új roller:{" "}
              <span className="text-foreground font-medium break-words">
                {brand} {model}
              </span>
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="wizardYear">Évjárat (nem kötelező)</Label>
                <Input
                  id="wizardYear"
                  type="number"
                  inputMode="numeric"
                  min={1990}
                  max={maxYear}
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
                  inputMode="numeric"
                  min={0}
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="0"
                />
                <p className="text-muted-foreground text-xs">
                  Ha üresen hagyod, 0 km-rel indul.
                </p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="wizardPrice">Vételár (Ft, nem kötelező)</Label>
                <Input
                  id="wizardPrice"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="pl. 250 000"
                />
                <p className="text-muted-foreground text-xs">
                  Ebből számoljuk a becsült értéket.
                </p>
              </div>
            </div>

            <details className="rounded-lg border px-4 py-3 open:pb-4">
              <summary className="cursor-pointer text-sm font-medium select-none">
                További adatok
              </summary>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="wizardPurchaseDate">
                    Vásárlás dátuma (nem kötelező)
                  </Label>
                  <Input
                    id="wizardPurchaseDate"
                    type="date"
                    max={todayStr}
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="wizardNotes">Megjegyzés (nem kötelező)</Label>
                  <Input
                    id="wizardNotes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="pl. használtan vettem"
                    autoComplete="off"
                  />
                </div>
              </div>
            </details>

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

            {error && (
              <p role="alert" className="text-sm text-red-500">
                {error}
              </p>
            )}

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

        {onCancel &&
          (confirmDiscard ? (
            <div
              role="alert"
              className="bg-muted/40 flex flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm">Elveted a megkezdett rollert?</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onCancel}
                >
                  Igen, elvetem
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDiscard(false)}
                >
                  Vissza a szerkesztéshez
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancelClick}
              disabled={busy}
              className="text-muted-foreground"
            >
              Mégsem
            </Button>
          ))}
      </div>
    </div>
  );
}
