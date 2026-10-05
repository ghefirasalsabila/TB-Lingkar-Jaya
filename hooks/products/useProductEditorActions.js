import { useState } from "react";
import { getProductValidationMessages } from "../../features/products/product-form-utils";
import { saveProductEditor } from "./product-editor-api";
import { runValidatedSubmitAction } from "../shared/submit-action";

export function useProductEditorActions({
  form,
  isEditMode,
  routeEditId,
  isOwner,
  navigate,
  resetForm,
  setError,
  setSubmitAttempted,
}) {
  const [saving, setSaving] = useState(false);

  async function submitForm({ keepOpen = false } = {}) {
    await runValidatedSubmitAction({
      setRunning: setSaving,
      validate: () => {
        setSubmitAttempted(true);
        return getProductValidationMessages(form);
      },
      formatValidationMessage: (issues) => issues.join("; "),
      onSubmit: async () => {
        setError("");

        const savedProduct = await saveProductEditor({
          form,
          isEditMode,
          routeEditId,
          isOwner,
        });

        if (keepOpen && !isEditMode && savedProduct?.id) {
          resetForm();
          return;
        }

        navigate("/admin/products");
      },
      onError: () => {
        // Error create/update sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await submitForm({ keepOpen: false });
  }

  async function handleSaveAndAddAnother() {
    await submitForm({ keepOpen: true });
  }

  return {
    saving,
    handleSubmit,
    handleSaveAndAddAnother,
  };
}
