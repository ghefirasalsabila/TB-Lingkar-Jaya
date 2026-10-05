import { toast } from "sonner";
import { useState } from "react";
import { changePasswordRequest } from "../../lib/api/auth";
import { isStrongPassword, PASSWORD_POLICY_MESSAGE } from "../../lib/password-policy";
import { runSubmitAction } from "../shared/submit-action";

export function useProfilePasswordState() {
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  function cancelPasswordEdit() {
    setEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
  }

  async function handlePasswordSubmit(event) {
    if (!isStrongPassword(newPassword)) {
      event?.preventDefault?.();
      toast.error(PASSWORD_POLICY_MESSAGE);
      return;
    }

    await runSubmitAction({
      event,
      setRunning: setPasswordLoading,
      onSubmit: async () => {
        await changePasswordRequest({ currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
        setEditingPassword(false);
      },
      onError: () => {
        // Error submit sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  return {
    editingPassword,
    currentPassword,
    newPassword,
    passwordLoading,
    forgotPasswordOpen,
    setEditingPassword,
    setCurrentPassword,
    setNewPassword,
    setForgotPasswordOpen,
    cancelPasswordEdit,
    handlePasswordSubmit,
  };
}
