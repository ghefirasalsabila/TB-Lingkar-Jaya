import { api } from "./core";
import { toParams, unwrap, unwrapPaginated } from "./helpers";

export async function getPublicCategories() {
  const response = await api.get("/public/categories", {
    skipErrorToast: true
  });
  return unwrap(response) || [];
}

export async function getPublicProducts(query = {}) {
  const response = await api.get("/public/products", {
    params: toParams(query),
    skipErrorToast: true
  });
  return unwrapPaginated(response);
}

export async function getPublicSummary() {
  const response = await api.get("/public/summary", {
    skipErrorToast: true
  });
  return unwrap(response);
}
