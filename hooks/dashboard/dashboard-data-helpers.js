import { CATEGORY_COLORS, HEALTH_COLORS } from "../../features/dashboard/constants";
import { formatDateLabel, formatRangeLabel } from "../../features/dashboard/dashboard-range-utils";
import { getTopMetricValue } from "../../features/dashboard/dashboard-metric-utils";

export function buildCategoryStockData(summary) {
  return (summary?.chartData?.categoryStock || []).map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));
}

export function buildAllProductsData(summary) {
  return (summary?.chartData?.allProducts || []).map((item) => ({
    ...item,
    fill: HEALTH_COLORS[item.health] || HEALTH_COLORS.safe,
  }));
}

export function buildStockTrend(summary) {
  return (summary?.chartData?.stockTrend || []).map((item) => ({
    ...item,
    label: item.label || formatDateLabel(item.date),
  }));
}

export function buildMoneyTrend(summary) {
  return (summary?.chartData?.moneyTrend || []).map((item) => ({
    ...item,
    label: item.label || formatDateLabel(item.date),
  }));
}

export function getTrendTotals(stockTrend, moneyTrend) {
  return {
    totalIncomingQty: stockTrend.reduce((sum, item) => sum + item.incomingQty, 0),
    totalOutgoingQty: stockTrend.reduce((sum, item) => sum + item.outgoingQty, 0),
    totalSalesAmount: moneyTrend.reduce((sum, item) => sum + item.salesAmount, 0),
    totalPurchaseAmount: moneyTrend.reduce((sum, item) => sum + item.purchaseAmount, 0),
  };
}

export function getActiveRangeLabel(summary, appliedRange) {
  const activeRange = summary?.period || appliedRange;
  return formatRangeLabel(activeRange.from, activeRange.to);
}

export function getSortedTopProducts(summary, topMetric) {
  const items = summary?.topProducts || [];

  return [...items].sort((left, right) => {
    const primary = getTopMetricValue(right, topMetric) - getTopMetricValue(left, topMetric);
    if (primary !== 0) {
      return primary;
    }

    return Number(right.revenue || 0) - Number(left.revenue || 0);
  });
}
