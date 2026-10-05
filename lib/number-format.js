const IDR_INTEGER_FORMATTER = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

const IDR_COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const IDR_CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function toFiniteNumber(value) {
  const normalized = Number(value ?? 0);
  return Number.isFinite(normalized) ? normalized : 0;
}

export function formatNumber(value) {
  return IDR_INTEGER_FORMATTER.format(toFiniteNumber(value));
}

export function formatCompactNumber(value) {
  return IDR_COMPACT_NUMBER_FORMATTER.format(toFiniteNumber(value));
}

export function formatCurrency(value) {
  return IDR_CURRENCY_FORMATTER.format(toFiniteNumber(value));
}
