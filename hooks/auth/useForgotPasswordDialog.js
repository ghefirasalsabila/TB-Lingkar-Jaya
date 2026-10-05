import { useMemo, useState } from "react";
import { forgotPasswordRequest } from "../../lib/api/auth";
import { runSubmitAction } from "../shared/submit-action";

export function useForgotPasswordDialog({ open, onOpenChange, initialEmail = "" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const normalizedInitialEmail = useMemo(
    () => String(initialEmail || "").trim().toLowerCase(),
    [initialEmail],
  );
  const effectiveEmail = open && !email ? normalizedInitialEmail : email;

  function resetState() {
    setEmail("");
  }

  function handleOpenChange(open) {
    onOpenChange(open);

    if (!open) {
      resetState();
    }
  }

  async function handleSubmit(event) {
    await runSubmitAction({
      event,
      setRunning: setLoading,
      onSubmit: async () => {
        await forgotPasswordRequest({ email: effectiveEmail });
        handleOpenChange(false);
      },
      onError: () => {
        // Error submit sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  return {
    email: effectiveEmail,
    loading,
    setEmail,
    handleOpenChange,
    handleSubmit,
  };
}
