import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ScooterNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-xl border border-dashed px-8 py-14 text-center">
        <p className="text-4xl">🛴</p>
        <p className="mt-4 font-semibold">Ez a roller nem található.</p>
        <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
          Lehet, hogy törölve lett, vagy már nem érhető el.
        </p>
        <Button asChild className="mt-6">
          <Link href="/garage">Vissza a Garázsba</Link>
        </Button>
      </div>
    </div>
  );
}
