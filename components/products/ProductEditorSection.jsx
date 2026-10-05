import { StatusAlert } from "../../components/common/StatusAlert";
import { useProductEditor } from "../../hooks/products/useProductEditor";
import { ProductFormCard } from "./ProductFormCard";

export function ProductEditorSection({ routeEditId, isEditMode, isOwner, navigate }) {
  const editor = useProductEditor({
    isFormMode: true,
    isEditMode,
    routeEditId,
    isOwner,
    navigate,
  });

  return (
    <>
      <StatusAlert message={editor.error} tone="destructive" />

      <ProductFormCard
        formLoading={editor.formLoading}
        form={editor.form}
        categories={editor.categories}
        categoriesLoading={editor.categoriesLoading}
        isOwner={isOwner}
        saving={editor.saving}
        isEditMode={isEditMode}
        getLabelClassName={editor.getLabelClassName}
        isFieldInvalid={editor.isFieldInvalid}
        onSubmit={editor.handleSubmit}
        onSaveAndAddAnother={editor.handleSaveAndAddAnother}
        onFormChange={editor.handleFormChange}
        onFieldBlur={editor.handleFieldBlur}
      />
    </>
  );
}
