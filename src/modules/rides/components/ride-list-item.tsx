import { type ReactNode } from "react";

// Presentational menet-listaelem, csak propsból dolgozik.
export function RideListItem({
  scooterName,
  startAt,
  endAt,
  distanceKm,
  avgSpeed,
  maxSpeed,
  action,
}: {
  scooterName: string;
  startAt: string;
  endAt: string | null;
  distanceKm: number | null;
  avgSpeed: number | null;
  maxSpeed: number | null;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4 text-sm">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{scooterName}</p>
        <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
          {new Date(startAt).toLocaleString("hu-HU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {endAt
            ? ` – ${new Date(endAt).toLocaleTimeString("hu-HU", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : ""}
        </p>
        {(distanceKm != null || avgSpeed != null || maxSpeed != null) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {distanceKm != null && (
              <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                {distanceKm.toLocaleString("hu-HU")} km
              </span>
            )}
            {avgSpeed != null && (
              <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                átl. {avgSpeed} km/h
              </span>
            )}
            {maxSpeed != null && (
              <span className="bg-muted/40 rounded px-2 py-0.5 font-mono text-xs tabular-nums">
                max {maxSpeed} km/h
              </span>
            )}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
