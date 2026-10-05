import {
  STOCK_MOVEMENT_REFERENCE_LABELS,
  STOCK_MOVEMENT_TYPE_LABELS,
  TRANSACTION_REFERENCE_PREFIXES,
  TRANSACTION_STATUS_LABELS,
} from "../constants/transactions";
import {
  formatCompactNumber as formatCompactIdNumber,
  formatCurrency as formatIdrCurrency,
  formatNumber as formatIdNumber,
} from "./number-format";

export function formatCurrency(value) {
  return formatIdrCurrency(value);
}

export function formatNumber(value) {
  return formatIdNumber(value);
}

export function formatCompactNumber(value) {
  return formatCompactIdNumber(value);
}

const TRANSACTION_REFERENCE_TIMESTAMP_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function formatTransactionStatus(status) {
  const key = String(status || "").toUpperCase();
  return TRANSACTION_STATUS_LABELS[key] || status || "-";
}

export function formatStockMovementType(type) {
  const key = String(type || "").toUpperCase();
  return STOCK_MOVEMENT_TYPE_LABELS[key] || type || "-";
}

function buildTransactionReferenceTimestamp(sourceDate) {
  if (!sourceDate) {
    return "";
  }

  const date = sourceDate instanceof Date ? sourceDate : new Date(sourceDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = TRANSACTION_REFERENCE_TIMESTAMP_FORMATTER.formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${byType.year}${byType.month}${byType.day}${byType.hour}${byType.minute}${byType.second}`;
}

export function formatStockMovementReference(refType, refId, sourceDate) {
  const key = String(refType || "").toUpperCase();
  const label = STOCK_MOVEMENT_REFERENCE_LABELS[key] || refType || "-";

  if (!refId) {
    return label;
  }

  if (key === "PURCHASE" || key === "SALE") {
    return `${label} (${formatTransactionReference(key, refId, sourceDate)})`;
  }

  return `${label} (${refId})`;
}

function formatTransactionReference(type, rawId, sourceDate) {
  const id = String(rawId || "").trim();

  if (!id) {
    return "-";
  }

  const normalizedType = String(type || "").trim().toUpperCase();
  const prefix = TRANSACTION_REFERENCE_PREFIXES[normalizedType] || "TRX";
  const timestamp = buildTransactionReferenceTimestamp(sourceDate);

  if (timestamp) {
    return `${prefix}-${timestamp}`;
  }

  const compact = id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const short = compact.slice(-8) || compact;
  return `${prefix}-${short}`;
}
