export const emptySupplierForm = {
  name: "",
  phone: "",
  address: "",
  categoryIds: [],
  isActive: true,
};

export const SUPPLIERS_DEFAULT_PAGE = 1;
export const SUPPLIERS_DEFAULT_LIMIT = 10;

export function validateSupplierForm(form) {
  const issues = [];
  if (form.name.trim().length < 2) issues.push("Nama supplier minimal 2 karakter.");
  if (form.phone.trim() && form.phone.trim().length < 6) issues.push("Telepon minimal 6 karakter.");
  if (form.address.trim() && form.address.trim().length < 4) issues.push("Alamat minimal 4 karakter.");
  if (form.categoryIds.length === 0) issues.push("Pilih minimal satu kategori produk.");
  return issues;
}
