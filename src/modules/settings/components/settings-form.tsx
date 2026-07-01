"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LANGUAGES,
  type Language,
  type Theme,
} from "@/modules/settings/schemas/settings-schema";

const LANGUAGE_LABELS: Record<Language, string> = {
  hu: "Magyar",
  en: "Angol",
  de: "Német",
};

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
  name: string | null;
  email: string;
  image: string | null;
  username: string | null;
  emailVerified: boolean;
  preferredLanguage: Language;
  theme: Theme;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [username, setUsername] = useState(settings.username ?? "");
  const [name, setName] = useState(settings.name ?? "");
  const [image, setImage] = useState(settings.image ?? "");
  const [language, setLanguage] = useState<Language>(
    settings.preferredLanguage,
  );
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
          username: username || null,
          name: name || null,
          image: image || null,
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
      {/* Profil szekció */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Profil
          </p>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="space-y-1.5">
            <Label htmlFor="image">Profilkép URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Profilkép előnézet"
                className="mt-2 h-16 w-16 rounded-full border object-cover"
              />
            )}
            <p className="text-muted-foreground text-xs">
              Egyelőre URL-lel. Fájlfeltöltés hamarosan.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Felhasználónév</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="pl. ruprider"
            />
            <p className="text-muted-foreground text-xs">
              3–24 karakter, csak kisbetű, szám, kötőjel és aláhúzás.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Megjelenített név</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Email cím</Label>
            <p className="text-sm">
              {settings.email}{" "}
              {settings.emailVerified ? (
                <span className="text-green-600">· megerősítve</span>
              ) : (
                <span className="text-amber-600">· nincs megerősítve</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Megjelenés szekció */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Megjelenés
          </p>
        </div>
        <div className="px-5 py-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                className={`relative rounded-lg border p-3 text-left transition-colors ${
                  theme === t.value
                    ? "border-primary bg-primary/5 ring-primary ring-1"
                    : "hover:bg-muted/50"
                }`}
              >
                {t.recommended && (
                  <span className="text-primary absolute top-2 right-2 text-xs font-semibold">
                    ★
                  </span>
                )}
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="text-muted-foreground text-xs">
                  {t.recommended ? `${t.hint} · ajánlott` : t.hint}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nyelv szekció */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Nyelv
          </p>
        </div>
        <div className="space-y-2 px-5 py-5">
          <div className="space-y-1.5">
            <Label htmlFor="language">Megjelenítési nyelv</Label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm sm:w-64"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {LANGUAGE_LABELS[l]}
                </option>
              ))}
            </select>
          </div>
          <p className="text-muted-foreground text-xs">
            A többnyelvű felület hamarosan — egyelőre csak a beállítást
            tároljuk.
          </p>
        </div>
      </div>

      {/* Fiók szekció */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Fiók és biztonság
          </p>
        </div>
        <div className="divide-border/30 divide-y px-5 text-sm">
          <div className="flex items-start justify-between gap-2 py-3">
            <div>
              <span>Email</span>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {settings.email}
              </p>
            </div>
            {settings.emailVerified ? (
              <span className="mt-0.5 shrink-0 rounded-full border border-green-600 px-2 py-0.5 text-xs text-green-600">
                Megerősítve
              </span>
            ) : (
              <span className="text-muted-foreground mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-xs">
                Nincs megerősítve
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 py-3">
            <div>
              <span>Jelszó módosítása</span>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Email-alapú jelszóvisszaállítás hamarosan.
              </p>
            </div>
            <span className="text-muted-foreground shrink-0 rounded-full border px-2 py-0.5 text-xs">
              Hamarosan
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 py-3">
            <div>
              <span className="text-muted-foreground">Fiók törlése</span>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Ez az opció hamarosan elérhető lesz.
              </p>
            </div>
            <span className="text-muted-foreground shrink-0 rounded-full border px-2 py-0.5 text-xs">
              Hamarosan
            </span>
          </div>
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
