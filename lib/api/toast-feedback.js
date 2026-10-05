export function resolveDefaultSuccessMessage(config = {}) {
  const method = config.method?.toLowerCase();
  if (method === "post") return "Operasi berhasil disimpan.";
  if (method === "patch" || method === "put") return "Perubahan berhasil disimpan.";
  if (method === "delete") return "Data berhasil dihapus.";
  return "Operasi berhasil.";
}

export function resolveDefaultErrorMessage(config = {}) {
  const method = config.method?.toLowerCase();
  if (method === "post") return "Gagal menambahkan data.";
  if (method === "patch" || method === "put") return "Gagal memperbarui data.";
  if (method === "delete") return "Gagal menghapus data.";
  return "Terjadi kesalahan pada permintaan.";
}
