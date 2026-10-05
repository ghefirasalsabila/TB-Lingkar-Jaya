import { toJakartaInputDate, toJakartaMonthInput } from "../../lib/date-input";
import { formatJakartaRangeDate, formatJakartaShortDate } from "../../lib/date-format";

function toInputDate(value) {
  return toJakartaInputDate(value);
}

export function toMonthInput(value) {
  return toJakartaMonthInput(value);
}

function formatLongDateLabel(dateValue) {
  return formatJakartaRangeDate(dateValue);
}

export function formatRangeLabel(from, to) {
  if (!from || !to) {
    return "-";
  }

  if (from === to) {
    return formatLongDateLabel(from);
  }

  return `${formatLongDateLabel(from)} - ${formatLongDateLabel(to)}`;
}

export function getLastNDaysRange(days = 30, referenceDate = new Date()) {
  const end = new Date(referenceDate);
  const start = new Date(referenceDate);
  start.setDate(end.getDate() - (days - 1));

  return {
    from: toInputDate(start),
    to: toInputDate(end),
    allTime: false,
  };
}

function getMonthRangeFromDate(value, referenceDate = new Date()) {
  const [yearRaw, monthRaw] = String(value || "").split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!year || !month || month < 1 || month > 12) {
    return getLastNDaysRange(30, referenceDate);
  }

  const start = new Date(year, month - 1, 1);
  const isCurrentMonth = year === referenceDate.getFullYear() && month === referenceDate.getMonth() + 1;
  const end = isCurrentMonth ? new Date(referenceDate) : new Date(year, month, 0);

  return {
    from: toInputDate(start),
    to: toInputDate(end),
    allTime: false,
  };
}

export function resolveDashboardRangeFromPreset(preset, { referenceDate = new Date(), monthValue, customRange } = {}) {
  if (preset === "allTime") {
    return {
      from: "",
      to: "",
      allTime: true,
    };
  }

  if (preset === "thisMonth") {
    return getMonthRangeFromDate(toMonthInput(referenceDate), referenceDate);
  }

  if (preset === "lastMonth") {
    const target = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
    return getMonthRangeFromDate(toMonthInput(target), referenceDate);
  }

  if (preset === "month") {
    return getMonthRangeFromDate(monthValue, referenceDate);
  }

  if (preset === "custom" && customRange?.from && customRange?.to) {
    return {
      from: customRange.from,
      to: customRange.to,
      allTime: false,
    };
  }

  return {
    ...getLastNDaysRange(30, referenceDate),
    allTime: false,
  };
}

export function formatDateLabel(dateStr) {
  return formatJakartaShortDate(dateStr);
}
