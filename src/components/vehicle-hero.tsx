import Link from "next/link";

export type VehicleHeroProps = {
  brand: string;
  model: string;
  year?: number | null;
  currentMileage?: number | null;
  serviceCount?: number;
  rideCount?: number;
  estimatedValue?: number | null;
  photoUrl?: string | null;
  backHref?: string;
  backLabel?: string;
};

export function VehicleHero({
  brand,
  model,
  year,
  currentMileage,
  serviceCount,
  rideCount,
  estimatedValue,
  photoUrl,
  backHref,
  backLabel = "Garázs",
}: VehicleHeroProps) {
  return (
    <>
      {backHref && (
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        >
          ← {backLabel}
        </Link>
      )}

      <div className="bg-card overflow-hidden rounded-xl border">
        {/* Azonosítás + fotó */}
        <div className="flex items-start gap-4 p-5 pb-4">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={`${brand} ${model}`}
              className="h-24 w-24 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center rounded-xl text-4xl">
              🛴
            </div>
          )}
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
              {brand}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight">
              {model}
            </h1>
            {year != null && (
              <p className="text-muted-foreground text-sm">{year}</p>
            )}
          </div>
        </div>

        {/* Stat sor */}
        <div className="border-border/50 divide-border/30 grid grid-cols-3 divide-x border-t">
          <div className="px-4 py-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Km
            </p>
            <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
              {currentMileage != null
                ? currentMileage.toLocaleString("hu-HU")
                : "–"}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Szerviz
            </p>
            <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
              {serviceCount ?? "–"}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Menetek
            </p>
            <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
              {rideCount ?? "–"}
            </p>
          </div>
        </div>

        {/* Becsült érték badge */}
        {estimatedValue != null && (
          <div className="border-border/50 border-t px-5 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-muted-foreground text-xs">Becsült érték</p>
              <p className="border-primary/30 bg-primary/10 text-primary rounded-lg px-3 py-1 font-mono text-sm font-bold tabular-nums">
                ~{estimatedValue.toLocaleString("hu-HU")} Ft
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
