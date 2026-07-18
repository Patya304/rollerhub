"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "@/modules/services/service-types";

type Service = {
  id: string;
  type: ServiceType;
  performedAt: string;
  odometerKm: number | null;
  cost: number | null;
  notes: string | null;
};

type FormValues = {
  type: ServiceType | "";
  date: string;
  km: string;
  cost: string;
  notes: string;
};

function todayLocal(): string {
  return new Date().toLocaleDateString("sv");
}

function emptyForm(): FormValues {
  return { type: "", date: todayLocal(), km: "", cost: "", notes: "" };
}

function valuesFromService(s: Service): FormValues {
  return {
    type: s.type,
    date: s.performedAt.slice(0, 10),
    km: s.odometerKm != null ? String(s.odometerKm) : "",
    cost: s.cost != null ? String(s.cost) : "",
    notes: s.notes ?? "",
  };
}

function validate(v: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!v.type) errors.type = "A típus kötelező.";
  if (!v.date) {
    errors.date = "A dátum kötelező.";
  } else {
    const d = new Date(v.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (d.getTime() > today.getTime()) {
      errors.date = "A szerviz dátuma nem lehet a jövőben.";
    }
  }
  if (v.km) {
    const n = Number(v.km);
    if (!Number.isFinite(n) || n < 0)
      errors.km = "A km-állás nem lehet negatív.";
  }
  if (v.cost) {
    const n = Number(v.cost);
    if (!Number.isFinite(n) || n < 0)
      errors.cost = "A költség nem lehet negatív.";
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
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function ServiceForm({
  idPrefix,
  values,
  errors,
  onChange,
  disabled,
}: {
  idPrefix: string;
  values: FormValues;
  errors: Record<string, string>;
  onChange: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;
  disabled?: boolean;
}) {
  const todayStr = todayLocal();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <FieldWrapper id={`${idPrefix}-type`} label="Típus" error={errors.type}>
        <select
          id={`${idPrefix}-type`}
          required
          disabled={disabled}
          value={values.type}
          onChange={(e) => onChange("type", e.target.value as ServiceType)}
          aria-invalid={!!errors.type}
          aria-describedby={errors.type ? `${idPrefix}-type-error` : undefined}
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm disabled:opacity-50"
        >
          <option value="">Válassz típust…</option>
          {SERVICE_TYPES.map((t) => (
            <option key={t} value={t}>
              {SERVICE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </FieldWrapper>
      <FieldWrapper id={`${idPrefix}-date`} label="Dátum" error={errors.date}>
        <Input
          id={`${idPrefix}-date`}
          type="date"
          required
          disabled={disabled}
          max={todayStr}
          value={values.date}
          onChange={(e) => onChange("date", e.target.value)}
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? `${idPrefix}-date-error` : undefined}
        />
      </FieldWrapper>
      <FieldWrapper
        id={`${idPrefix}-km`}
        label="Km-állás (opcionális)"
        error={errors.km}
      >
        <Input
          id={`${idPrefix}-km`}
          type="number"
          inputMode="numeric"
          min={0}
          disabled={disabled}
          value={values.km}
          onChange={(e) => onChange("km", e.target.value)}
          aria-invalid={!!errors.km}
          aria-describedby={errors.km ? `${idPrefix}-km-error` : undefined}
        />
      </FieldWrapper>
      <FieldWrapper
        id={`${idPrefix}-cost`}
        label="Költség (Ft, opcionális)"
        error={errors.cost}
      >
        <Input
          id={`${idPrefix}-cost`}
          type="number"
          inputMode="numeric"
          min={0}
          disabled={disabled}
          value={values.cost}
          onChange={(e) => onChange("cost", e.target.value)}
          aria-invalid={!!errors.cost}
          aria-describedby={errors.cost ? `${idPrefix}-cost-error` : undefined}
        />
      </FieldWrapper>
      <FieldWrapper
        id={`${idPrefix}-notes`}
        label="Megjegyzés (opcionális)"
        error={errors.notes}
      >
        <Textarea
          id={`${idPrefix}-notes`}
          rows={3}
          maxLength={2000}
          disabled={disabled}
          value={values.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          aria-invalid={!!errors.notes}
          aria-describedby={
            errors.notes ? `${idPrefix}-notes-error` : undefined
          }
          className="sm:col-span-2"
        />
      </FieldWrapper>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="divide-border/30 divide-y">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse space-y-2 py-3">
          <div className="bg-muted h-4 w-24 rounded" />
          <div className="bg-muted h-3 w-32 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ServiceLog({ scooterId }: { scooterId: string }) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [addValues, setAddValues] = useState<FormValues>(() => emptyForm());
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [addError, setAddError] = useState("");
  const [addBanner, setAddBanner] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<FormValues>(() => emptyForm());
  const [editBaseline, setEditBaseline] = useState<FormValues>(() =>
    emptyForm(),
  );
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editError, setEditError] = useState("");
  const [editDiscardConfirm, setEditDiscardConfirm] = useState(false);
  const [editBanner, setEditBanner] = useState<string | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteBanner, setDeleteBanner] = useState(false);

  const [busyAction, setBusyAction] = useState<
    "add" | "edit" | "delete" | null
  >(null);

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const res = await fetch(`/api/scooters/${scooterId}/services`);
      if (res.ok) {
        setServices(await res.json());
      } else {
        setLoadError("Nem sikerült betölteni a szervizeket.");
      }
    } catch {
      setLoadError("Nem sikerült betölteni a szervizeket.");
    }
    setLoading(false);
  }, [scooterId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const anyBusy = busyAction !== null;
  const editIsDirty =
    JSON.stringify(editValues) !== JSON.stringify(editBaseline);
  // Nyitott törlési megerősítés mellett a hozzáadás se induljon el.
  const addLocked = anyBusy || deleteConfirmId !== null;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (addLocked) return;
    const errors = validate(addValues);
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setBusyAction("add");
    setAddError("");
    try {
      const res = await fetch(`/api/scooters/${scooterId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: addValues.type,
          performedAt: addValues.date,
          odometerKm: addValues.km || undefined,
          cost: addValues.cost || undefined,
          notes: addValues.notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAddError(data.error ?? "Hiba a mentéskor.");
        return;
      }
      setAddValues(emptyForm());
      setAddErrors({});
      setAddBanner(true);
      await load();
      router.refresh();
    } catch {
      setAddError("Hálózati hiba a mentéskor.");
    } finally {
      setBusyAction(null);
    }
  }

  function openEdit(service: Service) {
    if (anyBusy || deleteConfirmId) return;
    const v = valuesFromService(service);
    setEditingId(service.id);
    setEditValues(v);
    setEditBaseline(v);
    setEditErrors({});
    setEditError("");
    setEditDiscardConfirm(false);
    setEditBanner(null);
  }

  function requestCancelEdit() {
    if (editIsDirty) {
      setEditDiscardConfirm(true);
    } else {
      setEditingId(null);
    }
  }

  function discardEdit() {
    setEditingId(null);
    setEditDiscardConfirm(false);
    setEditError("");
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (anyBusy || !editingId) return;
    const errors = validate(editValues);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setBusyAction("edit");
    setEditError("");
    try {
      const res = await fetch(`/api/services/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: editValues.type,
          performedAt: editValues.date,
          odometerKm: editValues.km || "",
          cost: editValues.cost || "",
          notes: editValues.notes.trim() || "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setEditError(data.error ?? "Hiba a mentéskor.");
        return;
      }
      setEditingId(null);
      setEditBanner("Szerviz frissítve");
      await load();
      router.refresh();
    } catch {
      setEditError("Hálózati hiba a mentéskor.");
    } finally {
      setBusyAction(null);
    }
  }

  function requestDelete(id: string) {
    if (anyBusy || editingId || deleteConfirmId) return;
    setDeleteConfirmId(id);
    setDeleteError("");
  }

  function cancelDelete() {
    setDeleteConfirmId(null);
    setDeleteError("");
  }

  async function confirmDelete() {
    if (!deleteConfirmId || anyBusy) return;
    setBusyAction("delete");
    setDeleteError("");
    try {
      const res = await fetch(`/api/services/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error ?? "Hiba a törléskor.");
        return;
      }
      setDeleteConfirmId(null);
      setDeleteBanner(true);
      await load();
      router.refresh();
    } catch {
      setDeleteError("Hálózati hiba a törléskor.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="space-y-4">
      {addBanner && (
        <p role="status" aria-live="polite" className="text-primary text-sm">
          Szerviz rögzítve
        </p>
      )}
      {editBanner && (
        <p role="status" aria-live="polite" className="text-primary text-sm">
          {editBanner}
        </p>
      )}
      {deleteBanner && (
        <p role="status" aria-live="polite" className="text-primary text-sm">
          Szervizbejegyzés törölve
        </p>
      )}

      {/* Meglévő szervizek */}
      {loading ? (
        <SkeletonRows />
      ) : loadError ? (
        <div className="rounded-lg border border-dashed px-5 py-6 text-center">
          <p className="text-sm text-red-500">{loadError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            Próbáld újra
          </Button>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-lg border border-dashed px-5 py-8 text-center">
          <p className="text-2xl">🔧</p>
          <p className="mt-2.5 font-semibold">Nincs szerviz rögzítve</p>
          <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm">
            Rögzítsd az első javítást vagy ellenőrzést.
          </p>
        </div>
      ) : (
        <div className="divide-border/30 divide-y">
          {services.map((s) =>
            editingId === s.id ? (
              <form
                key={s.id}
                onSubmit={handleEditSave}
                noValidate
                className="space-y-3 py-3"
              >
                <ServiceForm
                  idPrefix={`edit-${s.id}`}
                  values={editValues}
                  errors={editErrors}
                  disabled={anyBusy}
                  onChange={(key, value) =>
                    setEditValues((v) => ({ ...v, [key]: value }))
                  }
                />
                {editError && (
                  <p role="alert" className="text-sm text-red-500">
                    {editError}
                  </p>
                )}
                {editDiscardConfirm ? (
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
                        onClick={discardEdit}
                      >
                        Igen, elvetem
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditDiscardConfirm(false)}
                      >
                        Vissza a szerkesztéshez
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={anyBusy || !editIsDirty}
                    >
                      {busyAction === "edit" ? "Mentés..." : "Mentés"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={requestCancelEdit}
                      disabled={anyBusy}
                    >
                      Mégsem
                    </Button>
                  </div>
                )}
              </form>
            ) : (
              <div
                key={s.id}
                className="flex items-start justify-between gap-3 py-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{SERVICE_TYPE_LABELS[s.type]}</p>
                  <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
                    {new Date(s.performedAt).toLocaleDateString("hu-HU")}
                    {s.odometerKm != null
                      ? ` · ${s.odometerKm.toLocaleString("hu-HU")} km`
                      : ""}
                    {s.cost != null
                      ? ` · ${s.cost.toLocaleString("hu-HU")} Ft`
                      : ""}
                  </p>
                  {s.notes && (
                    <p className="text-muted-foreground mt-1 text-xs leading-snug break-words whitespace-pre-wrap">
                      {s.notes}
                    </p>
                  )}
                  {deleteConfirmId === s.id && (
                    <div className="bg-muted/40 mt-2 space-y-2 rounded-lg px-3 py-2.5">
                      <p className="text-xs">
                        Törlöd a(z){" "}
                        <strong>{SERVICE_TYPE_LABELS[s.type]}</strong> (
                        {new Date(s.performedAt).toLocaleDateString("hu-HU")})
                        bejegyzést? Többé nem jelenik meg a szervizkönyvben.
                      </p>
                      {deleteError && (
                        <p role="alert" className="text-xs text-red-500">
                          {deleteError}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={confirmDelete}
                          disabled={anyBusy}
                        >
                          {busyAction === "delete"
                            ? "Törlés..."
                            : "Bejegyzés törlése"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={cancelDelete}
                          disabled={anyBusy}
                        >
                          Mégsem
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                {deleteConfirmId !== s.id && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      disabled={
                        anyBusy ||
                        editingId !== null ||
                        deleteConfirmId !== null
                      }
                      className="text-muted-foreground hover:text-foreground text-xs transition-colors disabled:opacity-40"
                    >
                      Szerkesztés
                    </button>
                    <button
                      onClick={() => requestDelete(s.id)}
                      disabled={
                        anyBusy ||
                        editingId !== null ||
                        deleteConfirmId !== null
                      }
                      className="text-muted-foreground text-xs transition-colors hover:text-red-500 disabled:opacity-40"
                    >
                      Törlés
                    </button>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      )}

      {/* Új szerviz form */}
      {editingId === null && (
        <form
          onSubmit={handleAdd}
          noValidate
          className="border-border/40 border-t pt-4"
        >
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.15em] uppercase">
            Szerviz rögzítése
          </p>
          <ServiceForm
            idPrefix="add"
            values={addValues}
            errors={addErrors}
            disabled={addLocked}
            onChange={(key, value) =>
              setAddValues((v) => ({ ...v, [key]: value }))
            }
          />
          {addError && (
            <p role="alert" className="mt-2 text-sm text-red-500">
              {addError}
            </p>
          )}
          <div className="mt-3">
            <Button type="submit" size="sm" disabled={addLocked}>
              {busyAction === "add" ? "Mentés..." : "Bejegyzés mentése"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
