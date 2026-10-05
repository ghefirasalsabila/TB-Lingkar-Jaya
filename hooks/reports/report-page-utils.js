import { getPurchasesReport, getReportSummary, getSalesReport, getStockMovementsReport, downloadReportPdf } from "../../lib/api/reports";
import { downloadBrowserFile } from "../../lib/browser-file";
import { formatCurrency, formatNumber } from "../../lib/formatters";
import { pdfTypeMap } from "../../features/reports/report-utils";
import { BRAND_SLUG } from "../../constants/brand";

const DEFAULT_REPORT_FILE_NAME = `laporan-summary-${BRAND_SLUG}.pdf`;

export async function fetchReportData(reportType, query, page, limit) {
  if (reportType === "summary") {
    const data = await getReportSummary(query);
    return { data, meta: null };
  }

  if (reportType === "sales") {
    return getSalesReport({ ...query, page, limit });
  }

  if (reportType === "purchases") {
    return getPurchasesReport({ ...query, page, limit });
  }

  return getStockMovementsReport({ ...query, page, limit });
}

export async function downloadReportFile(query, reportType) {
  const { blob, fileName } = await downloadReportPdf({
    ...query,
    type: pdfTypeMap[reportType],
  });

  downloadBrowserFile(blob, fileName || DEFAULT_REPORT_FILE_NAME);
}

function buildSummaryOverviewCards(report) {
  const salesTotal = Number(report?.salesTotals?.postedTotal || 0);
  const salesCount = Number(report?.salesTotals?.transactionCount || 0);
  const purchaseTotal = Number(report?.purchaseTotals?.postedTotal || 0);
  const purchaseCount = Number(report?.purchaseTotals?.transactionCount || 0);
  const movementCount = Number(report?.stockMovementTotals?.movementCount || 0);
  const netOperational = salesTotal - purchaseTotal;

  return [
    {
      label: "Penjualan",
      value: formatCurrency(salesTotal),
      note: `${salesCount} transaksi`,
      tone: "sales",
    },
    {
      label: "Pembelian",
      value: formatCurrency(purchaseTotal),
      note: `${purchaseCount} transaksi`,
      tone: "purchases",
    },
    {
      label: "Selisih",
      value: formatCurrency(netOperational),
      note: "Penjualan - pembelian",
      tone: netOperational >= 0 ? "positiveNet" : "negativeNet",
    },
    {
      label: "Mutasi Stok",
      value: formatNumber(movementCount),
      note: "Total pergerakan stok",
      tone: "movements",
    },
  ];
}

export function buildReportCards(reportType, report) {
  if (reportType === "summary") {
    return buildSummaryOverviewCards(report);
  }

  return [];
}
