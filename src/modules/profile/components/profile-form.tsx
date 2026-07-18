"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { ProfileIdentity } from "@/modules/profile/components/public-profile-view";
import { verifyImageLoads } from "@/lib/verify-image-loads";

type Profile = {
  name: string | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  profileIsPublic: boolean;
};

type FormValues = {
  username: string;
  name: string;
  image: string;
  bio: string;
  profileIsPublic: boolean;
};

const USERNAME_REGEX = /^[a-z0-9_-]+$/;
const MAX_IMAGE_URL_LENGTH = 2000;

function valuesFromProfile(p: Profile): FormValues {
  return {
    username: p.username ?? "",
    name: p.name ?? "",
    image: p.image ?? "",
    bio: p.bio ?? "",
    profileIsPublic: p.profileIsPublic,
  };
}

// A szerver ugyanígy normalizálja a mezőket mentéskor; a PATCH body és a
// mentés utáni baseline is ebből a függvényből származik, hogy a kliens
// állapota pontosan a szerveren elmentett értéket tükrözze.
function normalizeValues(v: FormValues): FormValues {
  const username = v.username.trim().toLowerCase();
  return {
    username,
    name: v.name.trim(),
    image: v.image.trim(),
    bio: v.bio.trim(),
    profileIsPublic: username ? v.profileIsPublic : false,
  };
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(v: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (v.username) {
    if (v.username.length < 3 || v.username.length > 24) {
      errors.username = "A felhasználónév 3-24 karakter lehet.";
    } else if (!USERNAME_REGEX.test(v.username)) {
      errors.username =
        "Csak kisbetű, szám, kötőjel és aláhúzás engedélyezett.";
    }
  } else if (v.profileIsPublic) {
    errors.username = "Publikus profilhoz előbb adj meg felhasználónevet.";
  }

  if (v.name.length > 60) {
    errors.name = "A név legfeljebb 60 karakter.";
  }

  if (v.bio.length > 300) {
    errors.bio = "A bemutatkozás legfeljebb 300 karakter.";
  }

  if (v.image.trim()) {
    if (v.image.trim().length > MAX_IMAGE_URL_LENGTH) {
      errors.image = "Túl hosszú link.";
    } else if (!isValidHttpUrl(v.image.trim())) {
      errors.image =
        "Érvénytelen link. Csak http:// vagy https:// címet adj meg.";
    }
  }

  return errors;
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [baseline, setBaseline] = useState<FormValues>(() =>
    valuesFromProfile(profile),
  );
  const [values, setValues] = useState<FormValues>(() =>
    valuesFromProfile(profile),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<"checking" | "save" | false>(false);
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [imageUnreachable, setImageUnreachable] = useState(false);

  const isDirty = JSON.stringify(values) !== JSON.stringify(baseline);

  useEffect(() => {
    if (!isDirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const displayName =
    values.name ||
    (values.username ? `@${values.username}` : "Névtelen profil");

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSuccess(false);
  }

  function discardChanges() {
    setValues(baseline);
    setFieldErrors({});
    setSaveError("");
    setImageUnreachable(false);
    setDiscardConfirmOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    const normalized = normalizeValues(values);
    const errors = validate(normalized);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (normalized.image && normalized.image !== baseline.image) {
      setBusy("checking");
      const loads = await verifyImageLoads(normalized.image);
      if (!loads) {
        setBusy(false);
        setFieldErrors((prev) => ({
          ...prev,
          image:
            "Nem sikerült betölteni a képet. Ellenőrizd, hogy a link közvetlenül egy nyilvánosan elérhető képhez vezet.",
        }));
        return;
      }
    }

    setBusy("save");
    setSaveError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: normalized.username || null,
          name: normalized.name || null,
          image: normalized.image || null,
          bio: normalized.bio || null,
          profileIsPublic: normalized.profileIsPublic,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error ?? "Hiba a mentéskor.");
        return;
      }
      setBaseline(normalized);
      setValues(normalized);
      setImageUnreachable(false);
      setSuccess(true);
      router.refresh();
    } catch {
      setSaveError("Hálózati hiba a mentéskor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Profil alapadatok */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Profil
          </p>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="space-y-1.5">
            <Label htmlFor="image">Profilkép link</Label>
            <Input
              id="image"
              type="url"
              inputMode="url"
              value={values.image}
              onChange={(e) => {
                setField("image", e.target.value);
                setImageUnreachable(false);
              }}
              placeholder="https://..."
              maxLength={MAX_IMAGE_URL_LENGTH}
              aria-invalid={!!fieldErrors.image}
              aria-describedby={fieldErrors.image ? "image-error" : undefined}
            />
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={values.image.trim() || null}
                alt="Profilkép előnézet"
                className="h-16 w-16 rounded-full border object-cover"
                onLoadError={() => setImageUnreachable(true)}
                fallback={
                  <span className="bg-muted text-muted-foreground flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold">
                    {(values.name || values.username || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                }
              />
              <p className="text-muted-foreground text-xs">
                Most még csak képlink adható meg.
              </p>
            </div>
            {imageUnreachable && values.image.trim() && !fieldErrors.image && (
              <p className="text-muted-foreground text-xs">
                A kép jelenleg nem tölthető be. Cseréld le a linket, vagy töröld
                a mezőt.
              </p>
            )}
            {fieldErrors.image && (
              <p id="image-error" role="alert" className="text-xs text-red-500">
                {fieldErrors.image}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Felhasználónév</Label>
            <Input
              id="username"
              value={values.username}
              onChange={(e) => {
                const next = e.target.value.toLowerCase();
                setValues((v) => ({
                  ...v,
                  username: next,
                  profileIsPublic: next ? v.profileIsPublic : false,
                }));
                setSuccess(false);
              }}
              placeholder="pl. ruprider"
              maxLength={24}
              aria-invalid={!!fieldErrors.username}
              aria-describedby={
                fieldErrors.username ? "username-error" : undefined
              }
            />
            <p className="text-muted-foreground text-xs">
              3-24 karakter. Kisbetű, szám, kötőjel és aláhúzás használható.
            </p>
            <p className="text-muted-foreground text-xs">
              Publikus profil: /profile/@{values.username || "felhasznalonev"}
            </p>
            {fieldErrors.username && (
              <p
                id="username-error"
                role="alert"
                className="text-xs text-red-500"
              >
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Megjelenített név</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              maxLength={60}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
            {fieldErrors.name && (
              <p id="name-error" role="alert" className="text-xs text-red-500">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bemutatkozás</Label>
            <textarea
              id="bio"
              value={values.bio}
              onChange={(e) => setField("bio", e.target.value)}
              maxLength={300}
              rows={3}
              aria-invalid={!!fieldErrors.bio}
              aria-describedby={fieldErrors.bio ? "bio-error" : undefined}
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
            <p className="text-muted-foreground text-xs">
              {values.bio.length}/300 karakter
            </p>
            {fieldErrors.bio && (
              <p id="bio-error" role="alert" className="text-xs text-red-500">
                {fieldErrors.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Publikus profil */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Publikus profil
          </p>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex items-start gap-3">
            <input
              id="profileIsPublic"
              type="checkbox"
              checked={values.profileIsPublic && Boolean(values.username)}
              onChange={(e) => setField("profileIsPublic", e.target.checked)}
              disabled={!values.username}
              className="accent-primary mt-0.5 h-4 w-4"
            />
            <div>
              <Label htmlFor="profileIsPublic">Publikus profil</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Ha bekapcsolod, a profilod elérhető lesz a
                /profile/@felhasznalonev címen.
              </p>
              {!values.username && (
                <p className="mt-1 text-xs text-amber-600">
                  Publikus profilhoz előbb adj meg felhasználónevet.
                </p>
              )}
            </div>
          </div>

          {baseline.username && baseline.profileIsPublic ? (
            <Link
              href={`/profile/@${baseline.username}`}
              className="text-primary inline-block text-xs font-medium hover:underline"
            >
              Publikus profil megnyitása →
            </Link>
          ) : baseline.username ? (
            <p className="text-muted-foreground text-xs">
              A profilod jelenleg privát.
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">
              Adj meg felhasználónevet a publikus profilhoz.
            </p>
          )}
        </div>
      </div>

      {/* Előnézet */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Előnézet
          </p>
        </div>
        <div className="px-5 py-5">
          {values.profileIsPublic && values.username ? (
            <ProfileIdentity
              name={displayName}
              username={values.username}
              image={values.image.trim() || null}
              bio={values.bio}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              A profilod jelenleg privát, mások nem látják.
            </p>
          )}
          <p className="text-muted-foreground mt-3 text-xs">
            A publikus profilon a publikusra jelölt rollereid alapadatai is
            megjelennek. Ezt a roller adatlapján kapcsolhatod.
          </p>
        </div>
      </div>

      {/* Mentés */}
      {discardConfirmOpen ? (
        <div
          role="alert"
          className="bg-muted/40 flex flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm">Elveted a módosításokat?</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={discardChanges}
            >
              Igen, elvetem
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDiscardConfirmOpen(false)}
            >
              Vissza a szerkesztéshez
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Button type="submit" disabled={!!busy || !isDirty}>
            {busy === "checking"
              ? "Kép ellenőrzése..."
              : busy === "save"
                ? "Mentés..."
                : "Profil mentése"}
          </Button>
          {isDirty && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDiscardConfirmOpen(true)}
              disabled={!!busy}
            >
              Mégsem
            </Button>
          )}
          {saveError && (
            <p role="alert" className="text-sm text-red-500">
              {saveError}
            </p>
          )}
          {success && (
            <p
              role="status"
              aria-live="polite"
              className="text-primary text-sm"
            >
              Profil frissítve
            </p>
          )}
        </div>
      )}
    </form>
  );
}
