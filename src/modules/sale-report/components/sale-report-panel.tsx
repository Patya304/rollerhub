"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SaleReportView } from "@/modules/sale-report/components/sale-report-view";
import type { Readiness } from "@/modules/sale-report/readiness";
import type { SaleReportDto } from "@/modules/sale-report/dto";

type ReportStatus = {
  isActive: boolean;
  publicToken: string;
  updatedAt: string;
} | null;

// Az összes állapotlap-dátum (tulajdonosi panel és publikus oldal is)
// explicit Europe/Budapest időzónával formázódik, hogy a szerver saját
// időzónájától és a kliens böngészőjétől függetlenül mindig ugyanazt a
// naptári napot/órát mutassa.
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
  preview,
}: {
  scooterId: string;
  readiness: Readiness;
  initialReport: ReportStatus;
  preview: SaleReportDto;
}) {
  const router = useRouter();
  const [report, setReport] = useState(initialReport);
  const [busy, setBusy] = useState<"create" | "refresh" | "revoke" | null>(
    null,
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
  const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Komponens-unmountkor takarítsuk el a függőben lévő copy-reset timeoutot,
  // hogy ne történjen késői state update egy már eltűnt komponensen.
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
  const publicUrl = isShared ? `/report/${report!.publicToken}` : null;

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
        return;
      }
      setReport({
        isActive: true,
        publicToken: data.publicToken,
        updatedAt: data.updatedAt,
      });
      setSuccessMessage("Az állapotlap megosztható.");
      setPreviewOpen(false);
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
        return;
      }
      setReport((r) => (r ? { ...r, updatedAt: data.updatedAt } : r));
      setSuccessMessage("Az állapotlap frissítve.");
      router.refresh();
    } catch {
      setError("Hálózati hiba a frissítéskor.");
    } finally {
      setBusy(null);
    }
  }

  async function confirmRevoke() {
    if (busy) return;
    setBusy("revoke");
    setError("");
    setSuccessMessage("");
    setCopied(false);
    clearPendingCopyReset();
    try {
      const res = await fetch(`/api/scooters/${scooterId}/sale-report`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Nem sikerült visszavonni a megosztást.");
        return;
      }
      setReport((r) => (r ? { ...r, isActive: false } : r));
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
        // Csak akkor töröljük a success üzenetet, ha időközben nem
        // jelent meg egy másik (pl. frissítés/visszavonás) üzenet.
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
            <Button asChild size="sm">
              <a href={publicUrl!} target="_blank" rel="noopener noreferrer">
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
          </div>
          <p className="text-muted-foreground text-xs">
            Utolsó frissítés: {formatBudapestDateTime(report!.updatedAt)}
          </p>
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen((v) => !v)}
            disabled={busy !== null}
          >
            {previewOpen ? "Előnézet elrejtése" : "Állapotlap megtekintése"}
          </Button>
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
            Rögzített adatok
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

      {previewOpen && !isShared && (
        <SaleReportView report={preview} variant="preview" />
      )}

      <p className="text-muted-foreground text-xs leading-relaxed">
        Egy megosztható összefoglaló a roller fontos adatairól,
        szervizelőzményeiről és jelenlegi állapotáról.
      </p>
    </div>
  );
}
