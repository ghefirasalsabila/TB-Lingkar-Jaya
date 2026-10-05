const JAKARTA_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const JAKARTA_MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
});

function formatParts(formatter, value) {
  const date = value instanceof Date ? value : new Date(value);
  const parts = formatter.formatToParts(date).reduce((accumulator, part) => {
    if (part.type !== "literal") {
      accumulator[part.type] = part.value;
    }

    return accumulator;
  }, {});

  return parts;
}

export function toJakartaInputDate(value) {
  const { year, month, day } = formatParts(JAKARTA_DATE_FORMATTER, value);
  return `${year}-${month}-${day}`;
}

export function toJakartaMonthInput(value) {
  const { year, month } = formatParts(JAKARTA_MONTH_FORMATTER, value);
  return `${year}-${month}`;
}
