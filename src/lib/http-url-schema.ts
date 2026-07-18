import { z } from "zod";

// Közös kép-URL szabály: rollerfotó és profilkép is ezt használja, hogy a
// kliens és a szerver ugyanazt validálja. Csak http/https protokoll
// engedélyezett (ftp:, file:, data:, javascript: nem).
export const MAX_IMAGE_URL_LENGTH = 2000;

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const httpUrlString = () =>
  z
    .string()
    .trim()
    .max(MAX_IMAGE_URL_LENGTH, "Túl hosszú link.")
    .refine(
      isHttpUrl,
      "Érvénytelen link. Csak http:// vagy https:// cím adható meg.",
    );

/** Create mezőhöz: üres/hiányzó érték -> nem kerül mentésre (undefined). */
export const optHttpUrlSchema = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  httpUrlString().optional(),
);

/** Update mezőhöz: üres string -> null (törlés), hiányzó -> nem módosul. */
export const updHttpUrlSchema = z.preprocess(
  (v) => (v === "" ? null : v),
  httpUrlString().nullable().optional(),
);
