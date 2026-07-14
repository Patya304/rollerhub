import { Garage } from "@/modules/garage/components/garage";
import { AppPage, AppPageHeader } from "@/components/app-page";

export default async function GaragePage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>;
}) {
  // ?add=1 esetén azonnal a hozzáadás wizarddal nyílik (pl. dashboard CTA-ról).
  const { add } = await searchParams;

  return (
    <AppPage>
      <AppPageHeader
        eyebrow="02 · Garázs"
        title="A garázsod"
        description="Rollereid adatlapja, becsült értékük és szerviztörténetük."
      />
      <Garage initialShowForm={add === "1"} />
    </AppPage>
  );
}
