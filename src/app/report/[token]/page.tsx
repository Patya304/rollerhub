import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicSaleReportByToken } from "@/modules/sale-report/services/public-sale-report-service";
import { SaleReportView } from "@/modules/sale-report/components/sale-report-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const report = await getPublicSaleReportByToken(token);
  if (!report) {
    return { title: "Ez az állapotlap nem található – RollerHub" };
  }
  return {
    title: `${report.brand} ${report.model} – Eladási állapotlap – RollerHub`,
    description: `Eladási állapotlap: ${report.brand} ${report.model}, ${report.currentMileage.toLocaleString("hu-HU")} km.`,
  };
}

export default async function PublicSaleReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const report = await getPublicSaleReportByToken(token);
  if (!report) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 px-4 py-10">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        ← RollerHub
      </Link>
      <SaleReportView report={report} variant="public" />
    </main>
  );
}
