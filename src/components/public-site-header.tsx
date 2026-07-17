import Link from "next/link";
import { Button } from "@/components/ui/button";

// Publikus oldalak (pl. /pricing, /sample-report) közös fejléce.
// A session lekérdezése a hívó oldal dolga, itt csak megjelenítés van.
export function PublicSiteHeader({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-lg font-semibold">
        🛴 RollerHub
      </Link>
      <div className="flex items-center gap-2">
        {loggedIn ? (
          <Button asChild size="sm">
            <Link href="/dashboard">Vissza az appba</Link>
          </Button>
        ) : (
          <>
            <Button asChild size="sm" variant="ghost">
              <Link href="/sign-in">Belépés</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Regisztráció</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
