import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "lingkar_jaya_theme";
export const THEMES = {
  light: "light",
  dark: "dark",
  system: "system",
};

const ThemeContext = createContext(null);

function resolveInitialTheme() {
  if (typeof window === "undefined") {
    return THEMES.light;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === THEMES.dark || stored === THEMES.light || stored === THEMES.system) {
    return stored;
  }

  return THEMES.light;
}

function resolveSystemTheme() {
  if (typeof window === "undefined") {
    return THEMES.light;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? THEMES.dark : THEMES.light;
}

function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle("dark", theme === THEMES.dark);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(resolveInitialTheme);
  const [systemTheme, setSystemTheme] = useState(resolveSystemTheme);
  const resolvedTheme = theme === THEMES.system ? systemTheme : theme;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? THEMES.dark : THEMES.light);
    };

    mediaQuery.addEventListener?.("change", handleChange);
    mediaQuery.addListener?.(handleChange);

    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);
      mediaQuery.removeListener?.(handleChange);
    };
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, resolvedTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === THEMES.dark,
      setTheme,
      toggleTheme() {
        setTheme((current) => {
          if (current === THEMES.light) return THEMES.dark;
          if (current === THEMES.dark) return THEMES.system;
          return THEMES.light;
        });
      },
    }),
    [theme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme harus digunakan di dalam ThemeProvider");
  }
  return context;
}
