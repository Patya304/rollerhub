import { z } from "zod";
import { SERVICE_TYPES } from "@/modules/services/service-types";

const optInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().int().min(0, "Nem lehet negatív.").optional(),
);
const optString = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().trim().optional(),
);

const MAX_FUTURE_MS = 24 * 60 * 60 * 1000; // 1 nap tolerancia

// Kötelező, nem üres string -> érvényes dátum (null/"" elutasítva)
const requiredDate = z
  .string()
  .trim()
  .min(1, "A dátum kötelező.")
  .pipe(z.coerce.date());

export const createServiceSchema = z.object({
  type: z.enum(SERVICE_TYPES),
  performedAt: requiredDate.refine(
    (d) => d.getTime() <= Date.now() + MAX_FUTURE_MS,
    "A szerviz dátuma nem lehet a jövőben.",
  ),
  odometerKm: optInt,
  cost: optInt,
  notes: optString,
});
