import { useState } from "react";
import { requestCurrentUserEmailChange } from "../../lib/api/users";
import { runSubmitAction } from "../shared/submit-action";

export function useProfileEmailChangeState({ onRequested, getInitialEmail }) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailChangeNoticeOpen, setEmailChangeNoticeOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailChangeCurrentPassword, setEmailChangeCurrentPassword] = useState("");
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [requestedCurrentEmail, setRequestedCurrentEmail] = useState("");
  const [requestedNewEmail, setRequestedNewEmail] = useState("");

  function resetEmailChangeForm() {
    setNewEmail("");
    setEmailChangeCurrentPassword("");
  }

  function handleEmailDialogOpenChange(open) {
    setEmailDialogOpen(open);

    if (open) {
      setNewEmail(getInitialEmail?.() || "");
      setEmailChangeCurrentPassword("");
      return;
    }

    if (!open) {
      resetEmailChangeForm();
    }
  }

  async function handleEmailChangeSubmit(event) {
    await runSubmitAction({
      event,
      setRunning: setEmailChangeLoading,
      onSubmit: async () => {
        const response = await requestCurrentUserEmailChange({
          newEmail,
          currentPassword: emailChangeCurrentPassword,
        });

        setRequestedCurrentEmail(getInitialEmail?.() || "");
        setRequestedNewEmail(response?.pendingEmailChange?.newEmail || newEmail);
        handleEmailDialogOpenChange(false);
        setEmailChangeNoticeOpen(true);
        await onRequested?.(response);
      },
      onError: () => {
        // Error submit sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  return {
    emailDialogOpen,
    emailChangeNoticeOpen,
    newEmail,
    emailChangeCurrentPassword,
    emailChangeLoading,
    requestedCurrentEmail,
    requestedNewEmail,
    setNewEmail,
    setEmailChangeCurrentPassword,
    setEmailChangeNoticeOpen,
    handleEmailDialogOpenChange,
    handleEmailChangeSubmit,
  };
}
