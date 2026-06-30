import { Garage } from "@/modules/garage/components/garage";
import { AppPage, AppPageHeader } from "@/components/app-page";

export default function GaragePage() {
  return (
    <AppPage>
      <AppPageHeader
        title="Garázs"
        description="A rollerjeid adatai, értékük és szerviztörténetük."
      />
      <Garage />
    </AppPage>
  );
}
