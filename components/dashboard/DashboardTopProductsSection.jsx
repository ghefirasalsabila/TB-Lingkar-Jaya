import { BadgeDollarSign, PackageSearch } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { DASHBOARD_TOP_PRODUCTS_HEADER_CLASS } from "../../features/dashboard/constants";
import { TopProductsSkeleton } from "./DashboardSkeletons";
import { DashboardTopProductsFeaturedCard } from "./DashboardTopProductsFeaturedCard";
import { DashboardTopProductsScrollableList } from "./DashboardTopProductsScrollableList";

export function DashboardTopProductsSection({
  loading,
  activeRangeLabel,
  topMetric,
  featuredTopProduct,
  rankedTopProducts,
  topMetricMax,
  onTopMetricChange,
}) {
  return (
    <Card>
      <CardHeader className={DASHBOARD_TOP_PRODUCTS_HEADER_CLASS}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <CardTitle>Produk Terlaris</CardTitle>
            <CardDescription className="mt-1">
              Ranking produk paling muter untuk periode {activeRangeLabel}.
            </CardDescription>
          </div>
          <div className="inline-flex w-full rounded-lg border bg-muted/20 p-1 xl:w-auto">
            <Button
              type="button"
              size="sm"
              variant={topMetric === "qty" ? "secondary" : "ghost"}
              className="flex-1 rounded-md xl:flex-none"
              onClick={() => onTopMetricChange("qty")}
            >
              <PackageSearch className="h-3.5 w-3.5" />
              Berdasarkan Qty
            </Button>
            <Button
              type="button"
              size="sm"
              variant={topMetric === "revenue" ? "secondary" : "ghost"}
              className="flex-1 rounded-md xl:flex-none"
              onClick={() => onTopMetricChange("revenue")}
            >
              <BadgeDollarSign className="h-3.5 w-3.5" />
              Berdasarkan Omzet
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {loading ? (
          <TopProductsSkeleton />
        ) : !featuredTopProduct ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Belum ada transaksi penjualan untuk periode ini.</p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.45fr)]">
            <DashboardTopProductsFeaturedCard featuredTopProduct={featuredTopProduct} topMetric={topMetric} />

            <div className="space-y-3">
              {rankedTopProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  Belum ada produk lain setelah peringkat utama di periode ini.
                </div>
              ) : (
                <DashboardTopProductsScrollableList
                  key={`${activeRangeLabel}-${topMetric}-${featuredTopProduct.productId}-${rankedTopProducts.length}`}
                  products={rankedTopProducts}
                  topMetric={topMetric}
                  topMetricMax={topMetricMax}
                />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
