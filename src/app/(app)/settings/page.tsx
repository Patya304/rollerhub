import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserSettings } from "@/modules/settings/services/settings-service";
import { SettingsForm } from "@/modules/settings/components/settings-form";
import {
  type Language,
  type Theme,
} from "@/modules/settings/schemas/settings-schema";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const user = await getUserSettings(session.user.id);
  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Beállítások</h1>
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
    </div>
  );
}
