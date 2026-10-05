import { createCategory, deleteCategory, getCategories, updateCategory } from "../../lib/api/categories";
import {
  CATEGORIES_DEFAULT_LIMIT,
  CATEGORIES_DEFAULT_PAGE,
  emptyCategoryForm,
  validateCategoryForm,
} from "../../features/categories/category-form-utils";
import { useManagedEntityPage } from "../shared/useManagedEntityPage";

function createEmptyCategoryForm() {
  return { ...emptyCategoryForm };
}

function mapCategoryToForm(category) {
  return {
    name: category.name || "",
    isActive: Boolean(category.isActive),
  };
}

function getCategoryValidationIssues({ form }) {
  return validateCategoryForm(form) ? [] : ["Nama kategori minimal 2 karakter."];
}

function buildCategoryPayload({ form, isOwner }) {
  return {
    name: form.name,
    ...(isOwner ? { isActive: form.isActive } : {}),
  };
}

export function useCategoriesPage({ isOwner }) {
  const pageState = useManagedEntityPage({
    isOwner,
    defaultPage: CATEGORIES_DEFAULT_PAGE,
    defaultLimit: CATEGORIES_DEFAULT_LIMIT,
    fetchPage: getCategories,
    errorMessage: "Gagal mengambil data kategori",
    createEmptyForm: createEmptyCategoryForm,
    mapItemToForm: mapCategoryToForm,
    validateForm: getCategoryValidationIssues,
    buildPayload: buildCategoryPayload,
    createItem: createCategory,
    updateItem: updateCategory,
    deleteItem: deleteCategory,
    saveErrorMessage: "Gagal menyimpan kategori",
    deleteErrorMessage: "Gagal menghapus kategori",
  });

  return {
    ...pageState,
    categories: pageState.items,
  };
}
