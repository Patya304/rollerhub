import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// A belépés a landingról és az árak oldalról is elérhető, ezért az app
// vizuális rendszerében, fix témával jelenik meg, nem fehér külön oldalként.
// Bejelentkezett user nem kap login formot, megy vissza az appba.
export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div
      data-theme="black-orange"
      className="bg-background text-foreground flex min-h-screen flex-col"
    >
      {children}
    </div>
  );
}
