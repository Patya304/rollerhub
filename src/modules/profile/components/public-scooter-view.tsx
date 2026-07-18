import Link from "next/link";
import { ImageWithFallback } from "@/components/image-with-fallback";

// Presentational publikus roller adatlap. Csak biztonságos, propsban kapott
// adatokból dolgozik. Soha nem jelenhet meg: alvázszám, megjegyzés, vételár,
// vásárlás dátuma, becsült érték, szervizrészletek, menetnapló.
export function PublicScooterView({
  brand,
  model,
  year,
  currentMileage,
  photoUrl,
  serviceCount,
  ownerName,
  ownerUsername,
}: {
  brand: string;
  model: string;
  year: number | null;
  currentMileage: number;
  photoUrl: string | null;
  serviceCount: number;
  ownerName: string;
  ownerUsername: string;
}) {
  return (
    <>
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="flex items-start gap-4 p-5 pb-4">
          <ImageWithFallback
            src={photoUrl}
            alt={`${brand} ${model}`}
            className="h-24 w-24 shrink-0 rounded-xl object-cover"
            fallback={
              <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center rounded-xl text-4xl">
                🛴
              </div>
            }
          />
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-primary text-xs font-semibold tracking-[0.18em] break-words uppercase">
              {brand}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight break-words">
              {model}
            </h1>
            {year != null && (
              <p className="text-muted-foreground text-sm">{year}</p>
            )}
          </div>
        </div>

        <div className="border-border/50 divide-border/30 grid grid-cols-2 divide-x border-t">
          <div className="px-4 py-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Km
            </p>
            <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
              {currentMileage.toLocaleString("hu-HU")}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Szerviz
            </p>
            <p className="mt-1 font-mono text-base leading-tight font-bold tabular-nums">
              {serviceCount}
            </p>
          </div>
        </div>
      </div>

      <Link
        href={`/profile/@${ownerUsername}`}
        className="bg-card hover:bg-muted/30 flex items-center justify-between gap-3 rounded-xl border px-5 py-4 transition-colors"
      >
        <span className="min-w-0">
          <span className="text-muted-foreground block text-xs font-semibold tracking-widest uppercase">
            Tulajdonos
          </span>
          <span className="mt-0.5 block font-semibold break-words">
            {ownerName}
          </span>
        </span>
        <span className="text-muted-foreground shrink-0 text-sm">
          @{ownerUsername} →
        </span>
      </Link>

      <p className="text-muted-foreground text-xs">
        Ez egy publikus roller adatlap. A szervizrészletek, a menetnapló, a
        vételár, az értékbecslés és a megjegyzések privátak maradnak.
      </p>
    </>
  );
}
