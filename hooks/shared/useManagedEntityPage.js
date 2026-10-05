import { useState } from "react";
import { useConfirmableAction } from "./useConfirmableAction";
import { useEntityDialogState } from "./useEntityDialogState";
import { usePaginatedCollection } from "./usePaginatedCollection";
import { runValidatedSubmitAction } from "./submit-action";

export function useManagedEntityPage({
  isOwner,
  defaultPage,
  defaultLimit,
  fetchPage,
  errorMessage,
  createEmptyForm,
  mapItemToForm,
  validateForm,
  buildPayload,
  createItem,
  updateItem,
  deleteItem,
}) {
  const [saving, setSaving] = useState(false);

  const listState = usePaginatedCollection({
    defaultPage,
    defaultLimit,
    fetchPage,
    errorMessage,
  });

  const dialogState = useEntityDialogState({
    createEmptyForm,
    mapItemToForm,
  });

  const isEditMode = Boolean(dialogState.editingId);
  const deleteAction = useConfirmableAction({
    beforeConfirm: () => listState.setError(""),
    onConfirm: async (targetItem) => {
      await deleteItem(targetItem.id);
      await listState.reload();
    },
    onError: () => {
      // Error action sudah ditampilkan lewat toast global di interceptor API.
    },
  });

  async function handleSubmit(event) {
    await runValidatedSubmitAction({
      event,
      setRunning: setSaving,
      validate: () => {
        dialogState.setSubmitAttempted(true);

        return validateForm({
          form: dialogState.form,
          isEditMode,
          isOwner,
          editingItem: dialogState.editingItem,
        });
      },
      onSubmit: async () => {
        const payload = buildPayload({
          form: dialogState.form,
          isEditMode,
          isOwner,
          editingItem: dialogState.editingItem,
        });

        if (dialogState.editingId) {
          await updateItem(dialogState.editingId, payload);
        } else {
          await createItem(payload);
        }

        dialogState.handleDialogOpenChange(false);
        await listState.reload();
      },
      onError: () => {
        // Error submit sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  function requestDelete(item) {
    deleteAction.request(item);
  }

  return {
    form: dialogState.form,
    editingId: dialogState.editingId,
    formOpen: dialogState.dialogOpen,
    submitAttempted: dialogState.submitAttempted,
    loading: listState.loading,
    saving,
    deleting: deleteAction.running,
    deleteTarget: deleteAction.target,
    searchQuery: listState.searchQuery,
    page: listState.page,
    paginationMeta: listState.paginationMeta,
    error: listState.error,
    handleSearchChange: listState.handleSearchChange,
    setPage: listState.setPage,
    handleFormChange: dialogState.handleFormChange,
    openCreate: dialogState.openCreate,
    openEdit: dialogState.openEdit,
    handleFormOpenChange: (open) => dialogState.handleDialogOpenChange(open, { blocked: saving }),
    handleSubmit,
    requestDelete,
    clearDeleteTarget: deleteAction.clear,
    confirmDelete: deleteAction.confirm,
    isEditMode,
    items: listState.items,
  };
}
