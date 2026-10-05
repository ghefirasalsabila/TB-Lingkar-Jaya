import { getCategories } from "../../lib/api/categories";
import { createProduct, getProductById, updateProduct } from "../../lib/api/products";
import {
  createProductPayload,
  PRODUCTS_DEFAULT_PAGE,
  PRODUCTS_MASTER_DATA_LIMIT,
} from "../../features/products/product-form-utils";

export async function fetchActiveCategories() {
  const categoryResponse = await getCategories({
    page: PRODUCTS_DEFAULT_PAGE,
    limit: PRODUCTS_MASTER_DATA_LIMIT,
  });
  const categoryData = Array.isArray(categoryResponse?.data) ? categoryResponse.data : [];
  return categoryData.filter((item) => item.isActive);
}

export async function fetchProductEditorData(productId) {
  const item = await getProductById(productId);

  return {
    form: {
      categoryId: item.categoryId,
      name: item.name || "",
      sku: item.sku || "",
      unit: item.unit || "",
      stock: item.stock === null || item.stock === undefined ? "0" : String(item.stock),
      minStock: item.minStock === null || item.minStock === undefined ? "" : String(item.minStock),
      buyPrice: item.buyPrice === null || item.buyPrice === undefined ? "" : String(item.buyPrice),
      sellPrice: item.sellPrice === null || item.sellPrice === undefined ? "" : String(item.sellPrice),
      isActive: Boolean(item.isActive),
    },
  };
}

export async function saveProductEditor({
  form,
  isEditMode,
  routeEditId,
  isOwner,
}) {
  const payload = createProductPayload(form, isOwner);
  const savedProduct = isEditMode
    ? await updateProduct(routeEditId, payload)
    : await createProduct(payload);

  return savedProduct;
}
