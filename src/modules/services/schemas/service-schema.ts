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

export const createServiceSchema = z.object({
  type: z.enum(SERVICE_TYPES),
  performedAt: z.coerce.date(),
  odometerKm: optInt,
  cost: optInt,
  notes: optString,
});
