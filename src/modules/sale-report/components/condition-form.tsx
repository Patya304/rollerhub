"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CONDITION_CATEGORIES,
  CONDITION_CATEGORY_LABELS,
  CONDITION_LEVELS,
  CONDITION_LEVEL_LABELS,
  KNOWN_ISSUES_STATES,
  type ConditionDto,
  type ConditionLevelValue,
  type KnownIssuesStateValue,
} from "@/modules/sale-report/condition";

type FormState = {
  overall: ConditionLevelValue | null;
  battery: ConditionLevelValue | null;
  brakes: ConditionLevelValue | null;
  tires: ConditionLevelValue | null;
  lights: ConditionLevelValue | null;
  frame: ConditionLevelValue | null;
  cosmetics: ConditionLevelValue | null;
  knownIssuesState: KnownIssuesStateValue;
  knownIssues: string;
};

function toFormState(condition: ConditionDto): FormState {
  return {
    overall: condition?.overall ?? null,
    battery: condition?.battery ?? null,
    brakes: condition?.brakes ?? null,
    tires: condition?.tires ?? null,
    lights: condition?.lights ?? null,
    frame: condition?.frame ?? null,
    cosmetics: condition?.cosmetics ?? null,
    knownIssuesState: condition?.knownIssuesState ?? "NOT_PROVIDED",
    knownIssues: condition?.knownIssues ?? "",
  };
}

const KNOWN_ISSUES_STATE_LABELS: Record<KnownIssuesStateValue, string> = {
  NOT_PROVIDED: "Még nincs nyilatkozat",
  NONE_REPORTED: "Nincs ismert probléma",
  REPORTED: "Van ismert probléma",
};

export function ConditionForm({
  scooterId,
  initialCondition,
}: {
  scooterId: string;
  initialCondition: ConditionDto;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormState>(() =>
    toFormState(initialCondition),
  );
  const [baseline, setBaseline] = useState<FormState>(() =>
    toFormState(initialCondition),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const isDirty = JSON.stringify(values) !== JSON.stringify(baseline);

  // Bármilyen mezőmódosításkor eltűnik a korábbi mentési visszajelzés -
  // ne maradjon egy régi "mentve" üzenet a képernyőn már megváltozott,
  // el nem mentett adat mellett.
  function clearFeedback() {
    setSuccessMessage("");
    setError("");
  }

  function clearFieldError(key: string) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      return Object.fromEntries(
        Object.entries(prev).filter(([k]) => k !== key),
      );
    });
  }

  function setLevel(
    key: (typeof CONDITION_CATEGORIES)[number],
    level: ConditionLevelValue | null,
  ) {
    clearFeedback();
    clearFieldError(key);
    setValues((v) => ({ ...v, [key]: v[key] === level ? null : level }));
  }

  // NONE_REPORTED/NOT_PROVIDED állapotra váltáskor a textarea eltűnik - a
  // korábban begépelt szöveg NEM maradhat rejtve a state-ben, mert az
  // rejtett field errorral elbuktatná a mentést (a szerver ugyanezt az
  // állapotot úgyis nullra normalizálja).
  function setKnownIssuesState(state: KnownIssuesStateValue) {
    clearFeedback();
    clearFieldError("knownIssues");
    setValues((v) => ({
      ...v,
      knownIssuesState: state,
      knownIssues: state === "REPORTED" ? v.knownIssues : "",
    }));
  }

  // Amint a user gépelni kezd, a korábbi (esetleg már elavult) mezőhiba
  // eltűnik - ne mutasson a felület egy olyan hibát, ami már a jelenlegi
  // beírt szövegre nem is vonatkozik.
  function setKnownIssuesText(text: string) {
    clearFeedback();
    clearFieldError("knownIssues");
    setValues((v) => ({ ...v, knownIssues: text }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setFieldErrors({});
    setSuccessMessage("");
    try {
      const res = await fetch(`/api/scooters/${scooterId}/condition`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          knownIssues: values.knownIssues.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Nem sikerült menteni az állapotfelmérést.");
        setFieldErrors(data.fieldErrors ?? {});
        return;
      }
      // A szerver által normalizált (trim-elt, null-osított) állapotot
      // használjuk baseline-nak, nem a nyers kliens `values`-t - így a
      // whitespace vagy egy időközben elavult state sosem marad a kliensen.
      const normalized = toFormState(data.condition);
      setValues(normalized);
      setBaseline(normalized);
      setSuccessMessage("Állapotfelmérés mentve.");
      router.refresh();
    } catch {
      setError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {successMessage && (
        <p role="status" aria-live="polite" className="text-primary text-sm">
          {successMessage}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {CONDITION_CATEGORIES.map((key) => (
        <fieldset key={key} className="space-y-1.5">
          <legend className="text-sm font-medium">
            {CONDITION_CATEGORY_LABELS[key]}
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {CONDITION_LEVELS.map((level) => {
              const selected = values[key] === level;
              return (
                <button
                  key={level}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setLevel(key, level)}
                  disabled={busy}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {CONDITION_LEVEL_LABELS[level]}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium">Ismert problémák</legend>
        <div className="flex flex-wrap gap-1.5">
          {KNOWN_ISSUES_STATES.map((state) => (
            <button
              key={state}
              type="button"
              aria-pressed={values.knownIssuesState === state}
              onClick={() => setKnownIssuesState(state)}
              disabled={busy}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                values.knownIssuesState === state
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {KNOWN_ISSUES_STATE_LABELS[state]}
            </button>
          ))}
        </div>
        {values.knownIssuesState === "REPORTED" && (
          <Textarea
            rows={4}
            maxLength={1000}
            value={values.knownIssues}
            onChange={(e) => setKnownIssuesText(e.target.value)}
            placeholder="Írd le röviden az ismert problémá(ka)t."
            aria-invalid={!!fieldErrors.knownIssues}
            disabled={busy}
            className="whitespace-pre-wrap"
          />
        )}
        {fieldErrors.knownIssues && (
          <p role="alert" className="text-xs text-red-500">
            {fieldErrors.knownIssues}
          </p>
        )}
      </fieldset>

      <Button type="submit" size="sm" disabled={busy || !isDirty}>
        {busy ? "Mentés..." : "Állapotfelmérés mentése"}
      </Button>

      <p className="text-muted-foreground text-xs leading-relaxed">
        Ez a te saját nyilatkozatod a roller állapotáról, nem hivatalos műszaki
        vizsgálat vagy tanúsítvány.
      </p>
    </form>
  );
}
