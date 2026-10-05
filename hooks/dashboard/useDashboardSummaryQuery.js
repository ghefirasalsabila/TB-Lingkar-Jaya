import { useCallback } from "react";
import { getDashboardSummary } from "../../lib/api/dashboard";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

export function useDashboardSummaryQuery(appliedRange) {
  const loadSummary = useCallback(
    () => getDashboardSummary({
      from: appliedRange.from,
      to: appliedRange.to,
      allTime: appliedRange.allTime,
    }),
    [appliedRange.allTime, appliedRange.from, appliedRange.to],
  );
  const summaryState = useAsyncValueEffect({
    initialValue: null,
    fallbackValue: null,
    load: loadSummary,
    errorMessage: "Gagal memuat data dasbor",
  });

  return {
    summary: summaryState.value,
    loading: summaryState.loading,
    error: summaryState.error,
    setLoading: summaryState.setLoading,
    setError: summaryState.setError,
  };
}
