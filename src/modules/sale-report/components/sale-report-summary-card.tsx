import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Readiness } from "@/modules/sale-report/readiness";
import type { PublishedSnapshotStatus } from "@/modules/sale-report/services/sale-report-service";

export function SaleReportSummaryCard({
  scooterId,
  readiness,
  isShared,
  snapshotStatus,
  publicToken,
}: {
  scooterId: string;
  readiness: Readiness;
  isShared: boolean;
  snapshotStatus: PublishedSnapshotStatus;
  publicToken: string | null;
}) {
  // Az adatbázisban a report lehet aktív, de a felhasználó felé csak akkor
  // állítjuk "működő megosztásnak" ("Megosztva" + publikus link), ha a
  // snapshot ténylegesen publikusan olvasható - `missing`/`invalid` esetén
  // soha nem jelenik meg halott link.
  const hasReadablePublishedSnapshot =
    isShared &&
    (snapshotStatus === "up_to_date" || snapshotStatus === "outdated");

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm leading-relaxed">
        Állítsd össze és publikáld azt az összefoglalót, amelyet a vevő látni
        fog.
      </p>

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span
          className={`rounded-full px-2.5 py-1 font-medium ${
            hasReadablePublishedSnapshot
              ? "bg-green-500/10 text-green-600"
              : "bg-muted/60 text-muted-foreground"
          }`}
        >
          {hasReadablePublishedSnapshot ? "Megosztva" : "Nincs megosztva"}
        </span>
        <span className="bg-muted/60 text-muted-foreground rounded-full px-2.5 py-1 font-medium">
          {readiness.levelLabel}
        </span>
        {snapshotStatus === "missing" && (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-medium text-amber-600">
            Frissítés szükséges
          </span>
        )}
        {snapshotStatus === "invalid" && (
          <span className="rounded-full bg-red-500/10 px-2.5 py-1 font-medium text-red-500">
            Újrapublikálás szükséges
          </span>
        )}
        {snapshotStatus === "outdated" && (
          <span className="border-primary/30 text-primary rounded-full border px-2.5 py-1 font-medium">
            Nem publikált módosítások
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild size="sm">
          <Link href={`/garage/${scooterId}/sale-report`}>
            Állapotlap szerkesztése
          </Link>
        </Button>
        {hasReadablePublishedSnapshot && publicToken && (
          <a
            href={`/report/${publicToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
          >
            Publikus állapotlap megnyitása →
          </a>
        )}
      </div>
    </div>
  );
}
