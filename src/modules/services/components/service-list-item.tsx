// Presentational szerviz-listaelem: a valódi Szervizkönyv oldal és az
// előnézet is ezt használja. Csak propsból dolgozik, nincs auth/Prisma/fetch.
export function ServiceListItem({
  title,
  scooterName,
  performedAt,
  odometerKm,
  cost,
  notes,
}: {
  title: string;
  scooterName: string;
  performedAt: string;
  odometerKm: number | null;
  cost: number | null;
  notes: string | null;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4 text-sm">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{scooterName}</p>
        {notes && (
          <p className="text-muted-foreground mt-1.5 text-xs leading-snug">
            {notes}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-muted-foreground font-mono text-xs tabular-nums">
          {new Date(performedAt).toLocaleDateString("hu-HU")}
        </p>
        {odometerKm != null && (
          <p className="text-muted-foreground font-mono text-xs tabular-nums">
            {odometerKm.toLocaleString("hu-HU")} km
          </p>
        )}
        {cost != null && (
          <p className="mt-0.5 font-mono text-xs font-semibold tabular-nums">
            {cost.toLocaleString("hu-HU")} Ft
          </p>
        )}
      </div>
    </div>
  );
}
