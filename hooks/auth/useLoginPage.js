import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { runSubmitAction } from "../shared/submit-action";

export function useLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    await runSubmitAction({
      event,
      setRunning: setLoading,
      onSubmit: async () => {
        await login({ email, password });
        const redirectPath = location.state?.from?.pathname || "/admin/dashboard";
        navigate(redirectPath, { replace: true });
      },
      onError: () => {
        // Error login sudah ditampilkan lewat toast global di interceptor API.
      },
    });
  }

  return {
    email,
    password,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
