"use client";

import { useEffect, useState } from "react";

type Estimate = {
  id: string;
  estimatedValue: number;
  createdAt: string;
};

export function ValueHistory({ scooterId }: { scooterId: string }) {
  const [history, setHistory] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/scooters/${scooterId}/estimate`);
    if (res.ok) setHistory(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  if (loading) {
    return (
      <p className="text-muted-foreground mt-3 border-t pt-3 text-sm">
        Betöltés...
      </p>
    );
  }

  if (history.length === 0) {
    return (
      <p className="text-muted-foreground mt-3 border-t pt-3 text-sm">
        {"Még nincs becslés. Nyomd meg a „Becsült érték” gombot."}
      </p>
    );
  }

  const diff =
    history[history.length - 1].estimatedValue - history[0].estimatedValue;

  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      <p className="text-sm font-medium">Értéktörténet</p>
      <ul className="space-y-1">
        {history.map((e) => (
          <li key={e.id} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {new Date(e.createdAt).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="font-medium">
              {e.estimatedValue.toLocaleString("hu-HU")} Ft
            </span>
          </li>
        ))}
      </ul>
      {history.length > 1 && (
        <p className="text-muted-foreground text-sm">
          Változás az első becslés óta:{" "}
          <span className={diff < 0 ? "text-red-600" : "text-green-600"}>
            {diff > 0 ? "+" : ""}
            {diff.toLocaleString("hu-HU")} Ft
          </span>
        </p>
      )}
    </div>
  );
}
