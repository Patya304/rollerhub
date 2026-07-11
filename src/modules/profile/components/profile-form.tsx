"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileIdentity } from "@/modules/profile/components/public-profile-view";

type Profile = {
  name: string | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  profileIsPublic: boolean;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username ?? "");
  const [name, setName] = useState(profile.name ?? "");
  const [image, setImage] = useState(profile.image ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [profileIsPublic, setProfileIsPublic] = useState(
    profile.profileIsPublic,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const displayName = name || (username ? `@${username}` : "Névtelen roller");

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
          bio: bio || null,
          profileIsPublic: username ? profileIsPublic : false,
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
              Most még csak képlink adható meg.
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
              3–24 karakter. Kisbetű, szám, kötőjel és aláhúzás használható.
            </p>
            <p className="text-muted-foreground text-xs">
              Publikus profil: /profile/@{username || "felhasznalonev"}
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

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bemutatkozás</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={3}
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
            <p className="text-muted-foreground text-xs">
              Rövid bemutatkozás a publikus profilodon. Legfeljebb 300 karakter.
            </p>
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
              checked={profileIsPublic && Boolean(username)}
              onChange={(e) => setProfileIsPublic(e.target.checked)}
              disabled={!username}
              className="accent-primary mt-0.5 h-4 w-4"
            />
            <div>
              <Label htmlFor="profileIsPublic">Publikus profil</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Ha bekapcsolod, a profilod elérhető lesz a
                /profile/@felhasznalonev címen.
              </p>
              {!username && (
                <p className="mt-1 text-xs text-amber-600">
                  Publikus profilhoz előbb adj meg felhasználónevet.
                </p>
              )}
            </div>
          </div>

          {profile.username && profile.profileIsPublic ? (
            <Link
              href={`/profile/@${profile.username}`}
              className="text-primary inline-block text-xs font-medium hover:underline"
            >
              Publikus profil megnyitása →
            </Link>
          ) : profile.username ? (
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
          {profileIsPublic && username ? (
            <ProfileIdentity
              name={displayName}
              username={username}
              image={image || null}
              bio={bio}
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button onClick={handleSave} disabled={busy}>
          {busy ? "Mentés..." : "Profil mentése"}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Elmentve.</p>}
      </div>
    </div>
  );
}
