import { api } from "./core";
import { downloadBlob, toParams, unwrap, unwrapPaginated } from "./helpers";
import { BRAND_SLUG } from "../../constants/brand";

export async function getReportSummary(query) {
  const response = await api.get("/reports/summary", { params: toParams(query) });
  return unwrap(response);
}

export async function getSalesReport(query) {
  const response = await api.get("/reports/sales-by-date", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function getPurchasesReport(query) {
  const response = await api.get("/reports/purchases-by-date", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function getStockMovementsReport(query) {
  const response = await api.get("/reports/stock-movements-by-date", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function downloadReportPdf(query) {
  return downloadBlob(
    api.get("/reports/pdf", {
      params: toParams(query),
      responseType: "blob",
    }),
    `laporan-summary-${BRAND_SLUG}.pdf`
  );
}
