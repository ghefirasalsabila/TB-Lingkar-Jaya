import { api } from "./core";
import { downloadBlob, toParams, unwrap, unwrapPaginated } from "./helpers";

export async function getPurchases(query = {}) {
  const response = await api.get("/purchases", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function getPurchaseById(id) {
  const response = await api.get(`/purchases/${id}`);
  return unwrap(response);
}

export async function createPurchase(payload) {
  const response = await api.post("/purchases", payload, {
    successMessage: "Pembelian berhasil ditambahkan.",
  });
  return unwrap(response);
}

export async function updatePurchase(id, payload) {
  const response = await api.patch(`/purchases/${id}`, payload, {
    successMessage: "Pembelian berhasil diperbarui.",
  });
  return unwrap(response);
}

export async function voidPurchase(id, payload = {}) {
  const response = await api.post(`/purchases/${id}/void`, payload, {
    successMessage: "Pembelian berhasil dibatalkan.",
  });
  return unwrap(response);
}

export async function downloadPurchaseReceipt(id) {
  return downloadBlob(
    api.get(`/purchases/${id}/receipt`, { responseType: "blob" }),
    `struk-pembelian-${id}.pdf`
  );
}
