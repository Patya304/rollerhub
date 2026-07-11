import { z } from "zod";

export const LANGUAGES = ["hu", "en", "de"] as const;
export const THEMES = [
  "default",
  "black-white",
  "black-orange",
  "black-blue",
] as const;

export type Language = (typeof LANGUAGES)[number];
export type Theme = (typeof THEMES)[number];

// Részleges frissítés: hiányzó mező -> nem módosul, "" -> null (törlés).
// Így a Profilom oldal és a Beállítások oldal ugyanazt a schemát és API-t
// használhatja, mindegyik csak a saját mezőit küldi.
const usernameSchema = z.preprocess(
  (v) => {
    if (v === undefined) return undefined;
    if (v === "" || v === null) return null;
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
    .nullable()
    .optional(),
);

const nameSchema = z.preprocess((v) => {
  if (v === undefined) return undefined;
  return v === "" || v === null ? null : v;
}, z.string().trim().max(60, "A név legfeljebb 60 karakter.").nullable().optional());

const imageSchema = z.preprocess((v) => {
  if (v === undefined) return undefined;
  return v === "" || v === null ? null : v;
}, z.string().trim().url("Érvénytelen kép-URL.").nullable().optional());

const bioSchema = z.preprocess((v) => {
  if (v === undefined) return undefined;
  if (v === "" || v === null) return null;
  return typeof v === "string" ? v.trim() : v;
}, z.string().max(300, "A bemutatkozás legfeljebb 300 karakter.").nullable().optional());

export const updateSettingsSchema = z
  .object({
    username: usernameSchema,
    name: nameSchema,
    image: imageSchema,
    bio: bioSchema,
    profileIsPublic: z.boolean({ message: "Érvénytelen érték." }).optional(),
    preferredLanguage: z.enum(LANGUAGES).optional(),
    theme: z.enum(THEMES).optional(),
  })
  .refine((data) => data.profileIsPublic !== true || data.username != null, {
    message: "Publikus profilhoz előbb adj meg felhasználónevet.",
    path: ["profileIsPublic"],
  });
