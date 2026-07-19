import type { Metadata } from "next";

// Link birtokában elérhető, de kereső által nem indexelhető: a state
// (`isActive`) állapotot nem szabad keresőmotor-találatként megőrizni
// egy visszavonás után.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  referrer: "no-referrer",
};

// A publikus Eladási állapotlap az app vizuális rendszerében jelenik meg,
// fix témával, hogy kijelentkezett látogatónak se legyen "fehér" oldal.
export default function PublicSaleReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="black-orange"
      className="bg-background text-foreground flex min-h-screen flex-col"
    >
      {children}
    </div>
  );
}
