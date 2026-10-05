export function unwrap(response) {
  return response?.data?.data;
}

export function unwrapPaginated(response) {
  const payload = response?.data;

  if (Array.isArray(payload?.data)) {
    return {
      data: payload.data,
      meta: payload.meta || null,
      totals: payload.totals || null,
      range: payload.range || null,
    };
  }

  if (Array.isArray(payload)) {
    return {
      data: payload,
      meta: null,
      totals: null,
      range: null,
    };
  }

  return {
    data: [],
    meta: payload?.meta || null,
    totals: payload?.totals || null,
    range: payload?.range || null,
  };
}

export function toParams(query = {}) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function parseFileName(disposition, fallback = "laporan.pdf") {
  if (typeof disposition !== "string") {
    return fallback;
  }

  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] || fallback;
}

export async function downloadBlob(responsePromise, fallbackName) {
  const response = await responsePromise;

  return {
    blob: response.data,
    fileName: parseFileName(response.headers?.["content-disposition"], fallbackName),
  };
}
