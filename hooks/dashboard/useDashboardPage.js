import { useMemo, useState } from "react";
import {
  buildAllProductsData,
  buildCategoryStockData,
  buildMoneyTrend,
  buildStockTrend,
  getActiveRangeLabel,
  getSortedTopProducts,
  getTrendTotals,
} from "./dashboard-data-helpers";
import { useDashboardLowStockToast } from "./useDashboardLowStockToast";
import { useDashboardLiveLowStockNotifications } from "./useDashboardLiveLowStockNotifications";
import { useDashboardRangeState } from "./useDashboardRangeState";
import { useDashboardSummaryQuery } from "./useDashboardSummaryQuery";
import { getTopMetricValue } from "../../features/dashboard/dashboard-metric-utils";

export function useDashboardPage() {
  const [topMetric, setTopMetric] = useState("qty");
  const rangeState = useDashboardRangeState();
  const queryState = useDashboardSummaryQuery(rangeState.appliedRange);

  useDashboardLowStockToast(queryState.summary, queryState.loading);
  useDashboardLiveLowStockNotifications(true);

  const totalStock = Number(queryState.summary?.totals?.totalStock || 0);
  const lowStockCount = Number(queryState.summary?.totals?.lowStockCount || 0);
  const categoryStockData = useMemo(() => buildCategoryStockData(queryState.summary), [queryState.summary]);
  const allProductsData = useMemo(() => buildAllProductsData(queryState.summary), [queryState.summary]);
  const stockTrend = useMemo(() => buildStockTrend(queryState.summary), [queryState.summary]);
  const moneyTrend = useMemo(() => buildMoneyTrend(queryState.summary), [queryState.summary]);
  const trendTotals = useMemo(() => getTrendTotals(stockTrend, moneyTrend), [moneyTrend, stockTrend]);
  const activeRangeLabel = useMemo(
    () => getActiveRangeLabel(queryState.summary, rangeState.appliedRange),
    [queryState.summary, rangeState.appliedRange],
  );

  const topProducts = useMemo(
    () => getSortedTopProducts(queryState.summary, topMetric),
    [queryState.summary, topMetric],
  );
  const featuredTopProduct = topProducts[0] || null;
  const rankedTopProducts = featuredTopProduct ? topProducts.slice(1) : topProducts;
  const topMetricMax = useMemo(
    () => rankedTopProducts.reduce((max, item) => Math.max(max, getTopMetricValue(item, topMetric)), 1),
    [rankedTopProducts, topMetric],
  );
  const lowStockPreview = useMemo(() => (queryState.summary?.lowStockProducts || []).slice(0, 3), [queryState.summary]);
  const lowStockPreviewRemainder = Math.max(lowStockCount - lowStockPreview.length, 0);
  const topProductsPreview = useMemo(() => rankedTopProducts.slice(0, 3), [rankedTopProducts]);
  const topProductsPreviewRemainder = Math.max(rankedTopProducts.length - topProductsPreview.length, 0);

  function markRangeApplying() {
    queryState.setLoading(true);
    queryState.setError("");
  }

  return {
    loading: queryState.loading,
    error: queryState.error,
    periodPreset: rangeState.periodPreset,
    selectedMonth: rangeState.selectedMonth,
    customRange: rangeState.customRange,
    topMetric,
    totalStock,
    lowStockCount,
    categoryStockData,
    allProductsData,
    stockTrend,
    moneyTrend,
    totalIncomingQty: trendTotals.totalIncomingQty,
    totalOutgoingQty: trendTotals.totalOutgoingQty,
    totalSalesAmount: trendTotals.totalSalesAmount,
    totalPurchaseAmount: trendTotals.totalPurchaseAmount,
    activeRangeLabel,
    featuredTopProduct,
    rankedTopProducts,
    topMetricMax,
    lowStockPreview,
    lowStockPreviewRemainder,
    topProductsPreview,
    topProductsPreviewRemainder,
    productStockRef: rangeState.productStockRef,
    topProductsRef: rangeState.topProductsRef,
    trendChartsRef: rangeState.trendChartsRef,
    handlePresetChange: (preset) => rangeState.handlePresetChange(preset, { onBeforeApply: markRangeApplying }),
    handleMonthChange: (value) => rangeState.handleMonthChange(value, { onBeforeApply: markRangeApplying }),
    handleCustomRangeChange: rangeState.handleCustomRangeChange,
    handleCustomRangeApply: () => rangeState.handleCustomRangeApply({ onBeforeApply: markRangeApplying }),
    setTopMetric,
    openProductsChart: rangeState.openProductsChart,
    openTopProducts: rangeState.openTopProducts,
    openTrendCharts: rangeState.openTrendCharts,
  };
}
