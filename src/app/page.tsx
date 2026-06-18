"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">RollerHub</h1>
      {isPending ? (
        <p>Betöltés...</p>
      ) : session ? (
        <Link href="/dashboard">
          <Button>Garázs megnyitása</Button>
        </Link>
      ) : (
        <div className="flex gap-3">
          <Link href="/sign-up">
            <Button variant="outline">Regisztráció</Button>
          </Link>
          <Link href="/sign-in">
            <Button>Belépés</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
