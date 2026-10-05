import { toJakartaInputDate } from "../../lib/date-input";
import { formatJakartaDate } from "../../lib/date-format";

export const REPORTS_DEFAULT_PAGE = 1;
export const REPORTS_DEFAULT_LIMIT = 10;

export const reportTypeOptions = [
  { value: "summary", label: "Ringkasan" },
  { value: "sales", label: "Penjualan" },
  { value: "purchases", label: "Pembelian" },
  { value: "movements", label: "Pergerakan Stok" },
];

export const pdfTypeMap = {
  summary: "summary",
  sales: "sales",
  purchases: "purchases",
  movements: "movements",
};

export function getDefaultReportRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = toJakartaInputDate(new Date(year, month, 1));
  const last = toJakartaInputDate(new Date(year, month + 1, 0));
  return { from: first, to: last };
}

export function toDateLabel(value) {
  return formatJakartaDate(value);
}

export function getDateRangeLabel(from, to) {
  return `${toDateLabel(from)} - ${toDateLabel(to)}`;
}

export function getInclusiveDayCount(from, to) {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  return Math.max(1, diffInDays);
}

export function getReportTypeLabel(value) {
  return reportTypeOptions.find((item) => item.value === value)?.label || "Laporan";
}

export function buildReportDetailPath(reportType, value) {
  return `/admin/reports/${reportType}/${toJakartaInputDate(value)}`;
}
