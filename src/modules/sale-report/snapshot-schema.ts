import { z } from "zod";
import {
  CONDITION_LEVELS,
  KNOWN_ISSUES_STATES,
} from "@/modules/sale-report/condition";
import { SERVICE_TYPES } from "@/modules/services/service-types";
import type { SaleReportSnapshot } from "@/modules/sale-report/snapshot";

const conditionLevelSchema = z.enum(CONDITION_LEVELS);

// A snapshot minden dátuma `Date.toISOString()` kanonikus alakot követ.
// `z.string().datetime()` csak a STRING FORMÁTUMOT ellenőrzi, a naptárilag
// nem létező napokat (pl. február 30, nem szökőévi február 29, 13. hónap)
// nem szűri ki, mert a JS Date csendben "normalizálja" ezeket (pl. február
// 30 -> március 2). A round-trip összehasonlítás (`date.toISOString() ===
// value`) ezt megbízhatóan kiszűri: egy normalizálódott dátum sosem adja
// vissza pontosan az eredeti stringet.
const isoUtcDateTimeSchema = z.string().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    return false;
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return false;
  return date.toISOString() === value;
}, "Érvénytelen dátum.");

// Csak `http(s)://` protokoll engedélyezett - üres string, `data:`,
// `javascript:` és minden más séma elutasítva. Ez a mező végül egy <img>
// src attribútumába kerül a publikus oldalon.
const httpUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Érvénytelen kép URL.");

const conditionSnapshotSchema = z
  .object({
    overall: conditionLevelSchema.nullable(),
    battery: conditionLevelSchema.nullable(),
    brakes: conditionLevelSchema.nullable(),
    tires: conditionLevelSchema.nullable(),
    lights: conditionLevelSchema.nullable(),
    frame: conditionLevelSchema.nullable(),
    cosmetics: conditionLevelSchema.nullable(),
    knownIssuesState: z.enum(KNOWN_ISSUES_STATES),
    // A `.trim().min(1)` már a mezőszinten elutasítja az üres és a csak
    // whitespace-ből álló szöveget - null esetén ez nem fut le (a mező
    // `.nullable()`), így a REPORTED-hez tartozó "valódi szöveg" és a
    // NONE_REPORTED/NOT_PROVIDED-hez tartozó "kizárólag null" elvárás
    // egyaránt tartható marad az alábbi cross-validationnel.
    knownIssues: z.string().trim().min(1).max(1000).nullable(),
    updatedAt: isoUtcDateTimeSchema.nullable(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.knownIssuesState === "REPORTED" && data.knownIssues === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["knownIssues"],
        message: "REPORTED állapothoz szöveg szükséges.",
      });
    }
    if (data.knownIssuesState !== "REPORTED" && data.knownIssues !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["knownIssues"],
        message: "Nem REPORTED állapotnál a szöveg csak null lehet.",
      });
    }
  });

// A publikus oldal SOHA nem bízhat vakon a Prisma Json mezőben tárolt
// tartalomban - ez a séma validálja publikálás előtt (írás) és a publikus
// olvasáskor (védelem esetleges jövőbeli séma-eltérés/korrupció ellen) is.
// A `.strict()` minden szinten elutasítja az ismeretlen mezőket (pl. egy
// véletlenül belekerült `purchasePrice` vagy `id` mezőt), a root séma
// pedig kifejezetten ismert, engedélyezett kulcsokra korlátozódik.
export const saleReportSnapshotSchema: z.ZodType<SaleReportSnapshot> = z
  .object({
    version: z.literal(1),
    vehicle: z
      .object({
        brand: z.string().trim().min(1).max(200),
        model: z.string().trim().min(1).max(200),
        year: z.number().int().min(1990).max(2100).nullable(),
        currentMileage: z.number().int().min(0),
        photoUrl: httpUrlSchema.nullable(),
        batteryCapacityWh: z.number().finite().min(0).nullable(),
        factoryTopSpeedKmh: z.number().finite().min(0).nullable(),
        factoryRangeKm: z.number().finite().min(0).nullable(),
        color: z.string().max(200).nullable(),
      })
      .strict(),
    condition: conditionSnapshotSchema.nullable(),
    services: z
      .array(
        z
          .object({
            type: z.enum(SERVICE_TYPES),
            performedAt: isoUtcDateTimeSchema,
            odometerKm: z.number().int().min(0).nullable(),
          })
          .strict(),
      )
      .max(1000),
    estimate: z
      .object({ estimatedValue: z.number().int().positive() })
      .strict()
      .nullable(),
  })
  .strict();
