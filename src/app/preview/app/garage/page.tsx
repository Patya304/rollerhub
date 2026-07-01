import Link from "next/link";
import { AppPage, AppPageHeader } from "@/components/app-page";
import { DEMO_SCOOTERS } from "@/modules/preview/demo-data";

export default function PreviewGaragePage() {
  return (
    <AppPage>
      <AppPageHeader
        eyebrow="02 · Garázs"
        title="Garázs"
        description="A rollerjeid egy helyen."
      />

      <div className="bg-card divide-border/40 divide-y overflow-hidden rounded-xl border">
        {/* Ruptor — teljes adatlap elérhető */}
        <Link
          href="/preview/app/garage/demo-ruptor"
          className="hover:bg-muted/30 group flex items-center gap-4 px-5 py-4 transition-colors"
        >
          <span className="text-muted-foreground/50 flex w-8 shrink-0 items-start justify-center pt-0.5 font-mono text-xs font-semibold tabular-nums">
            01
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Ruptor R1 v2</p>
            <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
              2024 · 2 000 km · ~148 000 Ft
            </p>
          </div>
          <span className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors">
            →
          </span>
        </Link>
        {/* Ninebot — demo oldalon nincs dedikált adatlap */}
        <div className="flex items-center gap-4 px-5 py-4 opacity-60">
          <span className="text-muted-foreground/50 flex w-8 shrink-0 items-start justify-center pt-0.5 font-mono text-xs font-semibold tabular-nums">
            02
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Ninebot Max G2</p>
            <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
              2023 · 1 240 km · ~150 000 Ft
            </p>
          </div>
          <span className="text-muted-foreground text-xs">
            Demo — nincs adatlap
          </span>
        </div>
      </div>

      {/* Demo: új roller gomb */}
      <div>
        <button
          disabled
          className="text-muted-foreground cursor-not-allowed rounded-lg border px-4 py-2 text-sm opacity-50"
        >
          + Új roller hozzáadása
        </button>
        <p className="text-muted-foreground mt-1.5 text-xs">
          Demo módban nem adható hozzá új roller.
        </p>
      </div>
    </AppPage>
  );
}
