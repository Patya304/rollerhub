import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserSettings } from "@/modules/settings/services/settings-service";
import { SettingsForm } from "@/modules/settings/components/settings-form";
import {
  type Language,
  type Theme,
} from "@/modules/settings/schemas/settings-schema";
import { AppPage, AppPageHeader } from "@/components/app-page";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const user = await getUserSettings(session.user.id);
  if (!user) redirect("/sign-in");

  return (
    <AppPage>
      <AppPageHeader
        title="Beállítások"
        description="Profil, megjelenés és fiókbeállítások."
      />
      <SettingsForm
        settings={{
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
          emailVerified: user.emailVerified,
          preferredLanguage: user.preferredLanguage as Language,
          theme: user.theme as Theme,
        }}
      />
    </AppPage>
  );
}
