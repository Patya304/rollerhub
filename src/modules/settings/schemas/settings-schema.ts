import { z } from "zod";

export const LANGUAGES = ["hu", "en", "de"] as const;
export const THEMES = ["black-white", "black-orange", "black-blue"] as const;

export type Language = (typeof LANGUAGES)[number];
export type Theme = (typeof THEMES)[number];

const usernameSchema = z.preprocess(
  (v) => {
    if (v === "" || v == null) return null;
    return typeof v === "string" ? v.trim().toLowerCase() : v;
  },
  z
    .string()
    .min(3, "A felhasználónév legalább 3 karakter.")
    .max(24, "A felhasználónév legfeljebb 24 karakter.")
    .regex(
      /^[a-z0-9_-]+$/,
      "Csak kisbetű, szám, kötőjel és aláhúzás engedélyezett.",
    )
    .nullable(),
);

const nameSchema = z.preprocess(
  (v) => (v === "" || v == null ? null : v),
  z.string().trim().max(60, "A név legfeljebb 60 karakter.").nullable(),
);

const imageSchema = z.preprocess(
  (v) => (v === "" || v == null ? null : v),
  z.string().trim().url("Érvénytelen kép-URL.").nullable(),
);

export const updateSettingsSchema = z.object({
  username: usernameSchema,
  name: nameSchema,
  image: imageSchema,
  preferredLanguage: z.enum(LANGUAGES),
  theme: z.enum(THEMES),
});
