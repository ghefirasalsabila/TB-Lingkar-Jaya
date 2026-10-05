import { api } from "./core";
import { toParams, unwrap, unwrapPaginated } from "./helpers";

export async function getProducts(query = {}) {
  const response = await api.get("/products", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`);
  return unwrap(response);
}

export async function createProduct(payload) {
  const response = await api.post("/products", payload, {
    successMessage: "Barang berhasil ditambahkan.",
  });
  return unwrap(response);
}

export async function updateProduct(id, payload) {
  const response = await api.patch(`/products/${id}`, payload, {
    successMessage: "Barang berhasil diperbarui.",
  });
  return unwrap(response);
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`, {
    successMessage: "Barang berhasil dihapus.",
  });
  return unwrap(response);
}
