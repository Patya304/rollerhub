// Az Eladási állapotlap megosztásának feltételei. A kötelező minimum
// (márka, modell, km-állás) a Scooter modellben már garantáltan kitöltött
// mezőkből áll, így a "hiányzik" ág a gyakorlatban ritkán fut le, de a
// checklist és a jövőbeli mezőbővítés miatt explicit marad.
export type ReadinessInput = {
  brand: string;
  model: string;
  currentMileage: number;
  photoUrl: string | null;
  year: number | null;
  serviceCount: number;
  hasEstimate: boolean;
};

export type ChecklistItem = {
  key: string;
  label: string;
  ok: boolean;
  fixHref: string;
};

export type Readiness = {
  canShare: boolean;
  missingRequired: string[];
  recommended: ChecklistItem[];
  recommendedOkCount: number;
};

export function computeReadiness(input: ReadinessInput): Readiness {
  const missingRequired: string[] = [];
  if (!input.brand.trim()) missingRequired.push("Márka");
  if (!input.model.trim()) missingRequired.push("Modell");
  if (input.currentMileage == null || input.currentMileage < 0) {
    missingRequired.push("Km-állás");
  }

  const recommended: ChecklistItem[] = [
    { key: "photo", label: "Fotó", ok: !!input.photoUrl, fixHref: "#fenykep" },
    {
      key: "year",
      label: "Évjárat",
      ok: input.year != null,
      fixHref: "#roller-adatok",
    },
    {
      key: "service",
      label: "Legalább egy szervizbejegyzés",
      ok: input.serviceCount > 0,
      fixHref: "#szerviz",
    },
    {
      key: "estimate",
      label: "Becsült érték",
      ok: input.hasEstimate,
      fixHref: "#roller-adatok",
    },
  ];

  return {
    canShare: missingRequired.length === 0,
    missingRequired,
    recommended,
    recommendedOkCount: recommended.filter((r) => r.ok).length,
  };
}
