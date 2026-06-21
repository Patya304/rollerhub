import { z } from "zod";

const optDate = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.date().optional(),
);
const optNum = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().min(0, "Nem lehet negatív.").optional(),
);

export const createRideSchema = z
  .object({
    startAt: z.coerce.date(),
    endAt: optDate,
    distanceKm: optNum,
    avgSpeed: optNum,
    maxSpeed: optNum,
  })
  .refine((d) => !d.endAt || d.endAt >= d.startAt, {
    message: "A befejezés nem lehet korábban, mint az indulás.",
    path: ["endAt"],
  });
