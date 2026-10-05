import { useCallback, useState } from "react";

export function useEntityDialogState({
  createEmptyForm,
  mapItemToForm,
  getItemId = (item) => item?.id || "",
}) {
  const [form, setForm] = useState(createEmptyForm);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const resetState = useCallback(() => {
    setForm(createEmptyForm());
    setEditingItem(null);
    setSubmitAttempted(false);
  }, [createEmptyForm]);

  const editingId = editingItem ? getItemId(editingItem) : "";

  function handleFormChange(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function openCreate() {
    resetState();
    setDialogOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setForm(mapItemToForm(item));
    setSubmitAttempted(false);
    setDialogOpen(true);
  }

  function handleDialogOpenChange(open, { blocked = false } = {}) {
    if (blocked) return;
    setDialogOpen(open);
    if (!open) {
      resetState();
    }
  }

  return {
    form,
    setForm,
    editingItem,
    editingId,
    dialogOpen,
    submitAttempted,
    setSubmitAttempted,
    handleFormChange,
    openCreate,
    openEdit,
    handleDialogOpenChange,
    resetState,
  };
}
