import { z } from "zod";

const optNum = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().min(0, "Nem lehet negatív.").optional(),
);

const MAX_FUTURE_MS = 24 * 60 * 60 * 1000; // 1 nap tolerancia

// Kötelező, nem üres string -> érvényes dátum
const requiredDate = z
  .string()
  .trim()
  .min(1, "Az időpont kötelező.")
  .pipe(z.coerce.date());

// Opcionális: üres/hiányzó -> nincs dátum; ha van, érvényesnek kell lennie
const optionalDate = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().trim().min(1).pipe(z.coerce.date()).optional(),
);

export const createRideSchema = z
  .object({
    startAt: requiredDate.refine(
      (d) => d.getTime() <= Date.now() + MAX_FUTURE_MS,
      "Az indulás nem lehet a jövőben.",
    ),
    endAt: optionalDate,
    distanceKm: optNum,
    avgSpeed: optNum,
    maxSpeed: optNum,
  })
  .refine((d) => !d.endAt || d.endAt >= d.startAt, {
    message: "A befejezés nem lehet korábban, mint az indulás.",
    path: ["endAt"],
  })
  .refine(
    (d) => d.avgSpeed == null || d.maxSpeed == null || d.maxSpeed >= d.avgSpeed,
    {
      message: "A maximális sebesség nem lehet kisebb az átlagsebességnél.",
      path: ["maxSpeed"],
    },
  );
