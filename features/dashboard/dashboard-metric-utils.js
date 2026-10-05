import { formatCompactNumber, formatCurrency, formatNumber } from "../../lib/formatters";
import { DASHBOARD_HEALTH_STYLES } from "../../features/dashboard/constants";

export function formatCompactCurrency(value) {
  const amount = Number(value || 0);

  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1).replace(".0", "")} M`;
  }

  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1).replace(".0", "")} jt`;
  }

  if (amount >= 1000) {
    return `Rp ${formatCompactNumber(amount).replace(" ", " ")}`;
  }

  return formatCurrency(amount);
}

export function getStockHealthMeta(health) {
  return DASHBOARD_HEALTH_STYLES[health] || DASHBOARD_HEALTH_STYLES.safe;
}

export function getTopMetricValue(item, metric) {
  return metric === "revenue" ? Number(item?.revenue || 0) : Number(item?.qty || 0);
}

export function formatTopMetricValue(item, metric) {
  if (metric === "revenue") {
    return formatCompactCurrency(item?.revenue || 0);
  }

  return `${formatNumber(item?.qty || 0)} ${item?.unit || "unit"}`;
}

export function getTopMetricSecondaryText(item, metric) {
  if (metric === "revenue") {
    return `${formatNumber(item?.qty || 0)} ${item?.unit || "unit"} terjual`;
  }

  return `Omzet ${formatCurrency(item?.revenue || 0)}`;
}
