import {
  humanizeFieldIssue,
  toFieldLabel,
  translateZodMessage,
} from "./api-error-helpers";

function isInternalDataErrorMessage(message) {
  if (typeof message !== "string" || message.length === 0) {
    return false;
  }

  return (
    message.includes("Invalid `prisma.") ||
    message.includes("The table `public.") ||
    message.includes("does not exist in the current database")
  );
}

export function getApiErrorMessage(error, fallback = "Terjadi kesalahan") {
  const responseData = error?.response?.data;
  const message = responseData?.message;
  const isValidationError = message === "Validation error" || message === "Validasi gagal";

  if (isValidationError) {
    const details = responseData?.details;
    const fieldErrors = details?.fieldErrors;
    const formErrors = Array.isArray(details?.formErrors) ? details.formErrors : [];

    const fieldEntries =
      fieldErrors && typeof fieldErrors === "object"
        ? Object.entries(fieldErrors).filter(([, value]) => Array.isArray(value) && value.length > 0)
        : [];

    if (fieldEntries.length > 0 || formErrors.length > 0) {
      const formattedFields = fieldEntries.map(([field, messages]) => messages
        .map((raw) => translateZodMessage(raw, toFieldLabel(field)))
        .map((issue) => humanizeFieldIssue(field, issue))
        .join(", "));
      const formattedGlobal = formErrors.map((raw) => translateZodMessage(raw, "Form"));
      return [...formattedFields, ...formattedGlobal].join("; ");
    }

    return "Validasi gagal. Periksa kembali data yang diisi.";
  }

  if (isInternalDataErrorMessage(message)) {
    return fallback;
  }

  if (typeof message === "string" && message.length > 0) {
    return message.replace("Validation error", "Validasi gagal. Periksa kembali data yang diisi.");
  }

  return fallback;
}
