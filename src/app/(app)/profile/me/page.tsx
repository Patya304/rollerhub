import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserSettings } from "@/modules/settings/services/settings-service";
import { ProfileForm } from "@/modules/profile/components/profile-form";
import { AppPage, AppPageHeader } from "@/components/app-page";

export default async function MyProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const user = await getUserSettings(session.user.id);
  if (!user) redirect("/sign-in");

  return (
    <AppPage>
      <AppPageHeader
        title="Profilom"
        description="Profilkép, felhasználónév és publikus profil."
      />
      <ProfileForm
        profile={{
          name: user.name,
          image: user.image,
          username: user.username,
          bio: user.bio,
          profileIsPublic: user.profileIsPublic,
        }}
      />
    </AppPage>
  );
}
