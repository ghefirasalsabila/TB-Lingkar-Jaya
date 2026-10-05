import { api } from "./core";
import { unwrap } from "./helpers";

export async function loginRequest(payload) {
  const response = await api.post("/auth/login", payload, {
    successMessage: "Berhasil masuk.",
  });
  return unwrap(response);
}

export async function forgotPasswordRequest(payload) {
  const response = await api.post("/auth/forgot-password", payload, {
    successMessage: "Jika email terdaftar, instruksi reset telah dikirim.",
  });
  return unwrap(response);
}

export async function resetPasswordRequest(payload) {
  const response = await api.post("/auth/reset-password", payload, {
    successMessage: "Kata sandi berhasil diperbarui.",
  });
  return unwrap(response);
}

export async function changePasswordRequest(payload) {
  const response = await api.post("/auth/change-password", payload, {
    successMessage: "Kata sandi berhasil diubah.",
  });
  return unwrap(response);
}

export async function confirmEmailChangeRequest(payload) {
  const response = await api.post("/auth/confirm-email-change", payload, {
    successMessage: "Konfirmasi email berhasil diproses.",
  });
  return unwrap(response);
}
