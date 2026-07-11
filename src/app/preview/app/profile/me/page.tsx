import Link from "next/link";
import { AppPage, AppPageHeader } from "@/components/app-page";
import { ProfileIdentity } from "@/modules/profile/components/public-profile-view";
import { DEMO_USER } from "@/modules/preview/demo-data";

export default function PreviewMyProfilePage() {
  return (
    <AppPage>
      <AppPageHeader
        eyebrow="07 · Profilom"
        title="Profilom"
        description="Profilkép, felhasználónév és publikus profil."
      />

      {/* Profil alapadatok */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Profil
          </p>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Profilkép link</p>
            <div className="border-input bg-background h-9 w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm opacity-60">
              https://...
            </div>
            <p className="text-muted-foreground text-xs">
              Demóban nem szerkeszthető.
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Felhasználónév</p>
            <div className="border-input bg-background h-9 cursor-not-allowed rounded-md border px-3 py-2 text-sm opacity-60">
              {DEMO_USER.username}
            </div>
            <p className="text-muted-foreground text-xs">
              Publikus profil: /profile/@{DEMO_USER.username}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Megjelenített név</p>
            <div className="border-input bg-background h-9 cursor-not-allowed rounded-md border px-3 py-2 text-sm opacity-60">
              {DEMO_USER.name}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Bemutatkozás</p>
            <div className="border-input bg-background w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm leading-relaxed opacity-60">
              {DEMO_USER.bio}
            </div>
            <p className="text-muted-foreground text-xs">
              Rövid bemutatkozás a publikus profilodon.
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
              type="checkbox"
              checked={DEMO_USER.profileIsPublic}
              disabled
              readOnly
              className="accent-primary mt-0.5 h-4 w-4 opacity-60"
            />
            <div>
              <p className="text-sm font-medium">Publikus profil</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Ha bekapcsolod, a profilod elérhető lesz a
                /profile/@felhasznalonev címen. Demóban nem módosítható.
              </p>
            </div>
          </div>
          <Link
            href="/preview/app/profile/public"
            className="text-primary inline-block text-xs font-medium hover:underline"
          >
            Publikus profil megnyitása →
          </Link>
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
          <ProfileIdentity
            name={DEMO_USER.name}
            username={DEMO_USER.username}
            image={null}
            bio={DEMO_USER.bio}
          />
          <p className="text-muted-foreground mt-3 text-xs">
            A publikus profilon a publikusra jelölt rollereid alapadatai is
            megjelennek.
          </p>
        </div>
      </div>

      {/* Mentés — demóban letiltva */}
      <div>
        <button
          disabled
          className="bg-primary text-primary-foreground cursor-not-allowed rounded-lg px-5 py-2.5 text-sm font-medium opacity-50"
        >
          Profil mentése
        </button>
        <p className="text-muted-foreground mt-1.5 text-xs">
          Demóban nem lehet menteni.
        </p>
      </div>
    </AppPage>
  );
}
