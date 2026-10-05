const JAKARTA_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const JAKARTA_DATETIME_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

const JAKARTA_SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  timeZone: "Asia/Jakarta",
});

const JAKARTA_RANGE_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

function toValidDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatJakartaDate(value) {
  const date = toValidDate(value);
  return date ? JAKARTA_DATE_FORMATTER.format(date) : "-";
}

export function formatJakartaDateTime(value) {
  const date = toValidDate(value);
  return date ? JAKARTA_DATETIME_FORMATTER.format(date) : "-";
}

export function formatJakartaShortDate(value) {
  const date = toValidDate(value);
  return date ? JAKARTA_SHORT_DATE_FORMATTER.format(date) : "-";
}

export function formatJakartaRangeDate(value) {
  const date = toValidDate(value);
  return date ? JAKARTA_RANGE_DATE_FORMATTER.format(date) : "-";
}
