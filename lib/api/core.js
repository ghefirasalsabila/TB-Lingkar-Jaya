import axios from "axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "../api-error";
import {
  attachAccessToken,
  forceLogout,
  getRefreshState,
  getStoredRefreshToken,
  queuePendingRequest,
  refreshAuthSession,
  shouldRefreshAuth,
} from "./auth-session";
import {
  resolveDefaultErrorMessage,
  resolveDefaultSuccessMessage,
} from "./toast-feedback";

function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;

  if (typeof configured === "string" && configured.trim().length > 0) {
    return configured.replace(/\/+$/, "");
  }

  return "/api";
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.request.use(attachAccessToken);

api.interceptors.response.use(
  (response) => {
    const method = response?.config?.method?.toLowerCase();
    const isMutation = ["post", "put", "patch", "delete"].includes(method || "");
    if (isMutation && !response?.config?.skipSuccessToast) {
      toast.success(response?.config?.successMessage || resolveDefaultSuccessMessage(response?.config));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (shouldRefreshAuth(error, originalRequest)) {
      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      if (getRefreshState().isRefreshing) {
        return queuePendingRequest(originalRequest, api).catch((refreshError) => Promise.reject(refreshError));
      }

      try {
        return await refreshAuthSession({
          originalRequest,
          refreshToken,
          api,
          resolveApiBaseUrl,
        });
      } catch (refreshError) {
        forceLogout();
        return Promise.reject(refreshError);
      }
    }

    const config = error?.config || {};
    if (!config.skipErrorToast) {
      const fallback = config.errorMessage || resolveDefaultErrorMessage(config);
      toast.error(getApiErrorMessage(error, fallback));
    }
    return Promise.reject(error);
  },
);
