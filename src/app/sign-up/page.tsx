"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    setMessage("Regisztráció folyamatban...");
    const { error } = await signUp.email({ email, password, name });
    if (error) {
      setMessage(`Hiba: ${error.message}`);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Regisztráció</h1>
        <div className="space-y-2">
          <Label htmlFor="name">Név</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Jelszó</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button onClick={handleSignUp} className="w-full">
          Regisztrálok
        </Button>
        {message && <p className="text-sm">{message}</p>}
        <p className="text-muted-foreground text-center text-sm">
          Már van fiókod?{" "}
          <Link href="/sign-in" className="underline">
            Belépés
          </Link>
        </p>
      </div>
    </main>
  );
}
