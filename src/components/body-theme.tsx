"use client";

import { useEffect } from "react";

// A téma CSS-változói [data-theme] szelektorból jönnek. A body-ra is
// feltesszük, hogy a portálba renderelt elemek (pl. mobil menü Sheet-je)
// is a beállított témát kapják, ne a témátlan alapértelmezést.
export function BodyTheme({ theme }: { theme: string }) {
  useEffect(() => {
    document.body.dataset.theme = theme;
    return () => {
      delete document.body.dataset.theme;
    };
  }, [theme]);
  return null;
}
