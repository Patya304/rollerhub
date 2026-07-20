"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Readiness } from "@/modules/sale-report/readiness";
import type { PublishedSnapshotStatus } from "@/modules/sale-report/services/sale-report-service";

type ReportStatus = {
  isActive: boolean;
  publicToken: string;
  publishedAt: string | null;
} | null;

// Az összes állapotlap-dátum explicit Europe/Budapest időzónával
// formázódik, hogy a szerver saját időzónájától és a kliens böngészőjétől
// függetlenül mindig ugyanazt a naptári napot/órát mutassa.
function formatBudapestDateTime(iso: string): string {
  return new Date(iso).toLocaleString("hu-HU", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SaleReportPanel({
  scooterId,
  readiness,
  initialReport,
  initialSnapshotStatus,
}: {
  scooterId: string;
  readiness: Readiness;
  initialReport: ReportStatus;
  initialSnapshotStatus: PublishedSnapshotStatus;
}) {
  const router = useRouter();
  const [report, setReport] = useState(initialReport);
  const [snapshotStatus, setSnapshotStatus] = useState(initialSnapshotStatus);
  const [busy, setBusy] = useState<"create" | "refresh" | "revoke" | null>(
    null,
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
  const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ez a state KIZÁRÓLAG az utoljára kapott szerverpropot követi - nem
  // kevert egy optimista kliensművelet eredményével. Object.is/referencia-
  // összehasonlítás itt nem használható, mert a szerver minden renderkor
  // új objektumot ad vissza akkor is, ha az érték nem változott. A
  // handlerek (handleCreate/handleRefresh/confirmRevoke) SOHA nem írják
  // ezt a state-et - csak a `report`/`snapshotStatus` UI-state-et -, mert
  // az összekeverés azt eredményezné, hogy egy sikeres optimista művelet
  // után a komponens visszaugorhat a még régi `initialReport` prophoz.
  const [previousInitialReport, setPreviousInitialReport] =
    useState(initialReport);
  const [previousInitialSnapshotStatus, setPreviousInitialSnapshotStatus] =
    useState(initialSnapshotStatus);

  // Render-fázisú state-igazítás (React ajánlott mintája props->state
  // szinkronizálásra effect helyett - lásd "Adjusting state when a prop
  // changes" a React dokumentációban): ha az `initialReport` prop
  // ténylegesen (érték szerint) eltér a legutóbb kapott proptól, azonnal,
  // ugyanabban a render-körben igazítjuk a helyi state-et. Ha a friss adat
  // szerint a report már nem aktív, a nyitva felejtett revoke-confirm
  // dialógust is bezárjuk - de a success/error üzenetet és a
  // copy-timeoutot NEM érintjük, mert egy ártalmatlan háttérfrissítés nem
  // törölheti a user által épp látott visszajelzést.
  const initialReportChanged =
    (previousInitialReport?.isActive ?? null) !==
      (initialReport?.isActive ?? null) ||
    (previousInitialReport?.publicToken ?? null) !==
      (initialReport?.publicToken ?? null) ||
    (previousInitialReport?.publishedAt ?? null) !==
      (initialReport?.publishedAt ?? null);
  if (initialReportChanged) {
    setPreviousInitialReport(initialReport);
    setReport(initialReport);
    if (initialReport?.isActive !== true) {
      setRevokeConfirmOpen(false);
    }
  }

  if (previousInitialSnapshotStatus !== initialSnapshotStatus) {
    setPreviousInitialSnapshotStatus(initialSnapshotStatus);
    setSnapshotStatus(initialSnapshotStatus);
  }

  useEffect(() => {
    return () => {
      if (copyResetTimeout.current) clearTimeout(copyResetTimeout.current);
    };
  }, []);

  function clearPendingCopyReset() {
    if (copyResetTimeout.current) {
      clearTimeout(copyResetTimeout.current);
      copyResetTimeout.current = null;
    }
  }

  const isShared = report?.isActive === true;
  // A snapshot adatbázisban aktív lehet, de a felhasználó felé csak akkor
  // állítjuk "működő megosztásnak", ha a publikus oldal ténylegesen olvasható
  // tartalmat is ad vissza - `missing`/`invalid` esetén nincs élő halott link.
  const hasReadablePublishedSnapshot =
    isShared &&
    (snapshotStatus === "up_to_date" || snapshotStatus === "outdated");
  const publicUrl = hasReadablePublishedSnapshot
    ? `/report/${report!.publicToken}`
    : null;

  async function handleCreate() {
    if (busy) return;
    setBusy("create");
    setError("");
    setSuccessMessage("");
    setCopied(false);
    clearPendingCopyReset();
    try {
      const res = await fetch(`/api/scooters/${scooterId}/sale-report`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Nem sikerült létrehozni a megosztást.");
        router.refresh();
        return;
      }
      const reportFromResponse = {
        isActive: true,
        publicToken: data.publicToken,
        publishedAt: data.publishedAt,
      };
      if (data.createdOrReactivated) {
        // Valódi (re)aktiválás történt, friss, valid snapshottal - a
        // "naprakész" állapot biztonságosan feltételezhető.
        setReport(reportFromResponse);
        setSnapshotStatus("up_to_date");
        setSuccessMessage("Az állapotlap megosztható.");
      } else {
        // A report már korábban is aktív volt - ez egy idempotens
        // ismételt POST, ami nem ellenőrizte a snapshot állapotát. Az
        // alapadatokat átvesszük, de a snapshot-státuszt NEM állítjuk
        // vakon naprakészre; a valódi missing/invalid/outdated/up_to_date
        // állapotot a következő szerverprop-szinkron adja meg.
        setReport(reportFromResponse);
        setSuccessMessage("A megosztás már létezik.");
      }
      router.refresh();
    } catch {
      setError("Hálózati hiba a megosztás létrehozásakor.");
    } finally {
      setBusy(null);
    }
  }

  async function handleRefresh() {
    if (busy) return;
    setBusy("refresh");
    setError("");
    setSuccessMessage("");
    setCopied(false);
    clearPendingCopyReset();
    try {
      const res = await fetch(`/api/scooters/${scooterId}/sale-report`, {
        method: "PATCH",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Nem sikerült frissíteni a megosztást.");
        // A szerver nézete lehet, hogy már eltér a kliensétől (pl. időközben
        // visszavonták vagy egy párhuzamos frissítés/konfliktus történt) -
        // ne maradjon optimista, elavult state.
        router.refresh();
        return;
      }
      setReport((r) => (r ? { ...r, publishedAt: data.publishedAt } : r));
      setSnapshotStatus("up_to_date");
      setSuccessMessage(
        data.alreadyUpToDate
          ? "A publikus állapotlap naprakész."
          : "Az állapotlap frissítve.",
      );
      router.refresh();
    } catch {
      setError("Hálózati hiba a frissítéskor.");
    } finally {
      setBusy(null);
    }
  }

  async function confirmRevoke() {
    if (busy || !report) return;
    setBusy("revoke");
    setError("");
    setSuccessMessage("");
    setCopied(false);
    clearPendingCopyReset();
    try {
      const res = await fetch(`/api/scooters/${scooterId}/sale-report`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // A jelenleg látott tokent küldjük el, hogy egy elavult
        // böngészőfül soha ne vonhassa vissza egy időközben létrejött ÚJ
        // megosztás tokenjét.
        body: JSON.stringify({ publicToken: report.publicToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Nem sikerült visszavonni a megosztást.");
        router.refresh();
        return;
      }
      setReport((r) => (r ? { ...r, isActive: false } : r));
      setSnapshotStatus("not_shared");
      setSuccessMessage("A megosztás visszavonva.");
      setRevokeConfirmOpen(false);
      router.refresh();
    } catch {
      setError("Hálózati hiba a visszavonáskor.");
    } finally {
      setBusy(null);
    }
  }

  async function copyLink() {
    if (!publicUrl) return;
    clearPendingCopyReset();
    setError("");
    setSuccessMessage("");
    setCopied(false);
    const fullUrl = `${window.location.origin}${publicUrl}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setSuccessMessage("Link másolva");
      copyResetTimeout.current = setTimeout(() => {
        setCopied(false);
        setSuccessMessage((current) =>
          current === "Link másolva" ? "" : current,
        );
        copyResetTimeout.current = null;
      }, 2000);
    } catch {
      setCopied(false);
      setError("Nem sikerült másolni a linket.");
    }
  }

  return (
    <div className="space-y-4">
      {successMessage && (
        <p role="status" aria-live="polite" className="text-primary text-sm">
          {successMessage}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!readiness.canShare ? (
        <div className="rounded-lg border border-dashed px-4 py-3">
          <p className="text-sm font-medium">
            Még nincs elég adat a megosztáshoz
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Hiányzik: {readiness.missingRequired.join(", ")}.
          </p>
        </div>
      ) : isShared ? (
        <>
          <div className="flex flex-wrap gap-2">
            {hasReadablePublishedSnapshot ? (
              <>
                <Button asChild size="sm">
                  <a
                    href={publicUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Publikus állapotlap megnyitása
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  disabled={busy !== null}
                >
                  {copied ? "Link másolva" : "Link másolása"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={busy !== null}
                >
                  {busy === "refresh" ? "Frissítés..." : "Megosztás frissítése"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleRefresh}
                disabled={busy !== null}
              >
                {busy === "refresh"
                  ? "Frissítés..."
                  : snapshotStatus === "invalid"
                    ? "Állapotlap újrapublikálása"
                    : "Állapotlap frissítése"}
              </Button>
            )}
          </div>

          {snapshotStatus === "missing" && (
            <p className="text-sm font-medium text-amber-600">
              Az állapotlapot frissíteni kell az új publikálási formátumra.
            </p>
          )}
          {snapshotStatus === "invalid" && (
            <p role="alert" className="text-sm font-medium text-red-500">
              A publikált állapotlap adatai nem olvashatók. Publikáld újra az
              állapotlapot.
            </p>
          )}
          {hasReadablePublishedSnapshot && (
            <>
              {report!.publishedAt && (
                <p className="text-muted-foreground text-xs">
                  Publikálva: {formatBudapestDateTime(report!.publishedAt)}
                </p>
              )}
              {snapshotStatus === "outdated" ? (
                <div
                  role="status"
                  className="border-primary/30 bg-primary/5 rounded-lg border px-4 py-3"
                >
                  <p className="text-sm font-medium">
                    Nem publikált módosítások vannak.
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Az előnézet újabb adatokat tartalmaz, mint a jelenlegi
                    publikus állapotlap.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-xs">
                  A publikus állapotlap naprakész.
                </p>
              )}
            </>
          )}
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleCreate}
            disabled={busy !== null}
          >
            {busy === "create" ? "Létrehozás..." : "Megosztás létrehozása"}
          </Button>
          <a
            href="#elozetes"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium transition-colors"
          >
            Előnézet megtekintése
          </a>
        </div>
      )}

      {isShared &&
        (revokeConfirmOpen ? (
          <div
            role="alert"
            className="bg-muted/40 flex flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm">Visszavonod az állapotlap megosztását?</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                A korábban elküldött link többé nem lesz elérhető.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={confirmRevoke}
                disabled={busy !== null}
              >
                {busy === "revoke"
                  ? "Visszavonás..."
                  : "Megosztás visszavonása"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRevokeConfirmOpen(false)}
                disabled={busy !== null}
              >
                Mégsem
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevokeConfirmOpen(true)}
            disabled={busy !== null}
            className="text-muted-foreground text-xs transition-colors hover:text-red-500 disabled:opacity-40"
          >
            Megosztás visszavonása
          </button>
        ))}

      {/* Készültségi checklist */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            Rögzített adatok · {readiness.levelLabel}
          </p>
          <span className="text-muted-foreground font-mono text-xs tabular-nums">
            {readiness.recommendedOkCount}/{readiness.recommended.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {readiness.recommended.map((item) =>
            item.ok ? (
              <span
                key={item.key}
                className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600"
              >
                ✓ {item.label}
              </span>
            ) : (
              <a
                key={item.key}
                href={item.fixHref}
                className="bg-muted/60 text-muted-foreground hover:text-foreground rounded-full px-2.5 py-1 text-xs transition-colors"
              >
                {item.label} →
              </a>
            ),
          )}
        </div>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">
        Egy megosztható összefoglaló a roller fontos adatairól,
        szervizelőzményeiről és jelenlegi állapotáról.
      </p>
    </div>
  );
}
