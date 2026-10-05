import { ArrowDownToLine, ArrowUpFromLine, Package, TrendingUp } from "lucide-react";
import { cn } from "../../lib/classnames";
import { DashboardIconSurface } from "./DashboardIconSurface";
import { DASHBOARD_ICON_TONES, DASHBOARD_TEXT_TONES } from "../../features/dashboard/constants";
import { OverviewMetricCard } from "./OverviewMetricCard";
import { formatCompactCurrency } from "../../features/dashboard/dashboard-metric-utils";
import { formatNumber } from "../../lib/formatters";

export function DashboardOverviewMetricsGrid({
  loading,
  totalStock,
  totalIncomingQty,
  totalOutgoingQty,
  totalSalesAmount,
  totalPurchaseAmount,
  onOpenProductsChart,
  onOpenTrendCharts,
}) {
  return (
    <>
      <OverviewMetricCard
        title="Total Stok"
        loading={loading}
        onClick={onOpenProductsChart}
        icon={(
          <DashboardIconSurface className={DASHBOARD_ICON_TONES.stock}>
            <Package className="h-4 w-4" />
          </DashboardIconSurface>
        )}
      >
        <p className="text-xl font-semibold leading-none">{formatNumber(totalStock)}</p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Masuk: <span className={cn("font-medium", DASHBOARD_TEXT_TONES.incoming)}>{formatNumber(totalIncomingQty)}</span>
          <span className="mx-1.5 opacity-50">·</span>
          Keluar: <span className={cn("font-medium", DASHBOARD_TEXT_TONES.outgoing)}>{formatNumber(totalOutgoingQty)}</span>
        </p>
      </OverviewMetricCard>

      <OverviewMetricCard
        title="Omzet Penjualan"
        loading={loading}
        onClick={onOpenTrendCharts}
        icon={(
          <DashboardIconSurface className={DASHBOARD_ICON_TONES.revenue}>
            <TrendingUp className="h-4 w-4" />
          </DashboardIconSurface>
        )}
      >
        <p className={cn("text-xl font-semibold leading-none", DASHBOARD_TEXT_TONES.sales)}>{formatCompactCurrency(totalSalesAmount)}</p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Beli: <span className={cn("font-medium", DASHBOARD_TEXT_TONES.purchases)}>{formatCompactCurrency(totalPurchaseAmount)}</span>
        </p>
      </OverviewMetricCard>
    </>
  );
}
