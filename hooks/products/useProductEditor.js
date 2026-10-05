import { useProductEditorResources } from "./useProductEditorResources";
import { useProductFormState } from "./useProductFormState";
import { useProductEditorActions } from "./useProductEditorActions";

export function useProductEditor({ isFormMode, isEditMode, routeEditId, isOwner, navigate }) {
  const {
    form,
    setForm,
    setSubmitAttempted,
    handleFormChange,
    handleFieldBlur,
    getLabelClassName,
    isFieldInvalid,
    resetForm,
  } = useProductFormState();
  const resourceState = useProductEditorResources({
    isFormMode,
    isEditMode,
    routeEditId,
    setForm,
  });
  const actionState = useProductEditorActions({
    form,
    isEditMode,
    routeEditId,
    isOwner,
    navigate,
    resetForm,
    setError: resourceState.setError,
    setSubmitAttempted,
  });

  return {
    categories: resourceState.categories,
    categoriesLoading: resourceState.categoriesLoading,
    form,
    formLoading: resourceState.formLoading,
    saving: actionState.saving,
    error: resourceState.error,
    getLabelClassName,
    isFieldInvalid,
    handleFormChange,
    handleFieldBlur,
    handleSubmit: actionState.handleSubmit,
    handleSaveAndAddAnother: actionState.handleSaveAndAddAnother,
  };
}
