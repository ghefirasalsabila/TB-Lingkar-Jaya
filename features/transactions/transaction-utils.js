import { formatNumber } from "../../lib/formatters";
import { formatJakartaDate, formatJakartaDateTime } from "../../lib/date-format";

export const TRANSACTION_DEFAULT_PAGE = 1;
export const TRANSACTION_DEFAULT_LIMIT = 10;
export const TRANSACTION_MASTER_DATA_LIMIT = 100;

export function toDateLabel(value) {
  return formatJakartaDate(value);
}

export function toDateTimeLabel(value) {
  return formatJakartaDateTime(value);
}

export function formatTransactionItemQty(item) {
  const qty = formatNumber(item?.qty || 0);
  const unit = String(item?.productUnit || "").trim();

  return unit ? `${qty} ${unit}` : qty;
}

export function getTransactionItemCountLabel(items = []) {
  const count = Array.isArray(items) ? items.length : 0;
  return `${count} item`;
}

export function getTransactionProductSummary(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      primary: "-",
      secondary: "",
    };
  }

  const [firstItem] = items;
  const remainingCount = items.length - 1;

  return {
    primary: firstItem.productName || "Produk",
    secondary: remainingCount > 0
      ? `+${remainingCount} item lainnya`
      : (firstItem.productSku || ""),
  };
}

export function getTransactionQtySummary(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      primary: "-",
      secondary: "",
    };
  }

  const [firstItem] = items;
  const remainingCount = items.length - 1;

  return {
    primary: formatTransactionItemQty(firstItem),
    secondary: remainingCount > 0 ? `+${remainingCount} item lainnya` : "",
  };
}
