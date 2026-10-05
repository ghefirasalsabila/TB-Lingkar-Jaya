import { Suspense, lazy } from "react";
import { AdminPageSeo } from "../../components/common/AdminPageSeo";
import { DashboardPeriodFilter } from "../../components/dashboard/DashboardPeriodFilter";
import {
  DashboardChartSectionFallback,
  DashboardOverviewSectionFallback,
  DashboardTrendSectionFallback,
} from "../../components/dashboard/DashboardSectionFallbacks";
import { DashboardTopProductsSection } from "../../components/dashboard/DashboardTopProductsSection";
import { StatusAlert } from "../../components/common/StatusAlert";
import { useDashboardPage } from "../../hooks/dashboard/useDashboardPage";

const DashboardOverviewSection = lazy(() =>
  import("../../components/dashboard/DashboardOverviewSection").then((module) => ({
    default: module.DashboardOverviewSection,
  })),
);
const DashboardProductStockSection = lazy(() =>
  import("../../components/dashboard/DashboardProductStockSection").then((module) => ({
    default: module.DashboardProductStockSection,
  })),
);
const DashboardTrendSection = lazy(() =>
  import("../../components/dashboard/DashboardTrendSection").then((module) => ({
    default: module.DashboardTrendSection,
  })),
);

export function DashboardPage() {
  const {
    loading,
    error,
    periodPreset,
    selectedMonth,
    customRange,
    topMetric,
    totalStock,
    lowStockCount,
    categoryStockData,
    allProductsData,
    stockTrend,
    moneyTrend,
    totalIncomingQty,
    totalOutgoingQty,
    totalSalesAmount,
    totalPurchaseAmount,
    activeRangeLabel,
    featuredTopProduct,
    rankedTopProducts,
    topMetricMax,
    lowStockPreview,
    lowStockPreviewRemainder,
    topProductsPreview,
    topProductsPreviewRemainder,
    productStockRef,
    topProductsRef,
    trendChartsRef,
    handlePresetChange,
    handleMonthChange,
    handleCustomRangeChange,
    handleCustomRangeApply,
    setTopMetric,
    openProductsChart,
    openTopProducts,
    openTrendCharts,
  } = useDashboardPage();

  return (
    <div className="space-y-6">
      <AdminPageSeo
        title="Dasbor"
        description="Ringkasan stok, transaksi, dan performa operasional harian."
        path="/admin/dashboard"
      />

      <DashboardPeriodFilter
        activeRangeLabel={activeRangeLabel}
        periodPreset={periodPreset}
        selectedMonth={selectedMonth}
        customRange={customRange}
        onPresetChange={handlePresetChange}
        onMonthChange={handleMonthChange}
        onCustomRangeChange={handleCustomRangeChange}
        onCustomRangeApply={handleCustomRangeApply}
      />

      <StatusAlert message={error} tone="destructive" />

      <Suspense fallback={<DashboardOverviewSectionFallback />}>
        <DashboardOverviewSection
          loading={loading}
          totalStock={totalStock}
          categoryStockData={categoryStockData}
          lowStockCount={lowStockCount}
          allProductsCount={allProductsData.length}
          lowStockPreview={lowStockPreview}
          lowStockPreviewRemainder={lowStockPreviewRemainder}
          featuredTopProduct={featuredTopProduct}
          topProductsPreview={topProductsPreview}
          topProductsPreviewRemainder={topProductsPreviewRemainder}
          totalIncomingQty={totalIncomingQty}
          totalOutgoingQty={totalOutgoingQty}
          totalSalesAmount={totalSalesAmount}
          totalPurchaseAmount={totalPurchaseAmount}
          onOpenProductsChart={openProductsChart}
          onOpenTopProducts={openTopProducts}
          onOpenTrendCharts={openTrendCharts}
        />
      </Suspense>

      <div ref={productStockRef} className="scroll-mt-4">
        <Suspense
          fallback={(
            <DashboardChartSectionFallback
              title="Stok per Produk"
              description="Memuat diagram batang stok produk."
              height={320}
            />
          )}
        >
          <DashboardProductStockSection loading={loading} products={allProductsData} />
        </Suspense>
      </div>

      <div ref={topProductsRef} className="scroll-mt-4">
        <DashboardTopProductsSection
          loading={loading}
          activeRangeLabel={activeRangeLabel}
          topMetric={topMetric}
          featuredTopProduct={featuredTopProduct}
          rankedTopProducts={rankedTopProducts}
          topMetricMax={topMetricMax}
          onTopMetricChange={setTopMetric}
        />
      </div>

      <div ref={trendChartsRef} className="scroll-mt-4">
        <Suspense fallback={<DashboardTrendSectionFallback />}>
          <DashboardTrendSection
            loading={loading}
            activeRangeLabel={activeRangeLabel}
            stockTrend={stockTrend}
            moneyTrend={moneyTrend}
            totalIncomingQty={totalIncomingQty}
            totalOutgoingQty={totalOutgoingQty}
            totalSalesAmount={totalSalesAmount}
            totalPurchaseAmount={totalPurchaseAmount}
          />
        </Suspense>
      </div>
    </div>
  );
}
