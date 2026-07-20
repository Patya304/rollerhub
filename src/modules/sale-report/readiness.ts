import {
  conditionCategoryFilledCount,
  type ConditionEntry,
} from "@/modules/sale-report/condition";

// Az Eladási állapotlap megosztásának feltételei. A kötelező minimum
// (márka, modell, km-állás) a Scooter modellben már garantáltan kitöltött
// mezőkből áll, így a "hiányzik" ág a gyakorlatban ritkán fut le, de a
// checklist és a jövőbeli mezőbővítés miatt explicit marad. Hiányzó
// vételár/becslés/szerviz/fotó/állapotfelmérés NEM blokkolja a megosztást -
// ezek csak ajánlott, nem kötelező tételek.
export type ReadinessInput = {
  scooterId: string;
  brand: string;
  model: string;
  currentMileage: number;
  photoUrl: string | null;
  year: number | null;
  serviceCount: number;
  hasEstimate: boolean;
  condition: ConditionEntry | null;
};

export type ChecklistItem = {
  key: string;
  label: string;
  ok: boolean;
  fixHref: string;
};

// Nem manipulatív, technikai % helyett szöveges besorolás: az "Alap"
// állapotlap is teljesen megosztható, a "Részletes" csak annyit jelent,
// hogy több ajánlott adat is ki van töltve - nem minőségi ítélet.
export type ReadinessLevel = "alap" | "reszletes";

export type Readiness = {
  canShare: boolean;
  missingRequired: string[];
  recommended: ChecklistItem[];
  recommendedOkCount: number;
  level: ReadinessLevel;
  levelLabel: string;
};

export function computeReadiness(input: ReadinessInput): Readiness {
  const missingRequired: string[] = [];
  if (!input.brand.trim()) missingRequired.push("Márka");
  if (!input.model.trim()) missingRequired.push("Modell");
  if (input.currentMileage == null || input.currentMileage < 0) {
    missingRequired.push("Km-állás");
  }

  const conditionCategoryCount = conditionCategoryFilledCount(input.condition);
  const knownIssuesStateGiven =
    input.condition != null &&
    input.condition.knownIssuesState !== "NOT_PROVIDED";

  // A fotó/évjárat/szerviz/becslés adatai a roller adatlapján
  // szerkeszthetők, nem a dedikált állapotlap-workspace-en - a checklist
  // linkjei ezért oda mutatnak, a megfelelő, ott létező anchorra. A
  // Condition/ismert hibák mezők viszont magán a workspace-en élnek,
  // ezért azok helyi (`#allapotfelmeres`) anchorra mutatnak.
  const garageUrl = `/garage/${input.scooterId}`;

  const recommended: ChecklistItem[] = [
    {
      key: "photo",
      label: "Fotó",
      ok: !!input.photoUrl,
      fixHref: `${garageUrl}#fenykep`,
    },
    {
      key: "year",
      label: "Évjárat",
      ok: input.year != null,
      fixHref: `${garageUrl}#roller-adatok`,
    },
    {
      key: "service",
      label: "Legalább egy szervizbejegyzés",
      ok: input.serviceCount > 0,
      fixHref: `${garageUrl}#szerviz`,
    },
    {
      key: "estimate",
      label: "Becsült érték",
      ok: input.hasEstimate,
      fixHref: `${garageUrl}#roller-adatok`,
    },
    {
      key: "condition",
      label: "Legalább 3 állapotkategória kitöltve",
      ok: conditionCategoryCount >= 3,
      fixHref: "#allapotfelmeres",
    },
    {
      key: "known-issues",
      label: "Ismert hibák nyilatkozat megadva",
      ok: knownIssuesStateGiven,
      fixHref: "#allapotfelmeres",
    },
  ];

  const recommendedOkCount = recommended.filter((r) => r.ok).length;
  const level: ReadinessLevel = recommendedOkCount >= 4 ? "reszletes" : "alap";

  return {
    canShare: missingRequired.length === 0,
    missingRequired,
    recommended,
    recommendedOkCount,
    level,
    levelLabel:
      level === "reszletes" ? "Részletes állapotlap" : "Alap állapotlap",
  };
}
