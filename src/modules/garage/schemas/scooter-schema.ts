import { z } from "zod";

const currentYear = new Date().getFullYear();

// Felső korlátok: bőven a reális tartomány felett, de védenek az elgépelés
// és a Postgres Int túlcsordulása ellen.
const MAX_INT_VALUE = 100_000_000;
const MAX_STRING_LENGTH = 200;
const MAX_NOTES_LENGTH = 2000;

// ----- CREATE mezőtípusok: üres/hiányzó opcionális -> kimarad -----
const optString = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().trim().max(MAX_STRING_LENGTH, "Túl hosszú szöveg.").optional(),
);
const optNotes = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z
    .string()
    .trim()
    .max(MAX_NOTES_LENGTH, "A megjegyzés túl hosszú.")
    .optional(),
);
const optInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce
    .number()
    .int()
    .min(0, "Nem lehet negatív.")
    .max(MAX_INT_VALUE, "Túl nagy érték.")
    .optional(),
);
const optYear = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce
    .number()
    .int()
    .min(1990, "Az évjárat túl régi.")
    .max(currentYear + 1, "Az évjárat túl nagy.")
    .optional(),
);
const optUrl = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().trim().url("Érvénytelen URL.").optional(),
);

// Vásárlás dátuma — create: üres/hiányzó -> kimarad
const PURCHASE_MAX_FUTURE_MS = 24 * 60 * 60 * 1000; // 1 nap tolerancia
const notFuture = (d: Date) =>
  d.getTime() <= Date.now() + PURCHASE_MAX_FUTURE_MS;

const optDate = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z
    .string()
    .trim()
    .min(1)
    .pipe(
      z.coerce
        .date()
        .refine(notFuture, "A vásárlás dátuma nem lehet a jövőben."),
    )
    .optional(),
);

export const createScooterSchema = z.object({
  brand: z
    .string()
    .trim()
    .min(1, "A márka kötelező.")
    .max(MAX_STRING_LENGTH, "Túl hosszú szöveg."),
  model: z
    .string()
    .trim()
    .min(1, "A modell kötelező.")
    .max(MAX_STRING_LENGTH, "Túl hosszú szöveg."),
  color: optString,
  serialNumber: optString,
  year: optYear,
  currentMileage: optInt,
  purchasePrice: optInt,
  purchaseDate: optDate,
  batteryCapacity: optInt,
  topSpeed: optInt,
  rangeKm: optInt,
  photoUrl: optUrl,
  notes: optNotes,
});

// ----- UPDATE mezőtípusok: "" -> null (törlés), hiányzó -> nem módosul -----
const updString = z.preprocess(
  (v) => (v === "" ? null : v),
  z
    .string()
    .trim()
    .max(MAX_STRING_LENGTH, "Túl hosszú szöveg.")
    .nullable()
    .optional(),
);
const updNotes = z.preprocess(
  (v) => (v === "" ? null : v),
  z
    .string()
    .trim()
    .max(MAX_NOTES_LENGTH, "A megjegyzés túl hosszú.")
    .nullable()
    .optional(),
);
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
const updYear = z.preprocess(
  (v) => (v === "" ? null : v),
  z.coerce
    .number()
    .int()
    .min(1990, "Az évjárat túl régi.")
    .max(currentYear + 1, "Az évjárat túl nagy.")
    .nullable()
    .optional(),
);
const updUrl = z.preprocess(
  (v) => (v === "" ? null : v),
  z.string().trim().url("Érvénytelen URL.").nullable().optional(),
);
const updDate = z.preprocess(
  (v) => (v === "" ? null : v),
  z
    .string()
    .trim()
    .min(1)
    .pipe(
      z.coerce
        .date()
        .refine(notFuture, "A vásárlás dátuma nem lehet a jövőben."),
    )
    .nullable()
    .optional(),
);

export const updateScooterSchema = z.object({
  brand: z
    .string()
    .trim()
    .min(1, "A márka nem lehet üres.")
    .max(MAX_STRING_LENGTH, "Túl hosszú szöveg.")
    .optional(),
  model: z
    .string()
    .trim()
    .min(1, "A modell nem lehet üres.")
    .max(MAX_STRING_LENGTH, "Túl hosszú szöveg.")
    .optional(),
  color: updString,
  serialNumber: updString,
  year: updYear,
  currentMileage: z.preprocess(
    (v) => (v === "" ? 0 : v),
    z.coerce
      .number()
      .int()
      .min(0, "Nem lehet negatív.")
      .max(MAX_INT_VALUE, "Túl nagy érték.")
      .optional(),
  ),
  purchasePrice: updInt,
  purchaseDate: updDate,
  batteryCapacity: updInt,
  topSpeed: updInt,
  rangeKm: updInt,
  photoUrl: updUrl,
  notes: updNotes,
});
