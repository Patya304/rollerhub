// Kliensoldali ellenőrzés: a formailag helyes kép URL ténylegesen betölthető-e,
// mielőtt elmentenénk. Nem médiarendszer, csak egy célzott, egyszeri ellenőrzés.
const DEFAULT_TIMEOUT_MS = 6000;

export function verifyImageLoads(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      img.onload = null;
      img.onerror = null;
      resolve(ok);
    };

    const timer = setTimeout(() => finish(false), timeoutMs);

    img.onload = () => {
      clearTimeout(timer);
      finish(true);
    };
    img.onerror = () => {
      clearTimeout(timer);
      finish(false);
    };
    img.referrerPolicy = "no-referrer";
    img.src = url;
  });
}
