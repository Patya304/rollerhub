"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  notes: string | null;
};

type FormValues = {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  price: string;
  purchaseDate: string;
  color: string;
  serialNumber: string;
  battery: string;
  topSpeed: string;
  rangeKm: string;
  notes: string;
};

function valuesFromScooter(s: Scooter): FormValues {
  return {
    brand: s.brand,
    model: s.model,
    year: s.year?.toString() ?? "",
    mileage: s.currentMileage.toString(),
    price: s.purchasePrice?.toString() ?? "",
    purchaseDate: s.purchaseDate ?? "",
    color: s.color ?? "",
    serialNumber: s.serialNumber ?? "",
    battery: s.batteryCapacity?.toString() ?? "",
    topSpeed: s.topSpeed?.toString() ?? "",
    rangeKm: s.rangeKm?.toString() ?? "",
    notes: s.notes ?? "",
  };
}

const currentYear = new Date().getFullYear();
const maxYear = currentYear + 1;

/** Helyi (nem UTC) dátum "ÉÉÉÉ-HH-NN" formátumban, dátum input max attribútumhoz. */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function validate(v: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!v.brand.trim()) errors.brand = "A márka nem lehet üres.";
  if (!v.model.trim()) errors.model = "A modell nem lehet üres.";

  if (!v.mileage.trim()) {
    errors.mileage = "A km-állás kötelező.";
  } else {
    const m = Number(v.mileage);
    if (!Number.isFinite(m) || m < 0) {
      errors.mileage = "A km-állás nem lehet negatív.";
    }
  }

  if (v.year) {
    const y = Number(v.year);
    if (!Number.isFinite(y) || y < 1990 || y > maxYear) {
      errors.year = `Add meg az évjáratot 1990 és ${maxYear} között.`;
    }
  }

  if (v.price) {
    const p = Number(v.price);
    if (!Number.isFinite(p) || p < 0)
      errors.price = "A vételár nem lehet negatív.";
  }

  if (v.purchaseDate) {
    const purchase = new Date(v.purchaseDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (purchase.getTime() > today.getTime()) {
      errors.purchaseDate = "A vásárlás dátuma nem lehet jövőbeli.";
    }
  }

  if (v.battery) {
    const b = Number(v.battery);
    if (!Number.isFinite(b) || b < 0)
      errors.battery = "Az akku nem lehet negatív.";
  }
  if (v.topSpeed) {
    const t = Number(v.topSpeed);
    if (!Number.isFinite(t) || t < 0)
      errors.topSpeed = "A végsebesség nem lehet negatív.";
  }
  if (v.rangeKm) {
    const r = Number(v.rangeKm);
    if (!Number.isFinite(r) || r < 0)
      errors.rangeKm = "A hatótáv nem lehet negatív.";
  }

  if (v.notes.length > 2000) {
    errors.notes = "A megjegyzés túl hosszú (legfeljebb 2000 karakter).";
  }

  return errors;
}

