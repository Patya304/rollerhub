"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { verifyImageLoads } from "@/lib/verify-image-loads";

const MAX_URL_LENGTH = 2000;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ScooterPhotoEditor({
  scooterId,
  title,
  photoUrl,
}: {
  scooterId: string;
  title: string;
  photoUrl: string | null;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(photoUrl);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(photoUrl ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"checking" | "save" | "remove" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [savedPhotoUnreachable, setSavedPhotoUnreachable] = useState(false);

  function openEditor() {
    if (busy) return;
    setValue(current ?? "");
    setError("");
    setSuccessMessage("");
    setEditing(true);
  }

  function cancelEditor() {
    setEditing(false);
    setError("");
    setValue(current ?? "");
  }

  async function save() {
    setSuccessMessage("");
    const trimmed = value.trim();

    if (trimmed === (current ?? "")) {
      // Változatlan érték: nincs teendő, felesleges PATCH nélkül zárjuk be.
      setEditing(false);
      return;
    }

    if (trimmed.length === 0) {
      // Meglévő fotó törlése csak a külön megerősítésen keresztül történhet.
      setEditing(false);
      setRemoveConfirmOpen(true);
      return;
    }

    if (trimmed.length > MAX_URL_LENGTH) {
      setError("Túl hosszú URL.");
      return;
    }
    if (!isValidHttpUrl(trimmed)) {
      setError("Érvénytelen link. Csak http:// vagy https:// címet adj meg.");
      return;
    }

    setBusy("checking");
    setError("");
    const loads = await verifyImageLoads(trimmed);
    if (!loads) {
      setBusy(null);
      setError(
        "Nem sikerült betölteni a képet. Ellenőrizd, hogy a link közvetlenül egy nyilvánosan elérhető képhez vezet.",
      );
      return;
    }

    setBusy("save");
    setError("");
    try {
      const res = await fetch(`/api/scooters/${scooterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: trimmed || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Nem sikerült menteni a fényképet.");
        return;
      }
      setCurrent(trimmed || null);
      setSavedPhotoUnreachable(false);
      setEditing(false);
      setSuccessMessage("Fénykép frissítve");
      router.refresh();
    } catch {
      setError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(null);
    }
  }

  async function removePhoto() {
    setSuccessMessage("");
    setBusy("remove");
    setError("");
    try {
      const res = await fetch(`/api/scooters/${scooterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Nem sikerült eltávolítani a fényképet.");
        return;
      }
      setCurrent(null);
      setValue("");
      setSavedPhotoUnreachable(false);
      setRemoveConfirmOpen(false);
      setSuccessMessage("Fénykép eltávolítva");
      router.refresh();
    } catch {
      setError("Hálózati hiba az eltávolításkor.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      <div className="border-border/50 border-b px-5 py-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
          Fénykép
        </p>
      </div>
      <div className="space-y-4 px-5 py-5">
        {successMessage && !editing && (
          <p role="status" aria-live="polite" className="text-primary text-sm">
            {successMessage}
          </p>
        )}

        <div className="flex items-center gap-4">
          <ImageWithFallback
            src={current}
            alt={title}
            className="h-20 w-20 shrink-0 rounded-xl object-cover"
            onLoadError={() => setSavedPhotoUnreachable(true)}
            fallback={
              <div className="bg-muted flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-3xl">
                🛴
              </div>
            }
          />

          {!editing && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openEditor}
                disabled={busy !== null}
              >
                {current ? "Fénykép cseréje" : "Fénykép hozzáadása"}
              </Button>
              {current && !removeConfirmOpen && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSuccessMessage("");
                    setRemoveConfirmOpen(true);
                  }}
                  disabled={busy !== null}
                >
                  Eltávolítás
                </Button>
              )}
            </div>
          )}
        </div>

        {savedPhotoUnreachable && !editing && (
          <p className="text-muted-foreground text-xs">
            A mentett kép jelenleg nem tölthető be. Cseréld le a linket, vagy
            távolítsd el a fényképet.
          </p>
        )}

        {editing && (
          <div className="space-y-2">
            <Label htmlFor="scooterPhotoUrl">Fénykép link</Label>
            <Input
              id="scooterPhotoUrl"
              type="url"
              inputMode="url"
              placeholder="https://..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              maxLength={MAX_URL_LENGTH}
              aria-invalid={!!error}
              aria-describedby={error ? "scooterPhotoUrl-error" : undefined}
            />
            <p className="text-muted-foreground text-xs">
              Adj meg egy közvetlen HTTPS-képlinket.
            </p>
            {error && (
              <p
                id="scooterPhotoUrl-error"
                role="alert"
                className="text-xs text-red-500"
              >
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                onClick={save}
                disabled={busy !== null || value.trim() === (current ?? "")}
              >
                {busy === "checking"
                  ? "Kép ellenőrzése..."
                  : busy === "save"
                    ? "Mentés..."
                    : "Fénykép mentése"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cancelEditor}
                disabled={busy !== null}
              >
                Mégsem
              </Button>
            </div>
          </div>
        )}

        {removeConfirmOpen && !editing && (
          <div className="bg-muted/40 flex flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm">
                Eltávolítod a(z) {title} fényképét? Csak ehhez a rollerhez
                tartozó kép tűnik el.
              </p>
              {error && (
                <p role="alert" className="mt-1 text-xs text-red-500">
                  {error}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removePhoto}
                disabled={busy !== null}
              >
                {busy === "remove" ? "Eltávolítás..." : "Fénykép eltávolítása"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRemoveConfirmOpen(false)}
                disabled={busy !== null}
              >
                Mégsem
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
