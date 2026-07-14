// A belépés a landingról és az árak oldalról is elérhető, ezért az app
// vizuális rendszerében, fix témával jelenik meg, nem fehér külön oldalként.
export default function SignInLayout({
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
