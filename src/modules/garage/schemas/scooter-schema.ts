import { z } from "zod";

const currentYear = new Date().getFullYear();

// ----- CREATE mezőtípusok: üres/hiányzó opcionális -> kimarad -----
const optString = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().trim().optional(),
);
const optInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().int().min(0, "Nem lehet negatív.").optional(),
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

export const createScooterSchema = z.object({
  brand: z.string().trim().min(1, "A márka kötelező."),
  model: z.string().trim().min(1, "A modell kötelező."),
  color: optString,
  serialNumber: optString,
  year: optYear,
  currentMileage: optInt,
  purchasePrice: optInt,
  batteryCapacity: optInt,
  topSpeed: optInt,
  rangeKm: optInt,
  photoUrl: optUrl,
  notes: optString,
});

// ----- UPDATE mezőtípusok: "" -> null (törlés), hiányzó -> nem módosul -----
const updString = z.preprocess(
  (v) => (v === "" ? null : v),
  z.string().trim().nullable().optional(),
);
const updInt = z.preprocess(
  (v) => (v === "" ? null : v),
  z.coerce.number().int().min(0, "Nem lehet negatív.").nullable().optional(),
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

export const updateScooterSchema = z.object({
  brand: z.string().trim().min(1, "A márka nem lehet üres.").optional(),
  model: z.string().trim().min(1, "A modell nem lehet üres.").optional(),
  color: updString,
  serialNumber: updString,
  year: updYear,
  currentMileage: z.preprocess(
    (v) => (v === "" ? 0 : v),
    z.coerce.number().int().min(0, "Nem lehet negatív.").optional(),
  ),
  purchasePrice: updInt,
  batteryCapacity: updInt,
  topSpeed: updInt,
  rangeKm: updInt,
  photoUrl: updUrl,
  notes: updString,
});
