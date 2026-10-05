import { parseIdrInput } from "../../lib/currency-input";

export const emptyProductForm = {
  categoryId: "",
  name: "",
  sku: "",
  unit: "",
  stock: "0",
  minStock: "",
  buyPrice: "",
  sellPrice: "",
  isActive: true,
};

export const PRODUCTS_DEFAULT_PAGE = 1;
export const PRODUCTS_DEFAULT_LIMIT = 10;
export const PRODUCTS_MASTER_DATA_LIMIT = 100;

function isFilled(value) {
  return String(value ?? "").trim().length > 0;
}

function isNonNegativeNumber(value) {
  if (!isFilled(value)) return false;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0;
}

export function createProductPayload(form, isOwner) {
  return {
    categoryId: form.categoryId,
    name: form.name,
    sku: form.sku,
    unit: form.unit,
    minStock: Number(form.minStock),
    buyPrice: parseIdrInput(form.buyPrice),
    sellPrice: parseIdrInput(form.sellPrice),
    ...(isOwner ? { isActive: form.isActive } : {}),
  };
}

export function getProductValidationMessages(form) {
  const messages = [];

  if (!isFilled(form.categoryId)) messages.push("Pilih kategori");
  if (String(form.name || "").trim().length < 2) messages.push("Nama minimal 2 karakter");
  if (String(form.sku || "").trim().length < 2) messages.push("SKU minimal 2 karakter");
  if (!isFilled(form.unit)) messages.push("Satuan wajib diisi");
  if (!isNonNegativeNumber(form.minStock)) messages.push("Stok minimum wajib diisi");
  if (!isNonNegativeNumber(form.buyPrice)) messages.push("Harga beli wajib diisi");
  if (!isNonNegativeNumber(form.sellPrice)) messages.push("Harga jual wajib diisi");

  return messages;
}

export function isProductFieldValid(field, value) {
  switch (field) {
    case "categoryId":
      return isFilled(value);
    case "name":
    case "sku":
      return String(value || "").trim().length >= 2;
    case "unit":
      return isFilled(value);
    case "minStock":
    case "buyPrice":
    case "sellPrice":
      return isNonNegativeNumber(value);
    default:
      return true;
  }
}
