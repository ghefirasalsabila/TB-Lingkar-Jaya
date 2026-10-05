import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordRequest, resetPasswordRequest } from "../../lib/api/auth";
import { isStrongPassword, PASSWORD_POLICY_MESSAGE } from "../../lib/password-policy";
import { runSubmitAction } from "../shared/submit-action";

export function useForgotPasswordPage() {
  const navigate = useNavigate();
  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token") || ""
      : "";
  const isResetMode = useMemo(() => token.trim().length > 0, [token]);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    if (isResetMode && newPassword !== confirmPassword) {
      event?.preventDefault?.();
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (isResetMode && !isStrongPassword(newPassword)) {
      event?.preventDefault?.();
      toast.error(PASSWORD_POLICY_MESSAGE);
      return;
    }

    await runSubmitAction({
      event,
      setRunning: setLoading,
      onSubmit: async () => {
        if (isResetMode) {
          await resetPasswordRequest({ token, newPassword });
          navigate("/login", { replace: true });
          return;
        }

        await forgotPasswordRequest({ email });
      },
      onError: () => {
        // Error submit sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  return {
    token,
    isResetMode,
    email,
    newPassword,
    confirmPassword,
    loading,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
  };
}
