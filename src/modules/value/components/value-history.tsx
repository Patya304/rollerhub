type Estimate = {
  id: string;
  estimatedValue: number;
  createdAt: Date;
};

export function ValueHistory({ history }: { history: Estimate[] }) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-10 text-center">
        <p className="text-3xl">📈</p>
        <p className="mt-3 font-semibold">Nincs értéktörténet</p>
        <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm leading-relaxed">
          Indíts értékbecslést a roller adatlapján. A korábbi becslések itt
          jelennek meg.
        </p>
      </div>
    );
  }

  const diff =
    history[history.length - 1].estimatedValue - history[0].estimatedValue;

  // A history időrendben (legrégebbi elöl) érkezik, megjelenítéskor a
  // legfrissebb becslés kerül felülre.
  const items = [...history].reverse();

  return (
    <div className="space-y-4">
      {/* Trend összegzés */}
      {history.length > 1 && (
        <div className="bg-muted/40 flex items-center justify-between gap-3 rounded-lg px-4 py-3">
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Változás az első becslés óta
          </p>
          <p
            className={`font-mono text-sm font-bold tabular-nums ${
              diff < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {diff > 0 ? "+" : ""}
            {diff.toLocaleString("hu-HU")} Ft
          </p>
        </div>
      )}

      {/* Sorok */}
      <div className="divide-border/30 divide-y">
        {items.map((e, idx) => {
          const prev = idx < items.length - 1 ? items[idx + 1] : null;
          const change = prev ? e.estimatedValue - prev.estimatedValue : null;
          return (
            <div
              key={e.id}
              className="flex items-center justify-between gap-3 py-3 text-sm"
            >
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">
                  {new Date(e.createdAt).toLocaleDateString("hu-HU", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {change != null && (
                  <p
                    className={`mt-0.5 font-mono text-xs tabular-nums ${
                      change < 0 ? "text-red-500/80" : "text-green-500/80"
                    }`}
                  >
                    {change > 0 ? "+" : ""}
                    {change.toLocaleString("hu-HU")} Ft
                  </p>
                )}
              </div>
              <p className="font-mono font-semibold tabular-nums">
                {e.estimatedValue.toLocaleString("hu-HU")} Ft
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
