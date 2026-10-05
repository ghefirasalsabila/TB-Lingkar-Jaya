import { useReportDataState } from "./useReportDataState";
import { useReportQueryState } from "./useReportQueryState";

export function useReportsPage() {
  const queryState = useReportQueryState();
  const dataState = useReportDataState({
    reportType: queryState.reportType,
    query: queryState.query,
    page: queryState.page,
  });

  return {
    range: queryState.range,
    query: queryState.query,
    reportType: queryState.reportType,
    draftReportType: queryState.draftReportType,
    page: queryState.page,
    reportMeta: dataState.reportMeta,
    loading: dataState.loading,
    downloading: dataState.downloading,
    error: dataState.error,
    reportTypeLabel: queryState.reportTypeLabel,
    selectedDayCount: queryState.selectedDayCount,
    activeRangeLabel: queryState.activeRangeLabel,
    summaryCards: dataState.summaryCards,
    reportItems: dataState.reportItems,
    handleRangeChange: queryState.handleRangeChange,
    handleReportTypeChange: queryState.handleReportTypeChange,
    handleSubmit: queryState.handleSubmit,
    setPage: queryState.setPage,
    handleDownloadPdf: dataState.handleDownloadPdf,
  };
}
