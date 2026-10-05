import { formatNumber } from "./number-format";

export function normalizeIdrInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return digits.replace(/^0+(?=\d)/, "");
}

export function formatIdrInput(value) {
  const normalized = normalizeIdrInput(value);

  if (!normalized) {
    return "";
  }

  return formatNumber(normalized);
}

export function parseIdrInput(value) {
  const normalized = normalizeIdrInput(value);
  return normalized ? Number(normalized) : 0;
}
