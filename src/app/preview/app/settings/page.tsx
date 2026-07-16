import { AppPage, AppPageHeader } from "@/components/app-page";
import { SettingsThemeOptions } from "@/components/settings-theme-options";
import { SettingsProfilePointer } from "@/modules/settings/components/settings-profile-pointer";
import { DEMO_USER, THEME_OPTIONS } from "@/modules/preview/demo-data";

export default function PreviewSettingsPage() {
  const activeTheme = "black-orange";

  return (
    <AppPage>
      <AppPageHeader title="Beállítások" />

      {/* Profil mutató */}
      <SettingsProfilePointer href="/preview/app/profile/me" />

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
            Demó módban a témát nem lehet váltani. Az oldal mindig Fekete /
            narancs témával jelenik meg.
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
        <div className="px-5 py-3 text-sm">
          <span>Email</span>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {DEMO_USER.email}
          </p>
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
          Demóban nem lehet menteni.
        </p>
      </div>
    </AppPage>
  );
}
