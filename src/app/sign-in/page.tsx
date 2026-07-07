"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Add meg az email címed és a jelszavad.");
      return;
    }
    setBusy(true);
    try {
      const { error: signInError } = await signIn.email({ email, password });
      if (signInError) {
        setError("Sikertelen belépés. Ellenőrizd az email címet és a jelszót.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Hálózati hiba. Próbáld újra.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSignIn} className="w-full max-w-sm space-y-4">
        <div>
          <Link
            href="/"
            className="text-muted-foreground mb-6 inline-block text-sm hover:underline"
          >
            ← RollerHub
          </Link>
          <h1 className="text-2xl font-semibold">Belépés</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Lépj be a digitális garázsodba.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Jelszó</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Belépés..." : "Belépek"}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-muted-foreground text-center text-sm">
          Nincs fiókod?{" "}
          <Link href="/sign-up" className="underline">
            Regisztráció
          </Link>
        </p>
      </form>
    </main>
  );
}
