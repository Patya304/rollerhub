"use client";

import { useState } from "react";

/**
 * Kép megjelenítés broken-image védelemmel: hibás vagy betölthetetlen URL-nél
 * a fallback jelenik meg helyette broken-image ikon helyett.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallback,
  onLoadError,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
  /** Opcionális callback, ha a kép nem töltődik be (pl. nem blokkoló figyelmeztetéshez). */
  onLoadError?: () => void;
}) {
  const [broken, setBroken] = useState(false);
  const [lastSrc, setLastSrc] = useState(src);

  // Új src-nél a korábbi broken állapot ne ragadjon be (render közbeni
  // állapotszinkronizálás, nem effect, hogy elkerüljük a felesleges renderelést).
  if (src !== lastSrc) {
    setLastSrc(src);
    setBroken(false);
  }

  if (!src || broken) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        setBroken(true);
        onLoadError?.();
      }}
    />
  );
}
