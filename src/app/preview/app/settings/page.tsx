import { AppPage, AppPageHeader } from "@/components/app-page";
import { SettingsThemeOptions } from "@/components/settings-theme-options";
import { DEMO_USER, THEME_OPTIONS } from "@/modules/preview/demo-data";

export default function PreviewSettingsPage() {
  const activeTheme = "black-orange";

  return (
    <AppPage>
      <AppPageHeader eyebrow="07 · Beállítások" title="Beállítások" />

      {/* Profil */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Profil
          </p>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Profilkép URL</p>
            <div className="border-input bg-background h-9 w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm opacity-60">
              https://...
            </div>
            <p className="text-muted-foreground text-xs">
              Demo módban nem szerkeszthető.
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Felhasználónév</p>
            <div className="border-input bg-background h-9 cursor-not-allowed rounded-md border px-3 py-2 text-sm opacity-60">
              {DEMO_USER.username}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Megjelenített név</p>
            <div className="border-input bg-background h-9 cursor-not-allowed rounded-md border px-3 py-2 text-sm opacity-60">
              {DEMO_USER.name}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Email cím</p>
            <p className="text-sm">
              {DEMO_USER.email}{" "}
              <span className="text-green-600">· megerősítve</span>
            </p>
          </div>
        </div>
      </div>

      {/* Megjelenés */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Megjelenés
          </p>
        </div>
        <div className="px-5 py-5">
          <SettingsThemeOptions
            options={THEME_OPTIONS}
            value={activeTheme}
            disabled
          />
          <p className="text-muted-foreground mt-3 text-xs">
            Demo módban a témát nem lehet váltani — az oldal mindig Fekete /
            narancs témával jelenik meg.
          </p>
        </div>
      </div>

      {/* Nyelv */}
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="border-border/50 border-b px-5 py-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Nyelv
          </p>
        </div>
        <div className="px-5 py-5">
          <div className="border-input bg-background h-9 w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm opacity-60 sm:w-64">
            {DEMO_USER.language}
          </div>
          <p className="text-muted-foreground mt-1.5 text-xs">
            A többnyelvű felület hamarosan — egyelőre csak a beállítást
            tároljuk.
          </p>
        </div>
      </div>

      {/* Fiók */}
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
                {DEMO_USER.email}
              </p>
            </div>
            <span className="mt-0.5 shrink-0 rounded-full border border-green-600 px-2 py-0.5 text-xs text-green-600">
              Megerősítve
            </span>
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
        </div>
      </div>

      {/* Mentés — disabled */}
      <div>
        <button
          disabled
          className="bg-primary text-primary-foreground cursor-not-allowed rounded-lg px-5 py-2.5 text-sm font-medium opacity-50"
        >
          Beállítások mentése
        </button>
        <p className="text-muted-foreground mt-1.5 text-xs">
          Demo módban a beállítások nem menthetők.
        </p>
      </div>
    </AppPage>
  );
}
