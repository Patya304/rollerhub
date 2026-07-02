"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Bike,
  TrendingUp,
  Wrench,
  Route,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Bike,
    title: "Digitális garázs",
    text: "Rollereid adatai, szervizei és becsült értékei.",
  },
  {
    icon: TrendingUp,
    title: "Értékbecslés",
    text: "Tájékoztató becslés vételár, évjárat és km-állás alapján.",
  },
  {
    icon: Wrench,
    title: "Szervizkönyv",
    text: "Rögzítsd a gumicserét, féket, akkut és minden karbantartást, költségekkel együtt.",
  },
  {
    icon: Route,
    title: "Menetnapló",
    text: "Menetek távval, idővel és sebességgel.",
  },
  {
    icon: BookOpen,
    title: "Tudástár",
    text: "Szabályok, biztosítás és jogosítvány.",
  },
  {
    icon: ShieldCheck,
    title: "Befektetésvédő",
    text: "Átlátható előzmények, ha később eladnád a rollered.",
  },
];

export default function Home() {
  const { data: session, isPending } = useSession();
  const loggedIn = !isPending && !!session;

  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold">🛴 RollerHub</span>
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Garázs megnyitása</Link>
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

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          A rollered digitális otthona
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-lg">
          Szerviznapló, értékbecslés, menetnapló és Tudástár rollereseknek.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {loggedIn ? (
            <Button asChild size="lg">
              <Link href="/dashboard">Megnyitom a garázsom</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/sign-up">Kezdés ingyen</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-in">Belépés</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="space-y-2 rounded-lg border p-5">
                <Icon className="h-6 w-6" />
                <h3 className="font-medium">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="text-muted-foreground mt-auto border-t px-6 py-6 text-center text-sm">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>RollerHub · {new Date().getFullYear()}</span>
          <span>·</span>
          <Link href="/pricing" className="underline">
            Árak
          </Link>
          <span>·</span>
          <Link href="/devlog" className="underline">
            Fejlesztési napló
          </Link>
          <span>·</span>
          <Link href="/privacy" className="underline">
            Adatkezelés
          </Link>
          <span>·</span>
          <Link href="/terms" className="underline">
            Felhasználási feltételek
          </Link>
        </p>
      </footer>
    </main>
  );
}