function FieldWrapper({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && (
        <p className="text-muted-foreground text-xs">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export function ScooterActions({
  scooter,
  serviceCount,
  hasEstimate,
}: {
  scooter: Scooter;
  serviceCount: number;
  hasEstimate: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<FormValues>(() =>
    valuesFromScooter(scooter),
  );
  const [baseline, setBaseline] = useState<FormValues>(() =>
    valuesFromScooter(scooter),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const [activeAction, setActiveAction] = useState<
    "save" | "delete" | "estimate" | null
  >(null);
  const [saveError, setSaveError] = useState("");
  const [savedBannerVisible, setSavedBannerVisible] = useState(false);

  const [estimateValue, setEstimateValue] = useState<number | null>(null);
  const [estimateSaved, setEstimateSaved] = useState(true);
  const [estimateError, setEstimateError] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const isDirty = JSON.stringify(values) !== JSON.stringify(baseline);
  const todayStr = formatLocalDate(new Date());

  // Mentetlen módosításnál figyelmeztessen frissítés / lap bezárása előtt.
  useEffect(() => {
    if (!editing || !isDirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [editing, isDirty]);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function openEditor() {
    if (activeAction) return;
    setValues(baseline);
    setFieldErrors({});
    setSaveError("");
    setSavedBannerVisible(false);
    setConfirmDiscardOpen(false);
    setEditing(true);
  }

  function handleCancelClick() {
    if (isDirty) {
      setConfirmDiscardOpen(true);
    } else {
      setEditing(false);
    }
  }

  function discardChanges() {
    setValues(baseline);
    setFieldErrors({});
    setSaveError("");
    setConfirmDiscardOpen(false);
    setEditing(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeAction) return;

    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActiveAction("save");
    setSaveError("");
    try {
      const res = await fetch(`/api/scooters/${scooter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: values.brand.trim(),
          model: values.model.trim(),
          color: values.color.trim() || null,
          serialNumber: values.serialNumber.trim() || null,
          year: values.year || null,
          currentMileage: values.mileage,
          purchasePrice: values.price || null,
          purchaseDate: values.purchaseDate || null,
          batteryCapacity: values.battery || null,
          topSpeed: values.topSpeed || null,
          rangeKm: values.rangeKm || null,
          notes: values.notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error ?? "Hiba a mentéskor.");
        return;
      }
      setBaseline(values);
      setEditing(false);
      setSavedBannerVisible(true);
      router.refresh();
    } catch {
      setSaveError("Hálózati hiba a mentéskor.");
    } finally {
      setActiveAction(null);
    }
  }

  function openDeleteConfirm() {
    if (activeAction) return;
    setDeleteError("");
    setDeleteConfirmOpen(true);
  }

  function cancelDelete() {
    setDeleteConfirmOpen(false);
    setDeleteError("");
  }

  async function confirmDelete() {
    if (activeAction) return;
    setActiveAction("delete");
    setDeleteError("");
    try {
      const res = await fetch(`/api/scooters/${scooter.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error ?? "Hiba a törléskor.");
        setActiveAction(null);
        return;
      }
      router.push("/garage?deleted=1");
    } catch {
      setDeleteError("Hálózati hiba a törléskor.");
      setActiveAction(null);
    }
  }

  async function handleEstimate() {
    if (activeAction || deleteConfirmOpen) return;
    setActiveAction("estimate");
    setEstimateError("");
    setEstimateValue(null);
    try {
      const res = await fetch(`/api/scooters/${scooter.id}/estimate`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEstimateError(data.error ?? "Hiba a becslésnél.");
      } else {
        setEstimateValue(data.estimatedValue);
        setEstimateSaved(data.saved !== false);
        router.refresh();
      }
    } catch {
      setEstimateError("Hálózati hiba a becslésnél.");
    } finally {
      setActiveAction(null);
    }
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-card space-y-4 overflow-hidden rounded-xl border p-5"
      >
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
          Roller adatainak szerkesztése
        </p>

        {/* Km-állás — a leggyakoribb frissítés, kiemelve */}
        <FieldWrapper
          id="editMileage"
          label="Km-állás"
          error={fieldErrors.mileage}
        >
          <Input
            id="editMileage"
            type="number"
            inputMode="numeric"
            min={0}
            required
            value={values.mileage}
            onChange={(e) => setField("mileage", e.target.value)}
            aria-invalid={!!fieldErrors.mileage}
            aria-describedby={
              fieldErrors.mileage ? "editMileage-error" : undefined
            }
          />
        </FieldWrapper>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FieldWrapper id="editBrand" label="Márka" error={fieldErrors.brand}>
            <Input
              id="editBrand"
              required
              maxLength={200}
              value={values.brand}
              onChange={(e) => setField("brand", e.target.value)}
              aria-invalid={!!fieldErrors.brand}
              aria-describedby={
                fieldErrors.brand ? "editBrand-error" : undefined
              }
            />
          </FieldWrapper>
          <FieldWrapper id="editModel" label="Modell" error={fieldErrors.model}>
            <Input
              id="editModel"
              required
              maxLength={200}
              value={values.model}
              onChange={(e) => setField("model", e.target.value)}
              aria-invalid={!!fieldErrors.model}
              aria-describedby={
                fieldErrors.model ? "editModel-error" : undefined
              }
            />
          </FieldWrapper>
          <FieldWrapper id="editYear" label="Évjárat" error={fieldErrors.year}>
            <Input
              id="editYear"
              type="number"
              inputMode="numeric"
              min={1990}
              max={maxYear}
              value={values.year}
              onChange={(e) => setField("year", e.target.value)}
              aria-invalid={!!fieldErrors.year}
              aria-describedby={fieldErrors.year ? "editYear-error" : undefined}
            />
          </FieldWrapper>
          <FieldWrapper
            id="editPrice"
            label="Vételár (Ft)"
            error={fieldErrors.price}
          >
            <Input
              id="editPrice"
              type="number"
              inputMode="numeric"
              min={0}
              value={values.price}
              onChange={(e) => setField("price", e.target.value)}
              aria-invalid={!!fieldErrors.price}
              aria-describedby={
                fieldErrors.price ? "editPrice-error" : undefined
              }
            />
          </FieldWrapper>
        </div>

        <details className="rounded-lg border px-4 py-3 open:pb-4">
          <summary className="cursor-pointer text-sm font-medium select-none">
            További adatok
          </summary>
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FieldWrapper
                id="editPurchaseDate"
                label="Vásárlás dátuma"
                error={fieldErrors.purchaseDate}
              >
                <Input
                  id="editPurchaseDate"
                  type="date"
                  max={todayStr}
                  value={values.purchaseDate}
                  onChange={(e) => setField("purchaseDate", e.target.value)}
                  aria-invalid={!!fieldErrors.purchaseDate}
                  aria-describedby={
                    fieldErrors.purchaseDate
                      ? "editPurchaseDate-error"
                      : undefined
                  }
                />
              </FieldWrapper>
              <FieldWrapper id="editColor" label="Szín">
                <Input
                  id="editColor"
                  maxLength={200}
                  value={values.color}
                  onChange={(e) => setField("color", e.target.value)}
                />
              </FieldWrapper>
              <FieldWrapper id="editSerial" label="Alvázszám">
                <Input
                  id="editSerial"
                  maxLength={200}
                  value={values.serialNumber}
                  onChange={(e) => setField("serialNumber", e.target.value)}
                />
              </FieldWrapper>
              <FieldWrapper
                id="editBattery"
                label="Akku (Wh)"
                error={fieldErrors.battery}
              >
                <Input
                  id="editBattery"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={values.battery}
                  onChange={(e) => setField("battery", e.target.value)}
                  aria-invalid={!!fieldErrors.battery}
                  aria-describedby={
                    fieldErrors.battery ? "editBattery-error" : undefined
                  }
                />
              </FieldWrapper>
              <FieldWrapper
                id="editTopSpeed"
                label="Végsebesség (km/h)"
                error={fieldErrors.topSpeed}
              >
                <Input
                  id="editTopSpeed"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={values.topSpeed}
                  onChange={(e) => setField("topSpeed", e.target.value)}
                  aria-invalid={!!fieldErrors.topSpeed}
                  aria-describedby={
                    fieldErrors.topSpeed ? "editTopSpeed-error" : undefined
                  }
                />
              </FieldWrapper>
              <FieldWrapper
                id="editRangeKm"
                label="Hatótáv (km)"
                error={fieldErrors.rangeKm}
              >
                <Input
                  id="editRangeKm"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={values.rangeKm}
                  onChange={(e) => setField("rangeKm", e.target.value)}
                  aria-invalid={!!fieldErrors.rangeKm}
                  aria-describedby={
                    fieldErrors.rangeKm ? "editRangeKm-error" : undefined
                  }
                />
              </FieldWrapper>
            </div>

            <FieldWrapper
              id="editNotes"
              label="Megjegyzés"
              error={fieldErrors.notes}
            >
              <Textarea
                id="editNotes"
                rows={3}
                maxLength={2000}
                value={values.notes}
                onChange={(e) => setField("notes", e.target.value)}
                aria-invalid={!!fieldErrors.notes}
                aria-describedby={
                  fieldErrors.notes ? "editNotes-error" : undefined
                }
              />
            </FieldWrapper>
          </div>
        </details>

        {saveError && (
          <p role="alert" className="text-sm text-red-500">
            {saveError}
          </p>
        )}

        {confirmDiscardOpen ? (
          <div
            role="alert"
            className="bg-muted/40 flex flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm">Elveted a módosításokat?</p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={discardChanges}
              >
                Igen, elvetem
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDiscardOpen(false)}
              >
                Vissza a szerkesztéshez
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={activeAction !== null || !isDirty}>
              {activeAction === "save" ? "Mentés..." : "Változtatások mentése"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancelClick}
              disabled={activeAction !== null}
            >
              Mégsem
            </Button>
          </div>
        )}
      </form>
    );
  }

  return (
    <div id="roller-adatok" className="scroll-mt-20 space-y-4">
      {savedBannerVisible && (
        <div
          role="status"
          aria-live="polite"
          className="border-primary/30 bg-primary/5 flex items-center justify-between gap-3 rounded-xl border px-5 py-4"
        >
          <p className="font-semibold">Adatok frissítve</p>
          <button
            type="button"
            onClick={() => setSavedBannerVisible(false)}
            aria-label="Bezárás"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Feladatalapú fő műveletek */}
      <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
        <button
          type="button"
          onClick={openEditor}
          disabled={activeAction !== null}
          className="group hover:bg-muted/30 flex w-full items-center gap-3 px-5 py-4 text-left transition-colors disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base">
            ✏️
          </span>
          <span className="min-w-0 flex-1">
            <span className="block leading-snug font-semibold">
              Roller adatainak frissítése
            </span>
            <span className="text-muted-foreground mt-0.5 block text-sm leading-snug">
              Km-állás és egyéb adatok
            </span>
          </span>
          <span className="text-muted-foreground group-hover:text-primary shrink-0 text-sm transition-colors">
            →
          </span>
        </button>
        <Link
          href="#szerviz"
          className="group hover:bg-muted/30 flex items-center gap-3 px-5 py-4 transition-colors"
        >
          <span className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base">
            🔧
          </span>
          <span className="min-w-0 flex-1">
            <span className="block leading-snug font-semibold">
              Szervizkönyv
            </span>
            <span className="text-muted-foreground mt-0.5 block text-sm leading-snug">
              {serviceCount > 0
                ? `${serviceCount} bejegyzés`
                : "Még nincs bejegyzés"}
            </span>
          </span>
          <span className="text-muted-foreground group-hover:text-primary shrink-0 text-sm transition-colors">
            →
          </span>
        </Link>
        <Link
          href="#allapotlap"
          className="group hover:bg-muted/30 flex items-center gap-3 px-5 py-4 transition-colors"
        >
          <span className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base">
            📋
          </span>
          <span className="min-w-0 flex-1">
            <span className="block leading-snug font-semibold">Állapotlap</span>
            <span className="text-muted-foreground mt-0.5 block text-sm leading-snug">
              Eladáshoz
            </span>
          </span>
          <span className="text-muted-foreground group-hover:text-primary shrink-0 text-sm transition-colors">
            →
          </span>
        </Link>
      </div>

      {/* Értékbecslés */}
      <div className="bg-card overflow-hidden rounded-xl border px-5 py-4">
        <Button
          size="sm"
          onClick={handleEstimate}
          disabled={activeAction !== null || deleteConfirmOpen}
        >
          {activeAction === "estimate"
            ? "Számítás..."
            : hasEstimate
              ? "Érték frissítése"
              : "Értékbecslés indítása"}
        </Button>

        {estimateValue !== null && (
          <div
            role="status"
            aria-live="polite"
            className="bg-muted/40 mt-3 rounded-lg px-4 py-3"
          >
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              {estimateSaved ? "Becsült érték frissítve" : "Becsült érték"}
            </p>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums">
              {estimateValue.toLocaleString("hu-HU")} Ft
            </p>
            {!estimateSaved && (
              <p className="text-muted-foreground mt-1 text-xs">
                A becsült érték nem változott az utolsó becslés óta.
              </p>
            )}
          </div>
        )}

        {estimateError && (
          <p role="alert" className="mt-3 text-sm text-red-500">
            {estimateError}
          </p>
        )}

        <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
          A becslés a vételár, a kor és a Km-állás alapján készül. Tájékoztató
          érték, a tényleges eladási ár eltérhet.
        </p>
      </div>

      {/* Veszélyes zóna */}
      <div className="rounded-xl border border-dashed px-5 py-4">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-[0.15em] uppercase">
          Veszélyes zóna
        </p>
        {deleteConfirmOpen ? (
          <div className="space-y-3">
            <p className="text-sm">
              Törlöd a(z){" "}
              <strong>
                {scooter.brand} {scooter.model}
              </strong>{" "}
              rollert?
            </p>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-xs">
              <li>Eltűnik a Garázsból.</li>
              <li>
                A hozzá tartozó szervizek, menetek és becslések többé nem
                lesznek elérhetők az appban.
              </li>
            </ul>
            {deleteError && (
              <p role="alert" className="text-sm text-red-500">
                {deleteError}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                disabled={activeAction !== null}
              >
                {activeAction === "delete" ? "Törlés..." : "Roller törlése"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cancelDelete}
                disabled={activeAction !== null}
              >
                Mégsem
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openDeleteConfirm}
            disabled={activeAction !== null}
            className="text-muted-foreground text-xs transition-colors hover:text-red-500 disabled:opacity-40"
          >
            Roller törlése
          </button>
        )}
      </div>
    </div>
  );
}
