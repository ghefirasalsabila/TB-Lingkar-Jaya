import { api } from "./core";
import { downloadBlob, toParams, unwrap, unwrapPaginated } from "./helpers";

export async function getSales(query = {}) {
  const response = await api.get("/sales", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function getSaleById(id) {
  const response = await api.get(`/sales/${id}`);
  return unwrap(response);
}

export async function createSale(payload) {
  const response = await api.post("/sales", payload, {
    successMessage: "Penjualan berhasil ditambahkan.",
  });
  return unwrap(response);
}

export async function updateSale(id, payload) {
  const response = await api.patch(`/sales/${id}`, payload, {
    successMessage: "Penjualan berhasil diperbarui.",
  });
  return unwrap(response);
}

export async function voidSale(id, payload = {}) {
  const response = await api.post(`/sales/${id}/void`, payload, {
    successMessage: "Penjualan berhasil dibatalkan.",
  });
  return unwrap(response);
}

export async function downloadSaleReceipt(id) {
  return downloadBlob(
    api.get(`/sales/${id}/receipt`, { responseType: "blob" }),
    `struk-penjualan-${id}.pdf`
  );
}
