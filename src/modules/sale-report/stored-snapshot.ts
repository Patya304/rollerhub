import { saleReportSnapshotSchema } from "@/modules/sale-report/snapshot-schema";
import {
  hashSnapshot,
  type SaleReportSnapshot,
} from "@/modules/sale-report/snapshot";

// Egységes, szerveroldali ellenőrzés arra, hogy egy ADATBÁZISBAN TÁROLT
// SaleReport sor snapshotja ténylegesen publikálható-e. Ugyanezt a
// logikát használja a publikus service (mit mutasson a vevőnek) és a
// tulajdonosi state (milyen üzenetet mutasson) is - így a két oldal
// sosem térhet el egymástól abban, hogy mi számít "valid" snapshotnak.
export type StoredSnapshotState =
  | { status: "missing" }
  | { status: "invalid" }
  | { status: "valid"; snapshot: SaleReportSnapshot; hash: string };

type StoredReportShape = {
  snapshot: unknown;
  snapshotHash: string | null;
  snapshotVersion: number;
  publishedAt: Date | null;
};

export function evaluateStoredSnapshot(
  report: StoredReportShape,
): StoredSnapshotState {
  if (report.snapshot == null) return { status: "missing" };
  if (report.snapshotVersion !== 1) return { status: "invalid" };
  if (report.publishedAt == null) return { status: "invalid" };
  if (!report.snapshotHash) return { status: "invalid" };

  const parsed = saleReportSnapshotSchema.safeParse(report.snapshot);
  if (!parsed.success) return { status: "invalid" };

  const actualHash = hashSnapshot(parsed.data);
  if (actualHash !== report.snapshotHash) return { status: "invalid" };

  return { status: "valid", snapshot: parsed.data, hash: actualHash };
}
