import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/classnames";
import {
  DASHBOARD_PROGRESS_TRACK_CLASS,
  TOP_PRODUCTS_BATCH_SIZE,
  TOP_PRODUCT_RANK_THEMES,
} from "../../features/dashboard/constants";
import { formatTopMetricValue, getStockHealthMeta, getTopMetricSecondaryText, getTopMetricValue } from "../../features/dashboard/dashboard-metric-utils";
import { formatNumber } from "../../lib/formatters";

export function DashboardTopProductsScrollableList({ products, topMetric, topMetricMax }) {
  const [visibleCount, setVisibleCount] = useState(TOP_PRODUCTS_BATCH_SIZE);
  const listRef = useRef(null);
  const sentinelRef = useRef(null);

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);
  const hasMoreProducts = visibleCount < products.length;

  useEffect(() => {
    const root = listRef.current;
    const sentinel = sentinelRef.current;

    if (!root || !sentinel || !hasMoreProducts) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setVisibleCount((current) => Math.min(current + TOP_PRODUCTS_BATCH_SIZE, products.length));
      },
      {
        root,
        rootMargin: "0px 0px 160px 0px",
        threshold: 0.05,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMoreProducts, products.length]);

  return (
    <div ref={listRef} className="max-h-[38rem] overflow-y-auto pr-1">
      <div className="space-y-3">
        {visibleProducts.map((item, index) => {
          const displayRank = index + 2;
          const metricValue = getTopMetricValue(item, topMetric);
          const widthPercent = Math.max(10, (metricValue / topMetricMax) * 100);
          const healthMeta = getStockHealthMeta(item.health);
          const rankTheme = TOP_PRODUCT_RANK_THEMES[displayRank - 1] || TOP_PRODUCT_RANK_THEMES[TOP_PRODUCT_RANK_THEMES.length - 1];

          return (
            <div key={item.productId} className="rounded-xl border bg-background px-4 py-4 transition-colors hover:bg-muted/15">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                <div className="flex min-w-0 items-start gap-3 lg:w-[34%]">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold", rankTheme.badgeClassName)}>
                    {displayRank}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold sm:text-base">{item.productName}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.productSku}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className={cn("h-2 overflow-hidden rounded-full", DASHBOARD_PROGRESS_TRACK_CLASS)}>
                    <div className={cn("h-full rounded-full", rankTheme.barClassName)} style={{ width: `${widthPercent}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground">{getTopMetricSecondaryText(item, topMetric)}</div>
                </div>

                <div className="flex items-center justify-between gap-3 lg:w-[205px] lg:justify-end">
                  <div className="text-left lg:text-right">
                    <p className="text-sm font-semibold">{formatTopMetricValue(item, topMetric)}</p>
                    <p className="text-xs text-muted-foreground">
                      Stok {formatNumber(item.stock || 0)} {item.unit}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("rounded-full", healthMeta.badgeClassName)}>
                    {healthMeta.label}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}

        {hasMoreProducts ? (
          <div ref={sentinelRef} className="rounded-xl border border-dashed px-4 py-3 text-center text-xs text-muted-foreground">
            Scroll ke bawah untuk memuat ranking berikutnya.
          </div>
        ) : products.length > TOP_PRODUCTS_BATCH_SIZE ? (
          <p className="py-1 text-center text-xs text-muted-foreground">
            Semua ranking untuk periode ini sudah tampil.
          </p>
        ) : null}
      </div>
    </div>
  );
}
