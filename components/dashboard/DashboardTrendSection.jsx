import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "../../lib/classnames";
import { formatCurrency } from "../../lib/formatters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ChartSkeleton } from "./DashboardSkeletons";
import {
  DASHBOARD_TEXT_TONES,
  DASHBOARD_TREND_SERIES_COLORS,
} from "../../features/dashboard/constants";
import { formatNumber } from "../../lib/formatters";

function formatCurrencyAxisTick(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}jt`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}rb`;
  }

  return value;
}

function DashboardTrendCard({
  loading,
  title,
  activeRangeLabel,
  summaryContent,
  data,
  lines,
  tooltipFormatter,
  legendFormatter,
  yAxisTickFormatter,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">Periode {activeRangeLabel}</CardDescription>
            {loading ? <Skeleton className="mt-2 h-4 w-40" /> : summaryContent}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ChartSkeleton height={280} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={yAxisTickFormatter} />
              <RechartsTooltip
                contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                formatter={tooltipFormatter}
              />
              {lines.map((line) => (
                <Line
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.dataKey}
                  stroke={line.stroke}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
              <Legend formatter={legendFormatter} iconType="line" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardTrendSection({
  loading,
  activeRangeLabel,
  stockTrend,
  moneyTrend,
  totalIncomingQty,
  totalOutgoingQty,
  totalSalesAmount,
  totalPurchaseAmount,
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <DashboardTrendCard
        loading={loading}
        title="Barang Masuk / Keluar"
        activeRangeLabel={activeRangeLabel}
        data={stockTrend}
        summaryContent={(
          <div className="mt-2 flex items-center gap-5 text-sm">
            <span className={cn("font-semibold", DASHBOARD_TEXT_TONES.incoming)}>
              {formatNumber(totalIncomingQty)} <span className="font-normal text-muted-foreground">masuk</span>
            </span>
            <span className={cn("font-semibold", DASHBOARD_TEXT_TONES.outgoing)}>
              {formatNumber(totalOutgoingQty)} <span className="font-normal text-muted-foreground">keluar</span>
            </span>
          </div>
        )}
        tooltipFormatter={(value, name) => [
          `${formatNumber(value)} unit`,
          name === "incomingQty" ? "Barang Masuk" : "Barang Keluar",
        ]}
        legendFormatter={(value) => (value === "incomingQty" ? "Barang Masuk" : "Barang Keluar")}
        lines={[
          { dataKey: "incomingQty", stroke: DASHBOARD_TREND_SERIES_COLORS.incomingQty },
          { dataKey: "outgoingQty", stroke: DASHBOARD_TREND_SERIES_COLORS.outgoingQty },
        ]}
      />

      <DashboardTrendCard
        loading={loading}
        title="Uang Masuk / Keluar"
        activeRangeLabel={activeRangeLabel}
        data={moneyTrend}
        summaryContent={(
          <div className="mt-2 flex items-center gap-5 text-sm">
            <span className={cn("font-semibold", DASHBOARD_TEXT_TONES.sales)}>
              {formatCurrency(totalSalesAmount)} <span className="font-normal text-muted-foreground">masuk</span>
            </span>
            <span className={cn("font-semibold", DASHBOARD_TEXT_TONES.purchases)}>
              {formatCurrency(totalPurchaseAmount)} <span className="font-normal text-muted-foreground">keluar</span>
            </span>
          </div>
        )}
        tooltipFormatter={(value, name) => [
          formatCurrency(value),
          name === "salesAmount" ? "Penjualan" : "Pembelian",
        ]}
        legendFormatter={(value) => (value === "salesAmount" ? "Penjualan" : "Pembelian")}
        yAxisTickFormatter={formatCurrencyAxisTick}
        lines={[
          { dataKey: "salesAmount", stroke: DASHBOARD_TREND_SERIES_COLORS.salesAmount },
          { dataKey: "purchaseAmount", stroke: DASHBOARD_TREND_SERIES_COLORS.purchaseAmount },
        ]}
      />
    </div>
  );
}
