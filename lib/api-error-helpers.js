import {
  FIELD_LABELS,
  REQUIRED_TEXT_FIELDS,
  SELECT_LIKE_FIELDS,
  TRANSLATION_PATTERNS,
} from "./api-error-config";

export function toFieldLabel(field) {
  if (!field) return "Field";
  const path = String(field).split(".");
  const last = path[path.length - 1];
  if (FIELD_LABELS[last]) return FIELD_LABELS[last];
  const cleaned = last.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function translateZodMessage(rawMessage, fieldLabel) {
  const message = String(rawMessage || "").trim();

  for (const { re, fn } of TRANSLATION_PATTERNS) {
    const match = message.match(re);
    if (match) return fn(match);
  }

  return message || `${fieldLabel} tidak valid`;
}

export function humanizeFieldIssue(field, translatedMessage) {
  const label = toFieldLabel(field);
  const lower = String(translatedMessage || "").toLowerCase();

  if (SELECT_LIKE_FIELDS.has(field) && (lower.includes("minimal 1 karakter") || lower.includes("wajib diisi"))) {
    return `Pilih ${label.toLowerCase()}`;
  }

  if (REQUIRED_TEXT_FIELDS.has(field) && lower.includes("minimal 1 karakter")) {
    return `${label} wajib diisi`;
  }

  if (lower.includes("wajib diisi")) {
    return `${label} wajib diisi`;
  }

  return `${label} ${translatedMessage}`;
}
