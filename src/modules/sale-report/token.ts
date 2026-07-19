import { randomBytes } from "node:crypto";

// URL-safe, kriptográfiailag biztonságos publikus token. 32 nyers byte
// (256 bit) base64url kódolva ~43 karakter, nem tartalmaz user/scooter ID-t,
// és nem sorozatszerű. Node beépített crypto modulja, nincs új dependency.
export function generateShareToken(): string {
  return randomBytes(32).toString("base64url");
}
