"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  type Language,
  type Theme,
} from "@/modules/settings/schemas/settings-schema";
import { SettingsThemeOptions } from "@/components/settings-theme-options";
import { SettingsProfilePointer } from "@/modules/settings/components/settings-profile-pointer";

const THEME_OPTIONS: {
  value: Theme;
  label: string;
  hint: string;
  recommended?: boolean;
}[] = [
  { value: "default", label: "Alap", hint: "Shadcn default" },
  { value: "black-white", label: "Fekete / fehér", hint: "Letisztult" },
  {
    value: "black-orange",
    label: "Fekete / narancs",
    hint: "Sport",
    recommended: true,
  },
  { value: "black-blue", label: "Fekete / kék", hint: "Tech" },
];

type Settings = {
  email: string;
  preferredLanguage: Language;
  theme: Theme;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  // A nyelvválasztó UI-t kivettük (nincs még többnyelvű felület), a mentés
  // változatlanul küldi a tárolt értéket, így az API contract nem változik.
  const [language] = useState<Language>(settings.preferredLanguage);
  const [theme, setTheme] = useState<Theme>(settings.theme);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setError("");
    setSuccess(false);
    setBusy(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredLanguage: language,
          theme,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Hiba a mentéskor.");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Profil mutató */}
      <SettingsProfilePointer href="/profile/me" />

      {/* Megjelenés szekció */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Megjelenés
          </p>
        </div>
        <div className="px-5 py-5">
          <SettingsThemeOptions
            options={THEME_OPTIONS}
            value={theme}
            onChange={(v) => setTheme(v as Theme)}
          />
        </div>
      </div>

      {/* Fiók szekció */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Fiók és biztonság
          </p>
        </div>
        <div className="px-5 py-3 text-sm">
          <span>Email</span>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {settings.email}
          </p>
        </div>
      </div>

      {/* Mentés */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button onClick={handleSave} disabled={busy}>
          {busy ? "Mentés..." : "Beállítások mentése"}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Elmentve.</p>}
      </div>
    </div>
  );
}
