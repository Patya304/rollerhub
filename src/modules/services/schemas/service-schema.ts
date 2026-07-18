import { z } from "zod";
import { SERVICE_TYPES } from "@/modules/services/service-types";

// Felső korlátok: bőven a reális tartomány felett, de védenek az elgépelés
// és a Postgres Int túlcsordulása ellen.
const MAX_INT_VALUE = 100_000_000;
const MAX_NOTES_LENGTH = 2000;

const optInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce
    .number()
    .int()
    .min(0, "Nem lehet negatív.")
    .max(MAX_INT_VALUE, "Túl nagy érték.")
    .optional(),
);
const optString = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z
    .string()
    .trim()
    .max(MAX_NOTES_LENGTH, "A megjegyzés túl hosszú.")
    .optional(),
);

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// A mai nap Európa/Budapest időzóna szerint, "ÉÉÉÉ-HH-NN" alakban. A
// zero-padded formátum miatt lexikografikus string-összehasonlítással is
// helyes az időbeli sorrend, így nincs szükség szerver-időzóna-függő
// éjfél körüli Date-aritmetikára.
function budapestTodayString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isRealCalendarDate(year: number, month: number, day: number): boolean {
  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
  );
}

// Kötelező, kizárólag "ÉÉÉÉ-HH-NN" formátumú, ténylegesen létező naptári nap,
// amely nem lehet későbbi a budapesti mai napnál. Stabil, UTC éjfélre eső
// Date objektummá alakul, hogy a szerver saját időzónája ne torzítsa el.
const requiredDate = z
  .string()
  .trim()
  .min(1, "A dátum kötelező.")
  .regex(DATE_ONLY_REGEX, "A dátum formátuma legyen ÉÉÉÉ-HH-NN.")
  .refine((v) => {
    const [y, m, d] = v.split("-").map(Number);
    return isRealCalendarDate(y, m, d);
  }, "Ez a naptári dátum nem létezik.")
  .refine(
    (v) => v <= budapestTodayString(),
    "A szerviz dátuma nem lehet a jövőben.",
  )
  .transform((v) => {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  });

export const createServiceSchema = z.object({
  type: z.enum(SERVICE_TYPES),
  performedAt: requiredDate,
  odometerKm: optInt,
  cost: optInt,
  notes: optString,
});

// Frissítés: hiányzó mező -> nem módosul, "" -> null (törlés).
const updInt = z.preprocess(
  (v) => (v === "" ? null : v),
  z.coerce
    .number()
    .int()
    .min(0, "Nem lehet negatív.")
    .max(MAX_INT_VALUE, "Túl nagy érték.")
    .nullable()
    .optional(),
);
const updString = z.preprocess(
  (v) => (v === "" ? null : v),
  z
    .string()
    .trim()
    .max(MAX_NOTES_LENGTH, "A megjegyzés túl hosszú.")
    .nullable()
    .optional(),
);

export const updateServiceSchema = z.object({
  type: z.enum(SERVICE_TYPES).optional(),
  performedAt: requiredDate.optional(),
  odometerKm: updInt,
  cost: updInt,
  notes: updString,
});
