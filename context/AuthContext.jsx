import { createContext, useContext, useMemo, useState } from "react";
import { loginRequest } from "../lib/api/auth";
import { STORAGE_KEYS } from "../lib/storage";

const AuthContext = createContext(null);

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.token) || "");
  const [user, setUser] = useState(getStoredUser());

  const isAuthenticated = Boolean(token);

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role || "",
      isAuthenticated,
      async login(payload) {
        const data = await loginRequest(payload);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.token, data.token);
        if (data.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
        }
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
        return data;
      },
      logout() {
        setToken("");
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
        localStorage.removeItem(STORAGE_KEYS.user);
      },
      updateSessionUser(nextUser) {
        setUser(nextUser);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
      },
    }),
    [isAuthenticated, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
