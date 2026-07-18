"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ValuePageError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        role="alert"
        className="rounded-xl border border-dashed px-8 py-14 text-center"
      >
        <p className="font-semibold">
          Nem sikerült betölteni az értékbecslést.
        </p>
        <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
          Próbáld újra, vagy nézd meg a Garázsban.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={reset}>Próbáld újra</Button>
          <Button asChild variant="outline">
            <Link href="/garage">Vissza a Garázsba</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
