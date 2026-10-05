import { api } from "./core";
import { toParams, unwrap, unwrapPaginated } from "./helpers";

export async function getSuppliers(query = {}) {
  const response = await api.get("/suppliers", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function getSupplierProducts(id) {
  const response = await api.get(`/suppliers/${id}/products`);
  return unwrap(response) || [];
}

export async function createSupplier(payload) {
  const response = await api.post("/suppliers", payload, {
    successMessage: "Supplier berhasil ditambahkan.",
  });
  return unwrap(response);
}

export async function updateSupplier(id, payload) {
  const response = await api.patch(`/suppliers/${id}`, payload, {
    successMessage: "Supplier berhasil diperbarui.",
  });
  return unwrap(response);
}

export async function deleteSupplier(id) {
  const response = await api.delete(`/suppliers/${id}`, {
    successMessage: "Supplier berhasil dihapus.",
  });
  return unwrap(response);
}
