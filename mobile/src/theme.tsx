import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { loadSettingsFromStorage, setSettings } from "./lib/storage";
import type { Settings } from "./types";

type ThemeValue = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeValue;
  isDark: boolean;
  setTheme: (t: ThemeValue) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  isDark: false,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeValue>("system");
  const isDark = useMemo(() => {
    if (theme === "system") return systemScheme === "dark";
    return theme === "dark";
  }, [theme, systemScheme]);

  useEffect(() => {
    (async () => {
      const s = await loadSettingsFromStorage();
      const t = s.theme === "dark" || s.theme === "light" || s.theme === "system" ? s.theme : "system";
      setThemeState(t);
    })();
  }, []);

  const setTheme = async (t: ThemeValue) => {
    setThemeState(t);
    const s = await loadSettingsFromStorage();
    const next: Settings = { ...s, theme: t };
    await setSettings(next);
  };

  return <ThemeContext.Provider value={{ theme, isDark, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

