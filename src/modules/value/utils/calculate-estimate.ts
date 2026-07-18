export function calculateEstimate(input: {
  purchasePrice: number;
  year: number | null;
  currentMileage: number;
  purchaseDate?: Date | string | null;
}): number {
  if (!Number.isFinite(input.purchasePrice) || input.purchasePrice <= 0) {
    return 0;
  }

  const now = new Date();

  // Kor meghatározása: ha van vásárlási dátum, abból (pontosabb);
  // különben az évjáratból; ha egyik sincs, 0. Jövőbeli vásárlási dátum
  // (pl. óraeltolódás) sem eredményezhet negatív kort.
  let ageYears = 0;
  if (input.purchaseDate) {
    const pd = new Date(input.purchaseDate);
    if (!Number.isNaN(pd.getTime())) {
      const ms = now.getTime() - pd.getTime();
      ageYears = Math.max(0, ms / (365.25 * 24 * 60 * 60 * 1000));
    }
  } else if (input.year && Number.isFinite(input.year)) {
    ageYears = Math.max(0, now.getFullYear() - input.year);
  }

  const safeMileage =
    Number.isFinite(input.currentMileage) && input.currentMileage > 0
      ? input.currentMileage
      : 0;

  const ageDep = ageYears * 0.12; // 12% / év
  const kmDep = (safeMileage / 1000) * 0.01; // 1% / 1000 km
  const totalDep = Math.min(0.8, ageDep + kmDep); // max 80%
  const result = Math.round(input.purchasePrice * (1 - totalDep));
  return Number.isFinite(result) ? Math.max(0, result) : 0;
}
