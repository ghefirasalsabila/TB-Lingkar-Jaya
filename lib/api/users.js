import { api } from "./core";
import { toParams, unwrap, unwrapPaginated } from "./helpers";

export async function getCurrentUser() {
  const response = await api.get("/users/me");
  return unwrap(response);
}

export async function updateCurrentUser(payload) {
  const response = await api.patch("/users/me", payload, {
    successMessage: "Profil berhasil diperbarui.",
  });
  return unwrap(response);
}

export async function requestCurrentUserEmailChange(payload) {
  const response = await api.post("/users/me/email-change-request", payload, {
    successMessage: "Instruksi konfirmasi perubahan email telah dikirim.",
  });
  return unwrap(response);
}

export async function getUsers(query = {}) {
  const response = await api.get("/users", { params: toParams(query) });
  return unwrapPaginated(response);
}

export async function createUser(payload) {
  const response = await api.post("/users", payload, {
    successMessage: "Pengguna berhasil ditambahkan.",
  });
  return unwrap(response);
}

export async function updateUser(id, payload) {
  const response = await api.patch(`/users/${id}`, payload, {
    successMessage: "Pengguna berhasil diperbarui.",
  });
  return unwrap(response);
}

export async function deactivateUser(id) {
  const response = await api.patch(`/users/${id}/deactivate`, null, {
    successMessage: "Pengguna berhasil dinonaktifkan.",
  });
  return unwrap(response);
}
