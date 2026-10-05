import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

const VITE_PRELOAD_RETRY_KEY = "__lingkar_jaya_vite_preload_retry_at";
const VITE_PRELOAD_RETRY_WINDOW_MS = 10000;

if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();

    const lastRetryAt = Number(window.sessionStorage.getItem(VITE_PRELOAD_RETRY_KEY) || 0);

    if (Date.now() - lastRetryAt < VITE_PRELOAD_RETRY_WINDOW_MS) {
      return;
    }

    window.sessionStorage.setItem(VITE_PRELOAD_RETRY_KEY, String(Date.now()));
    window.location.reload();
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster richColors closeButton position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
