import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AppPage, AppPageHeader, AppSection } from "@/components/app-page";
import { getOwnerSaleReportState } from "@/modules/sale-report/services/sale-report-service";
import { getOwnerCondition } from "@/modules/sale-report/services/condition-service";
import { SaleReportPanel } from "@/modules/sale-report/components/sale-report-panel";
import { ConditionForm } from "@/modules/sale-report/components/condition-form";
import { SaleReportView } from "@/modules/sale-report/components/sale-report-view";

export default async function SaleReportWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { id } = await params;
  const state = await getOwnerSaleReportState(session.user.id, id);
  if (state.status === "not_found") notFound();

  const condition = await getOwnerCondition(session.user.id, id);

  return (
    <AppPage>
      <div className="flex items-center gap-2">
        <Link
          href={`/garage/${id}`}
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          ← {state.preview.brand} {state.preview.model}
        </Link>
      </div>

      <AppPageHeader
        title="Eladási állapotlap"
        description="Állítsd össze és publikáld azt az összefoglalót, amelyet a vevő látni fog."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <AppSection label="Megosztás">
            <SaleReportPanel
              scooterId={id}
              readiness={state.readiness}
              initialReport={
                state.report
                  ? {
                      isActive: state.report.isActive,
                      publicToken: state.report.publicToken,
                      publishedAt: state.report.publishedAt
                        ? state.report.publishedAt.toISOString()
                        : null,
                    }
                  : null
              }
              initialSnapshotStatus={state.snapshotStatus}
            />
          </AppSection>

          <AppSection label="Állapotfelmérés" id="allapotfelmeres">
            <ConditionForm scooterId={id} initialCondition={condition} />
          </AppSection>
        </div>

        <div className="space-y-4">
          <AppSection
            label="Előnézet – ezt fogja látni a vevő a következő publikálás után"
            id="elozetes"
          >
            <SaleReportView report={state.preview} variant="preview" />
          </AppSection>
        </div>
      </div>
    </AppPage>
  );
}
