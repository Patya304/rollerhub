"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ScooterVisibility({
  scooterId,
  isPublic,
  profileIsPublic,
  username,
}: {
  scooterId: string;
  isPublic: boolean;
  profileIsPublic: boolean;
  username: string | null;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(isPublic);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Publikus link csak akkor létezhet, ha mindhárom feltétel teljesül:
  // érvényes username, publikus profil ÉS publikus roller.
  const publicUrl =
    profileIsPublic && username && current
      ? `/profile/@${username}/scooters/${scooterId}`
      : null;

  async function toggle() {
    if (busy) return;
    const next = !current;
    setBusy(true);
    setError("");
    setSuccessMessage("");
    try {
      const res = await fetch(`/api/scooters/${scooterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Nem sikerült menteni a beállítást.");
        return;
      }
      setCurrent(next);
      setSuccessMessage(
        next
          ? "A roller publikus beállítása frissült."
          : "A roller már nem jelenik meg a publikus profilodon.",
      );
      router.refresh();
    } catch {
      setError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    if (!publicUrl) return;
    const fullUrl = `${window.location.origin}${publicUrl}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Nem sikerült másolni a linket.");
    }
  }

  let statusText: string;
  if (!profileIsPublic && !current) {
    statusText = "Ez a roller csak neked látható.";
  } else if (!profileIsPublic && current) {
    statusText =
      "A roller publikusra van jelölve, de a profilod még privát, ezért mások nem látják.";
  } else if (profileIsPublic && !current) {
    statusText = "A profilod publikus, de ez a roller nem jelenik meg rajta.";
  } else {
    statusText = "Ez a roller megjelenik a publikus profilodon.";
  }

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      <div className="border-border/50 border-b px-5 py-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
          Publikus megjelenés
        </p>
      </div>
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-start gap-3">
          <input
            id="scooterIsPublic"
            type="checkbox"
            checked={current}
            onChange={toggle}
            disabled={busy}
            className="accent-primary mt-0.5 h-4 w-4"
          />
          <div>
            <label htmlFor="scooterIsPublic" className="font-medium">
              Publikus a profilomon
            </label>
            <p className="text-muted-foreground mt-0.5 text-xs">
              A márka, modell, évjárat, Km-állás, a megadott fénykép és a
              szervizek száma válik láthatóvá.
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              A szervizrészletek, vételár, értékbecslés és megjegyzések privátak
              maradnak.
            </p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm">{statusText}</p>

        {successMessage && (
          <p role="status" aria-live="polite" className="text-primary text-sm">
            {successMessage}
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {!profileIsPublic && current && (
            <Button asChild variant="outline" size="sm">
              <Link href="/profile/me">Profil beállítása</Link>
            </Button>
          )}
          {publicUrl && (
            <>
              <Button asChild variant="outline" size="sm">
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  Publikus oldal megnyitása
                </a>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={copyLink}
              >
                {copied ? "Link másolva" : "Link másolása"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
