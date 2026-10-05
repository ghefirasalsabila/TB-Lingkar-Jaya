import { useState } from "react";
import { createUser, deactivateUser, updateUser } from "../../lib/api/users";
import { USER_ROLES } from "../../constants/roles";
import { validateUserForm } from "../../features/users/user-form-utils";
import { useConfirmableAction } from "../shared/useConfirmableAction";
import { runValidatedSubmitAction } from "../shared/submit-action";
import { buildUserPayload } from "./user-page-helpers";

export function useUserPageActions({
  isOwner,
  listState,
  dialogState,
  isEditMode,
  isDefaultOwnerEdit,
}) {
  const [saving, setSaving] = useState(false);
  const deleteAction = useConfirmableAction({
    beforeConfirm: () => listState.setError(""),
    onConfirm: async (targetUser) => {
      await deactivateUser(targetUser.id);
      await listState.reload();
    },
    onError: () => {
      // Error action sudah ditampilkan lewat toast global di interceptor API.
    },
  });

  async function handleSubmit(event) {
    if (!isOwner) {
      return;
    }

    await runValidatedSubmitAction({
      event,
      setRunning: setSaving,
      validate: () => {
        dialogState.setSubmitAttempted(true);
        return validateUserForm(dialogState.form, isEditMode);
      },
      onSubmit: async () => {
        const payload = buildUserPayload({
          form: dialogState.form,
          isEditMode,
          isDefaultOwnerEdit,
          editingItem: dialogState.editingItem,
        });

        if (isEditMode && dialogState.editingItem) {
          await updateUser(dialogState.editingItem.id, payload);
        } else {
          await createUser(payload);
        }

        dialogState.handleDialogOpenChange(false);
        await listState.reload();
      },
      onError: () => {
        // Error submit sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  function requestDeactivate(user) {
    if (!isOwner || user.role === USER_ROLES.OWNER) {
      return;
    }

    deleteAction.request(user);
  }

  return {
    saving,
    deleting: deleteAction.running,
    deleteTarget: deleteAction.target,
    handleSubmit,
    requestDeactivate,
    clearDeleteTarget: deleteAction.clear,
    confirmDeactivate: deleteAction.confirm,
  };
}
