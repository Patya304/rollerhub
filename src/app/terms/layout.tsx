// A felhasználási feltételek a landingról és az appból is elérhetők, ezért az
// app vizuális rendszerében, fix témával jelennek meg, nem fehér külön oldalként.
export default function TermsLayout({
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
