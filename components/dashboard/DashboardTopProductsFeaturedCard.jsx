import { Badge } from "../ui/badge";
import { cn } from "../../lib/classnames";
import {
  DASHBOARD_FEATURED_BADGE_CLASS,
  DASHBOARD_FEATURED_CARD_CLASS,
} from "../../features/dashboard/constants";
import { formatCompactCurrency, getStockHealthMeta } from "../../features/dashboard/dashboard-metric-utils";
import { formatNumber } from "../../lib/formatters";

export function DashboardTopProductsFeaturedCard({ featuredTopProduct }) {
  const featuredHealthMeta = getStockHealthMeta(featuredTopProduct.health);

  return (
    <div className={DASHBOARD_FEATURED_CARD_CLASS}>
      <div className="flex items-start justify-between gap-3">
        <Badge className={DASHBOARD_FEATURED_BADGE_CLASS}>
          Peringkat #1
        </Badge>
        <Badge variant="outline" className={cn("rounded-full", featuredHealthMeta.badgeClassName)}>
          Stok {featuredHealthMeta.label}
        </Badge>
      </div>
      <div className="mt-4 space-y-1.5">
        <p className="text-2xl font-semibold leading-tight">{featuredTopProduct.productName}</p>
        <p className="text-sm text-muted-foreground">{featuredTopProduct.productSku}</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <div className="rounded-xl border bg-muted/15 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Qty Terjual</p>
          <p className="mt-2 text-xl font-semibold">
            {formatNumber(featuredTopProduct.qty || 0)} {featuredTopProduct.unit}
          </p>
        </div>
        <div className="rounded-xl border bg-muted/15 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Omzet</p>
          <p className="mt-2 text-xl font-semibold">{formatCompactCurrency(featuredTopProduct.revenue)}</p>
        </div>
        <div className="rounded-xl border bg-muted/15 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Stok Saat Ini</p>
          <p className="mt-2 text-xl font-semibold">
            {formatNumber(featuredTopProduct.stock || 0)} {featuredTopProduct.unit}
          </p>
        </div>
      </div>
    </div>
  );
}
