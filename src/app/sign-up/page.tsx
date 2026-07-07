"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function signUpErrorMessage(code?: string): string {
  switch (code) {
    case "USER_ALREADY_EXISTS":
      return "Ezzel az email címmel már létezik fiók. Próbálj belépni.";
    case "PASSWORD_TOO_SHORT":
      return "A jelszó túl rövid. Legalább 8 karakter szükséges.";
    case "PASSWORD_TOO_LONG":
      return "A jelszó túl hosszú.";
    case "INVALID_EMAIL":
      return "Érvénytelen email cím.";
    default:
      return "Sikertelen regisztráció. Ellenőrizd az adatokat, és próbáld újra.";
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("A név, az email cím és a jelszó is kötelező.");
      return;
    }
    setBusy(true);
    try {
      const { error: signUpError } = await signUp.email({
        email,
        password,
        name,
      });
      if (signUpError) {
        setError(signUpErrorMessage(signUpError.code));
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
      <form onSubmit={handleSignUp} className="w-full max-w-sm space-y-4">
        <div>
          <Link
            href="/"
            className="text-muted-foreground mb-6 inline-block text-sm hover:underline"
          >
            ← RollerHub
          </Link>
          <h1 className="text-2xl font-semibold">Regisztráció</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Hozd létre a RollerHub garázsodat. Ingyenes, azonnal elérhető.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Név</Label>
          <Input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-muted-foreground text-xs">Legalább 8 karakter.</p>
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Regisztráció..." : "Regisztrálok"}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-muted-foreground text-center text-sm">
          Már van fiókod?{" "}
          <Link href="/sign-in" className="underline">
            Belépés
          </Link>
        </p>
      </form>
    </main>
  );
}
