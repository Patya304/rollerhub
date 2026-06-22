export function calculateEstimate(input: {
  purchasePrice: number;
  year: number | null;
  currentMileage: number;
}): number {
  const currentYear = new Date().getFullYear();
  const ageYears = input.year ? Math.max(0, currentYear - input.year) : 0;
  const ageDep = ageYears * 0.12; // 12% / év
  const kmDep = (input.currentMileage / 1000) * 0.01; // 1% / 1000 km
  const totalDep = Math.min(0.8, ageDep + kmDep); // max 80%
  return Math.round(input.purchasePrice * (1 - totalDep));
}
