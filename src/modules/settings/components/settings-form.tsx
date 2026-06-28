"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const THEME_OPTIONS: { value: Theme; label: string; hint: string }[] = [
  { value: "black-white", label: "Fekete / fehér", hint: "Letisztult" },
  { value: "black-orange", label: "Fekete / narancssárga", hint: "Sport" },
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="image">Profilkép URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Profilkép előnézet"
                className="mt-2 h-16 w-16 rounded-full border object-cover"
              />
            ) : null}
            <p className="text-muted-foreground text-xs">
              Egyelőre URL-lel. A fájlfeltöltés későbbi frissítésben érkezik.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="username">Felhasználónév</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="pl. ruprider"
            />
            <p className="text-muted-foreground text-xs">
              3–24 karakter, csak kisbetű, szám, kötőjel és aláhúzás. Később
              mások számára is látható lehet.
            </p>
          </div>

          <div className="space-y-1">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Megjelenés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  theme === t.value
                    ? "border-foreground ring-foreground ring-1"
                    : "hover:bg-muted/50"
                }`}
              >
                <span className="block text-sm font-medium">{t.label}</span>
                <span className="text-muted-foreground text-xs">{t.hint}</span>
              </button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            A téma mentésre kerül. A teljes felület átszínezése későbbi
            frissítésben érkezik.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nyelv</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="language">Nyelv</Label>
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
            A többnyelvű felület későbbi frissítésben érkezik. Egyelőre csak a
            beállítást tároljuk.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fiók és biztonság</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Email</span>
            <span>{settings.email}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Email megerősítés</span>
            <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
              Hamarosan
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Jelszó módosítása</span>
            <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
              Hamarosan
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-red-500">Fiók törlése</span>
            <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
              Hamarosan
            </span>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">A beállítások elmentve.</p>
      )}
      <Button onClick={handleSave} disabled={busy}>
        Mentés
      </Button>
    </div>
  );
}
