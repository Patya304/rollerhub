import { z } from "zod";

// A tulajdonos saját, szöveges állapotfelmérése - nem hivatalos műszaki
// vizsgálat vagy RollerHub-tanúsítvány, ezért a feliratok szándékosan nem
// "hibátlan"/"újszerű"/"bevizsgált" jellegűek.
export const CONDITION_LEVELS = ["GOOD", "FAIR", "NEEDS_ATTENTION"] as const;
export type ConditionLevelValue = (typeof CONDITION_LEVELS)[number];

export const CONDITION_LEVEL_LABELS: Record<ConditionLevelValue, string> = {
  GOOD: "Jó állapot",
  FAIR: "Használt, megfelelő",
  NEEDS_ATTENTION: "Figyelmet igényel",
};

export const KNOWN_ISSUES_STATES = [
  "NOT_PROVIDED",
  "NONE_REPORTED",
  "REPORTED",
] as const;
export type KnownIssuesStateValue = (typeof KNOWN_ISSUES_STATES)[number];

export const CONDITION_CATEGORIES = [
  "overall",
  "battery",
  "brakes",
  "tires",
  "lights",
  "frame",
  "cosmetics",
] as const;
export type ConditionCategory = (typeof CONDITION_CATEGORIES)[number];

export const CONDITION_CATEGORY_LABELS: Record<ConditionCategory, string> = {
  overall: "Általános állapot",
  battery: "Akkumulátor",
  brakes: "Fékek",
  tires: "Gumik",
  lights: "Világítás",
  frame: "Váz",
  cosmetics: "Külső, kozmetikai állapot",
};

// Safe, privát mezőktől (id, scooterId) mentes alak - ugyanez épül be a
// snapshotba és jön vissza a tulajdonosi API-ból is.
export type ConditionEntry = {
  overall: ConditionLevelValue | null;
  battery: ConditionLevelValue | null;
  brakes: ConditionLevelValue | null;
  tires: ConditionLevelValue | null;
  lights: ConditionLevelValue | null;
  frame: ConditionLevelValue | null;
  cosmetics: ConditionLevelValue | null;
  knownIssuesState: KnownIssuesStateValue;
  knownIssues: string | null;
};

export type ConditionDto = (ConditionEntry & { updatedAt: string }) | null;

type RawConditionRow = {
  overall: string | null;
  battery: string | null;
  brakes: string | null;
  tires: string | null;
  lights: string | null;
  frame: string | null;
  cosmetics: string | null;
  knownIssuesState: string;
  knownIssues: string | null;
  updatedAt: Date;
} | null;

export function toConditionEntry(row: RawConditionRow): ConditionEntry | null {
  if (!row) return null;
  return {
    overall: row.overall as ConditionLevelValue | null,
    battery: row.battery as ConditionLevelValue | null,
    brakes: row.brakes as ConditionLevelValue | null,
    tires: row.tires as ConditionLevelValue | null,
    lights: row.lights as ConditionLevelValue | null,
    frame: row.frame as ConditionLevelValue | null,
    cosmetics: row.cosmetics as ConditionLevelValue | null,
    knownIssuesState: row.knownIssuesState as KnownIssuesStateValue,
    knownIssues: row.knownIssues,
  };
}

export function toConditionDto(row: RawConditionRow): ConditionDto {
  const entry = toConditionEntry(row);
  if (!entry || !row) return null;
  return { ...entry, updatedAt: row.updatedAt.toISOString() };
}

export function conditionCategoryFilledCount(
  entry: ConditionEntry | null,
): number {
  if (!entry) return 0;
  return CONDITION_CATEGORIES.filter((key) => entry[key] != null).length;
}

const levelField = z.enum(CONDITION_LEVELS).nullable();

export const conditionInputSchema = z
  .object({
    overall: levelField,
    battery: levelField,
    brakes: levelField,
    tires: levelField,
    lights: levelField,
    frame: levelField,
    cosmetics: levelField,
    knownIssuesState: z.enum(KNOWN_ISSUES_STATES),
    knownIssues: z.string().trim().max(1000).nullable(),
  })
  .superRefine((data, ctx) => {
    const hasText = !!data.knownIssues && data.knownIssues.length > 0;
    if (data.knownIssuesState === "REPORTED" && !hasText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["knownIssues"],
        message: "Add meg az ismert probléma leírását.",
      });
    }
  })
  // NONE_REPORTED/NOT_PROVIDED mellett a szöveg MINDIG null a mentett
  // adatban, akkor is, ha egy régi vagy módosított kliens mégis küldött
  // valamit - így egy elrejtett textarea tartalma sosem kerülhet be a DB-be
  // egy olyan állapot mellé, ami nem ígéri a megjelenítését.
  .transform((data) => ({
    ...data,
    knownIssues: data.knownIssuesState === "REPORTED" ? data.knownIssues : null,
  }));

export type ConditionInput = z.infer<typeof conditionInputSchema>;

// A kliensi/API nyers inputot normalizáljuk (üres string -> null) a
// validálás előtt, hogy a séma egységesen null/nem-null alakot lásson.
export function normalizeConditionInput(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const input = raw as Record<string, unknown>;
  const knownIssuesRaw = input.knownIssues;
  const knownIssues =
    typeof knownIssuesRaw === "string" ? knownIssuesRaw.trim() || null : null;
  return { ...input, knownIssues };
}
