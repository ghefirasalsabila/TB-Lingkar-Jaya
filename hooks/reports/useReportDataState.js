import { useCallback, useEffect, useMemo, useState } from "react";
import { REPORTS_DEFAULT_LIMIT, REPORTS_DEFAULT_PAGE } from "../../features/reports/report-utils";
import { getApiErrorMessage } from "../../lib/api-error";
import { scheduleDeferredTask } from "../../lib/browser-timing";
import { useLatestRequestGate } from "../shared/useLatestRequestGate";
import { runSubmitAction } from "../shared/submit-action";
import {
  buildReportCards,
  downloadReportFile,
  fetchReportData,
} from "./report-page-utils";

export function useReportDataState({ reportType, query, page }) {
  const [report, setReport] = useState(null);
  const [reportMeta, setReportMeta] = useState({
    page: REPORTS_DEFAULT_PAGE,
    limit: REPORTS_DEFAULT_LIMIT,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const { beginRequest, isLatestRequest } = useLatestRequestGate();

  const summaryCards = useMemo(
    () => buildReportCards(reportType, report),
    [report, reportType],
  );

  const loadReport = useCallback(async ({
    nextType = reportType,
    nextQuery = query,
    nextPage = page,
  } = {}) => {
    const requestId = beginRequest();
    setLoading(true);
    setError("");

    try {
      const result = await fetchReportData(nextType, nextQuery, nextPage, REPORTS_DEFAULT_LIMIT);

      if (!isLatestRequest(requestId)) {
        return;
      }

      if (nextType === "summary") {
        setReport(result?.data || null);
        setReportMeta({
          page: REPORTS_DEFAULT_PAGE,
          limit: REPORTS_DEFAULT_LIMIT,
          totalItems: 0,
        });
        return;
      }

      const items = Array.isArray(result?.data) ? result.data : [];
      setReport({
        items,
        totals: result?.totals || null,
        range: result?.range || null,
      });
      setReportMeta(
        result?.meta || {
          page: nextPage,
          limit: REPORTS_DEFAULT_LIMIT,
          totalItems: items.length,
        },
      );
    } catch (requestError) {
      if (!isLatestRequest(requestId)) {
        return;
      }

      const responseData = requestError?.response?.data;
      const isValidationError = responseData?.message === "Validation error" || responseData?.message === "Validasi gagal";
      const fieldErrors = responseData?.details?.fieldErrors;
      const hasRangeValidationError = isValidationError && (
        (Array.isArray(fieldErrors?.from) && fieldErrors.from.length > 0) ||
        (Array.isArray(fieldErrors?.to) && fieldErrors.to.length > 0)
      );

      if (hasRangeValidationError) {
        setError("");
        return;
      }

      setError(getApiErrorMessage(requestError, "Gagal memuat laporan"));
    } finally {
      if (isLatestRequest(requestId)) {
        setLoading(false);
      }
    }
  }, [beginRequest, isLatestRequest, page, query, reportType]);

  useEffect(() => {
    return scheduleDeferredTask(loadReport);
  }, [loadReport]);

  async function handleSubmit(event) {
    event.preventDefault();
    await loadReport();
  }

  async function handleDownloadPdf() {
    await runSubmitAction({
      setRunning: setDownloading,
      beforeSubmit: () => {
        setError("");
      },
      onSubmit: async () => {
        await downloadReportFile(query, reportType);
      },
      onError: () => {
        // Error download sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  return {
    reportMeta,
    loading,
    downloading,
    error,
    summaryCards,
    reportItems: report?.items || [],
    handleSubmit,
    handleDownloadPdf,
  };
}
