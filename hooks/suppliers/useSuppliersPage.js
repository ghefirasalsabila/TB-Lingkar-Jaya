import { useCallback } from "react";
import { getCategories } from "../../lib/api/categories";
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "../../lib/api/suppliers";
import {
  emptySupplierForm,
  SUPPLIERS_DEFAULT_LIMIT,
  SUPPLIERS_DEFAULT_PAGE,
  validateSupplierForm,
} from "../../features/suppliers/supplier-form-utils";
import { useManagedEntityPage } from "../shared/useManagedEntityPage";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

function createEmptySupplierForm() {
  return { ...emptySupplierForm, categoryIds: [] };
}

function mapSupplierToForm(supplier) {
  return {
    name: supplier.name || "",
    phone: supplier.phone || "",
    address: supplier.address || "",
    categoryIds: Array.isArray(supplier.categories)
      ? supplier.categories.filter((category) => category.isActive).map((category) => category.id)
      : [],
    isActive: Boolean(supplier.isActive),
  };
}

function getSupplierValidationIssues({ form }) {
  return validateSupplierForm(form);
}

function buildSupplierPayload({ form, isOwner }) {
  return {
    name: form.name.trim(),
    phone: form.phone.trim() || "",
    address: form.address.trim() || "",
    categoryIds: form.categoryIds,
    ...(isOwner ? { isActive: form.isActive } : {}),
  };
}

export function useSuppliersPage({ isOwner }) {
  const loadCategories = useCallback(async () => {
    const response = await getCategories({ page: 1, limit: 100 });
    return Array.isArray(response?.data) ? response.data : [];
  }, []);
  const categoryState = useAsyncValueEffect({
    enabled: isOwner,
    initialValue: [],
    fallbackValue: [],
    load: loadCategories,
    errorMessage: "Gagal mengambil data kategori",
  });
  const pageState = useManagedEntityPage({
    isOwner,
    defaultPage: SUPPLIERS_DEFAULT_PAGE,
    defaultLimit: SUPPLIERS_DEFAULT_LIMIT,
    fetchPage: getSuppliers,
    errorMessage: "Gagal mengambil data supplier",
    createEmptyForm: createEmptySupplierForm,
    mapItemToForm: mapSupplierToForm,
    validateForm: getSupplierValidationIssues,
    buildPayload: buildSupplierPayload,
    createItem: createSupplier,
    updateItem: updateSupplier,
    deleteItem: deleteSupplier,
    saveErrorMessage: "Gagal menyimpan supplier",
    deleteErrorMessage: "Gagal menghapus supplier",
  });

  return {
    ...pageState,
    suppliers: pageState.items,
    categories: categoryState.value,
    categoriesLoading: categoryState.loading,
  };
}
