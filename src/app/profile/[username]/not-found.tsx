import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-4xl">🛴</p>
      <h1 className="mt-4 text-xl font-bold tracking-tight">
        Ez a profil nem található
      </h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm leading-relaxed">
        Lehet, hogy a felhasználónév megváltozott, vagy a profil már nem
        elérhető.
      </p>
      <Link
        href="/"
        className="text-primary mt-6 inline-block text-sm font-medium hover:underline"
      >
        Vissza a főoldalra
      </Link>
    </main>
  );
}
