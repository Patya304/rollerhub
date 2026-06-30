import { Garage } from "@/modules/garage/components/garage";
import { AppPage, AppPageHeader } from "@/components/app-page";

export default function GaragePage() {
  return (
    <AppPage>
      <AppPageHeader
        eyebrow="02 · Garázs"
        title="A garázsod"
        description="Rollereid adatlapja, becsült értékük és szerviztörténetük."
      />
      <Garage />
    </AppPage>
  );
}
