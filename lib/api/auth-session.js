import axios from "axios";
import { STORAGE_KEYS } from "../storage";

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

export function forceLogout() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.user);
  window.location.href = "/login";
}

export function attachAccessToken(config) {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export function shouldRefreshAuth(error, originalRequest) {
  if (error.response?.status !== 401 || originalRequest._retry) {
    return false;
  }

  return !(
    originalRequest.url?.includes("/auth/login") ||
    originalRequest.url?.includes("/auth/refresh")
  );
}

export function getStoredRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
}

export function queuePendingRequest(originalRequest, api) {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  })
    .then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    });
}

export async function refreshAuthSession({
  originalRequest,
  refreshToken,
  api,
  resolveApiBaseUrl,
}) {
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const { data } = await axios.post(`${resolveApiBaseUrl()}/auth/refresh`, {
      refreshToken,
    });

    const newToken = data?.data?.token;
    const newRefreshToken = data?.data?.refreshToken;
    const newUser = data?.data?.user;

    if (!newToken) {
      throw new Error("No token in refresh response");
    }

    localStorage.setItem(STORAGE_KEYS.token, newToken);
    if (newRefreshToken) {
      localStorage.setItem(STORAGE_KEYS.refreshToken, newRefreshToken);
    }
    if (newUser) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(newUser));
    }

    api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    originalRequest.headers.Authorization = `Bearer ${newToken}`;

    processQueue(null, newToken);
    return api(originalRequest);
  } catch (refreshError) {
    processQueue(refreshError, null);
    throw refreshError;
  } finally {
    isRefreshing = false;
  }
}

export function getRefreshState() {
  return { isRefreshing };
}
