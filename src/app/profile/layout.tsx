// A publikus profil az app vizuális rendszerében jelenik meg,
// fix témával, hogy kijelentkezett látogatónak se legyen "fehér" oldal.
export default function PublicProfileLayout({
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
