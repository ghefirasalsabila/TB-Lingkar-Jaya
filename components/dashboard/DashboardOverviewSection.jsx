import { AlertTriangle, Trophy } from "lucide-react";
import { DashboardCategoryDistributionCard } from "./DashboardCategoryDistributionCard";
import { DashboardIconSurface } from "./DashboardIconSurface";
import { DashboardOverviewMetricsGrid } from "./DashboardOverviewMetricsGrid";
import { DashboardPreviewSummaryCard } from "./DashboardPreviewSummaryCard";
import { DASHBOARD_ICON_TONES, DASHBOARD_PREVIEW_TONES } from "../../features/dashboard/constants";

export function DashboardOverviewSection({
  loading,
  totalStock,
  categoryStockData,
  lowStockCount,
  lowStockPreview,
  lowStockPreviewRemainder,
  featuredTopProduct,
  topProductsPreview,
  topProductsPreviewRemainder,
  totalIncomingQty,
  totalOutgoingQty,
  totalSalesAmount,
  totalPurchaseAmount,
  onOpenProductsChart,
  onOpenTopProducts,
  onOpenTrendCharts,
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <DashboardCategoryDistributionCard
        loading={loading}
        totalStock={totalStock}
        categoryStockData={categoryStockData}
      />

      <div className="grid grid-cols-1 content-start gap-3 md:grid-cols-2">
        <DashboardPreviewSummaryCard
          icon={(
            <DashboardIconSurface className={DASHBOARD_ICON_TONES.restock}>
              <AlertTriangle className="h-4 w-4" />
            </DashboardIconSurface>
          )}
          title="Perlu Restock"
          loading={loading}
          primaryContent={lowStockPreview[0] ? <p className="truncate text-xl font-semibold">{lowStockPreview[0].name}</p> : <p className="text-base font-semibold text-muted-foreground">Semua stok aman.</p>}
          previewItems={lowStockPreview.slice(1)}
          previewKey={(item) => item.id}
          previewClassName={DASHBOARD_PREVIEW_TONES.restock}
          remainderLabel={lowStockPreviewRemainder > 0 ? `+${lowStockPreviewRemainder} lainnya` : ""}
          emptyPreview={lowStockCount === 0 ? (
            <span className={DASHBOARD_PREVIEW_TONES.safe}>Semua stok aman</span>
          ) : null}
          onClick={onOpenProductsChart}
        />

        <DashboardPreviewSummaryCard
          icon={(
            <DashboardIconSurface className={DASHBOARD_ICON_TONES.topSeller}>
              <Trophy className="h-4 w-4" />
            </DashboardIconSurface>
          )}
          title="Produk Terlaris"
          loading={loading}
          primaryContent={featuredTopProduct ? <p className="truncate text-xl font-semibold">{featuredTopProduct.productName}</p> : <p className="text-base font-semibold text-muted-foreground">Belum ada data penjualan.</p>}
          previewItems={topProductsPreview.map((item) => ({ id: item.productId, name: item.productName }))}
          previewKey={(item) => item.id}
          previewClassName={DASHBOARD_PREVIEW_TONES.topSeller}
          remainderLabel={topProductsPreviewRemainder > 0 ? `+${topProductsPreviewRemainder} lainnya` : ""}
          onClick={onOpenTopProducts}
        />

        <DashboardOverviewMetricsGrid
          loading={loading}
          totalStock={totalStock}
          totalIncomingQty={totalIncomingQty}
          totalOutgoingQty={totalOutgoingQty}
          totalSalesAmount={totalSalesAmount}
          totalPurchaseAmount={totalPurchaseAmount}
          onOpenProductsChart={onOpenProductsChart}
          onOpenTrendCharts={onOpenTrendCharts}
        />
      </div>
    </div>
  );
}
