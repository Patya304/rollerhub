import Link from "next/link";
import { ImageWithFallback } from "@/components/image-with-fallback";

export type GarageVehicleListItemProps = {
  marker?: string;
  title: string;
  meta?: string;
  href?: string;
  disabled?: boolean;
  disabledLabel?: string;
  photoUrl?: string | null;
};

export function GarageVehicleListItem({
  marker,
  title,
  meta,
  href,
  disabled = false,
  disabledLabel,
  photoUrl,
}: GarageVehicleListItemProps) {
  const inner = (
    <>
      {/* Fotó vagy marker */}
      {photoUrl ? (
        <ImageWithFallback
          src={photoUrl}
          alt={title}
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
          fallback={
            <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl">
              🛴
            </div>
          }
        />
      ) : marker ? (
        <span className="text-muted-foreground/50 flex w-8 shrink-0 items-start justify-center pt-0.5 font-mono text-xs font-semibold tabular-nums">
          {marker}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="font-semibold break-words">{title}</p>
        {meta && (
          <p className="text-muted-foreground mt-0.5 font-mono text-xs break-words tabular-nums">
            {meta}
          </p>
        )}
      </div>

      {disabled ? (
        disabledLabel && (
          <span className="text-muted-foreground shrink-0 text-xs">
            {disabledLabel}
          </span>
        )
      ) : (
        <span className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors">
          →
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className="hover:bg-muted/30 group flex items-center gap-4 px-5 py-4 transition-colors"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 ${disabled ? "opacity-60" : ""}`}
    >
      {inner}
    </div>
  );
}
