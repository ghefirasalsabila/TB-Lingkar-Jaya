import { AdminPageSeo } from "../../components/common/AdminPageSeo";
import { StatusAlert } from "../../components/common/StatusAlert";
import { ReportsDataTable } from "../../components/reports/ReportsDataTable";
import { ReportsFilterCard } from "../../components/reports/ReportsFilterCard";
import { ReportsSummaryCards } from "../../components/reports/ReportsSummaryCards";
import { useReportsPage } from "../../hooks/reports/useReportsPage";

export function ReportsPage() {
  const pageState = useReportsPage();

  return (
    <div className="space-y-6">
      <AdminPageSeo title="Laporan" description="Pilih periode, lihat ringkasan, lalu unduh PDF." path="/admin/reports" />

      <ReportsFilterCard
        range={pageState.range}
        reportType={pageState.draftReportType}
        activeRangeLabel={pageState.activeRangeLabel}
        loading={pageState.loading}
        downloading={pageState.downloading}
        onRangeChange={pageState.handleRangeChange}
        onReportTypeChange={pageState.handleReportTypeChange}
        onSubmit={pageState.handleSubmit}
        onDownloadPdf={pageState.handleDownloadPdf}
      />

      <StatusAlert message={pageState.error} tone="destructive" />

      {pageState.reportType === "summary" ? (
        <ReportsSummaryCards loading={pageState.loading} cards={pageState.summaryCards} />
      ) : null}

      {pageState.reportType === "summary" ? (
        null
      ) : (
        <ReportsDataTable
          reportType={pageState.reportType}
          range={pageState.query}
          loading={pageState.loading}
          items={pageState.reportItems}
          reportMeta={pageState.reportMeta}
          page={pageState.page}
          onPageChange={pageState.setPage}
        />
      )}
    </div>
  );
}
