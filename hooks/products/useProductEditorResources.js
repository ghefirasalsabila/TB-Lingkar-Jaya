import { useCallback, useEffect } from "react";
import { fetchActiveCategories, fetchProductEditorData } from "./product-editor-api";
import { useAsyncValueEffect } from "../shared/useAsyncValueEffect";

const EMPTY_CATEGORY_OPTIONS = [];
const EMPTY_EDITOR_DATA = null;

export function useProductEditorResources({
  isFormMode,
  isEditMode,
  routeEditId,
  setForm,
}) {
  const loadCategories = useCallback(() => fetchActiveCategories(), []);
  const loadEditorData = useCallback(() => fetchProductEditorData(routeEditId), [routeEditId]);
  const categoriesState = useAsyncValueEffect({
    enabled: isFormMode,
    initialValue: EMPTY_CATEGORY_OPTIONS,
    fallbackValue: EMPTY_CATEGORY_OPTIONS,
    load: loadCategories,
  });
  const editorDataState = useAsyncValueEffect({
    enabled: Boolean(isEditMode && routeEditId),
    initialValue: EMPTY_EDITOR_DATA,
    fallbackValue: EMPTY_EDITOR_DATA,
    load: loadEditorData,
    errorMessage: "Gagal memuat data produk",
  });

  useEffect(() => {
    if (!editorDataState.value) {
      return;
    }

    setForm(editorDataState.value.form);
  }, [editorDataState.value, setForm]);

  return {
    categories: categoriesState.value,
    categoriesLoading: categoriesState.loading,
    formLoading: editorDataState.loading,
    error: editorDataState.error,
    setError: editorDataState.setError,
  };
}
