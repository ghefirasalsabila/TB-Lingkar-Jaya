import { api } from "./core";
import { toParams, unwrap, unwrapPaginated } from "./helpers";

export async function getCategories(query = {}) {
  const response = await api.get("/categories", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function createCategory(payload) {
  const response = await api.post("/categories", payload, {
    successMessage: "Kategori berhasil ditambahkan.",
  });
  return unwrap(response);
}

export async function updateCategory(id, payload) {
  const response = await api.patch(`/categories/${id}`, payload, {
    successMessage: "Kategori berhasil diperbarui.",
  });
  return unwrap(response);
}

export async function deleteCategory(id) {
  const response = await api.delete(`/categories/${id}`, {
    successMessage: "Kategori berhasil dihapus.",
  });
  return unwrap(response);
}
