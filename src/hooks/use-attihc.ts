'use client';
import { useEffect, useMemo, useState } from "react";
import { DayEntry, Settings } from "@/types";
import { currentDateString } from "@/lib/date";
import { getSettings, loadSettingsFromStorage, setSettings as persistSettings, loadDaysFromStorage, setDays, exportDays, clearDays, importDays } from "@/lib/storage";
import { logger } from "@/lib/logger";

// Global State to share data between components
let globalSettings: Settings | null = null;
let globalDays: Record<string, DayEntry> | null = null;
let globalPrefersDark: boolean | null = null;
let globalThemeListenersReady = false;
let themeTransitionTimer: number | null = null;
const listeners = new Set<() => void>();
const EMPTY_DAYS: Record<string, DayEntry> = {};
let saveTimer: number | null = null;

const notify = () => {
  listeners.forEach(l => l());
};

const getPrefersDark = (): boolean => {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia) return false;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
};

const resolveIsDark = (theme: Settings["theme"], prefersDark: boolean): boolean => {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return prefersDark;
};

const applyThemeToDocument = (isDark: boolean, animate: boolean) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  try {
    if (animate) {
      if (themeTransitionTimer) window.clearTimeout(themeTransitionTimer);
      root.classList.add("theme-transition");
      themeTransitionTimer = window.setTimeout(() => {
        root.classList.remove("theme-transition");
        themeTransitionTimer = null;
      }, 240);
    }
  } catch {}

  if (isDark) root.classList.add("dark");
  else root.classList.remove("dark");

  try {
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch {}

  try {
    window.dispatchEvent(new CustomEvent("attihc:theme-changed", { detail: { resolvedTheme: isDark ? "dark" : "light" } }));
  } catch {}
};

const updateTheme = (theme: Settings["theme"], opts?: { animate?: boolean; prefersDark?: boolean }) => {
  const prefersDark = opts?.prefersDark ?? globalPrefersDark ?? getPrefersDark();
  const isDark = resolveIsDark(theme, prefersDark);
  applyThemeToDocument(isDark, opts?.animate ?? false);
  return { isDark, prefersDark };
};

export function useAttihc() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const l = () => forceUpdate({});
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  useEffect(() => {
    if (!globalSettings) {
      globalSettings = loadSettingsFromStorage();
      updateTheme(globalSettings.theme);
    }
    if (!globalDays) {
      globalDays = loadDaysFromStorage();
    }
    if (!globalThemeListenersReady && typeof window !== "undefined") {
      globalThemeListenersReady = true;
      try {
        const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
        if (mql) {
          globalPrefersDark = mql.matches;
          const handleChange = (e: { matches: boolean }) => {
            globalPrefersDark = e.matches;
            const theme = (globalSettings || getSettings()).theme;
            if (theme === "system" || theme === undefined) {
              updateTheme(theme, { animate: false, prefersDark: e.matches });
              notify();
            }
          };
          const anyMql = mql as unknown as {
            addEventListener?: (type: "change", listener: (e: { matches: boolean }) => void) => void;
            addListener?: (listener: (e: { matches: boolean }) => void) => void;
          };
          if (typeof anyMql.addEventListener === "function") anyMql.addEventListener("change", handleChange);
          else if (typeof anyMql.addListener === "function") anyMql.addListener(handleChange);
        }
      } catch (error) {
        try {
          logger.warn("[theme] prefers-color-scheme listener failed", { error });
        } catch {}
      }

      try {
        window.addEventListener("storage", (e: StorageEvent) => {
          if (e.key !== "attihc:settings") return;
          try {
            globalSettings = loadSettingsFromStorage();
            updateTheme(globalSettings.theme, { animate: false });
            notify();
          } catch (error) {
            try {
              logger.warn("[theme] storage sync failed", { error });
            } catch {}
          }
        });
      } catch (error) {
        try {
          logger.warn("[theme] storage listener failed", { error });
        } catch {}
      }
    }
    notify();
  }, []);

  const settings = globalSettings || getSettings();
  const days = globalDays || EMPTY_DAYS;
  
  const day = useMemo(() => currentDateString(settings.resetHour), [settings.resetHour]);
  const today = days[day];

  // Helper to update settings
  const updateSettings = (patch: Partial<Settings>) => {
    const next = { ...(globalSettings || getSettings()), ...patch };
    globalSettings = next;
    try {
      persistSettings(next);
    } catch (error) {
      try {
        logger.error("[settings] persist failed", { error, patch });
      } catch {}
    }
    if (patch.theme) {
      try {
        updateTheme(next.theme, { animate: true });
      } catch (error) {
        try {
          logger.error("[theme] update failed", { error, theme: next.theme });
        } catch {}
      }
    }
    notify();
    return next;
  };

  // Helper to update days
  const updateDaysState = (next: Record<string, DayEntry>) => {
    globalDays = next;
    notify();
    
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    saveTimer = window.setTimeout(() => {
      try {
        setDays(next);
      } catch (error) {
        try {
          logger.error("[days] persist failed", { error });
        } catch {}
      }
      saveTimer = null;
    }, 300);
  };

  const updateToday = (patch: Partial<DayEntry>) => {
    const cur = days[day] ?? { date: day, remember: "", complete: "", avoid: "", focus: "", scratch: "", createdAt: Date.now() };
    const next = { ...days, [day]: { ...cur, ...patch } };
    updateDaysState(next);
    return next;
  };

  const updateDay = (date: string, patch: Partial<DayEntry>) => {
     if (!days[date]) return days; 
     const next = { ...days, [date]: { ...days[date], ...patch } };
     updateDaysState(next);
     return next;
  };

  // Settings setters
  const setResetHour = (h: number) => updateSettings({ resetHour: h });
  const setQuiet = (q: boolean) => updateSettings({ quiet: q });
  const setShortcuts = (s: boolean) => updateSettings({ shortcuts: s });
  const setPasscode = (p: string | undefined) => updateSettings({ passcode: p });
  const setTheme = (t: "light" | "dark" | "system") => updateSettings({ theme: t });
  const setFeatures = (f: Settings['features']) => updateSettings({ features: f });
  const setLayoutOrder = (l: string[]) => updateSettings({ layoutOrder: l });
  const completeTutorial = () => updateSettings({ tutorialCompleted: true, tutorialStep: 0 });
  const setTutorialStep = (step: number) => updateSettings({ tutorialStep: step });

  const prefersDark = globalPrefersDark ?? getPrefersDark();
  const resolvedTheme: "light" | "dark" = resolveIsDark(settings.theme, prefersDark) ? "dark" : "light";
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  // Computed
  const history = useMemo(() => Object.values(days).sort((a: DayEntry, b: DayEntry) => a.date.localeCompare(b.date)).reverse(), [days]);
  
  const streak = useMemo(() => {
    const nonEmpty = (s?: string) => !!s && s.trim().length > 0;
    const hasEntry = (d: string) => {
      const e = days[d];
      if (!e) return false;
      return (
        nonEmpty(e.remember) ||
        nonEmpty(e.complete) ||
        nonEmpty(e.avoid) ||
        nonEmpty(e.focus) ||
        nonEmpty(e.scratch)
      );
    };
    const prevDate = (d: string) => {
      const [y, m, dd] = d.split("-").map((v) => parseInt(v, 10));
      if (!y || !m || !dd) return d;
      const base = new Date(y, m - 1, dd);
      base.setDate(base.getDate() - 1);
      const yy = base.getFullYear();
      const mm = (base.getMonth() + 1).toString().padStart(2, "0");
      const dd2 = base.getDate().toString().padStart(2, "0");
      return `${yy}-${mm}-${dd2}`;
    };
    if (!hasEntry(day)) {
      return 0;
    }
    let cursor = day;
    let count = 0;
    const seen = new Set<string>();
    while (!seen.has(cursor) && hasEntry(cursor)) {
      seen.add(cursor);
      count += 1;
      cursor = prevDate(cursor);
    }
    return count;
  }, [day, days]);

  const doExport = () => exportDays();
  const doImport = (raw: string) => {
    const res = importDays(raw);
    if (res) {
      globalDays = res;
      notify();
      return true;
    }
    return false;
  };
  const clearAll = () => {
    clearDays();
    globalDays = {};
    notify();
  };

  return { settings, resolvedTheme, toggleTheme, setResetHour, setQuiet, setShortcuts, setPasscode, setTheme, setFeatures, setLayoutOrder, completeTutorial, setTutorialStep, days, today, updateToday, updateDay, history, streak, doExport, doImport, clearAll };
}
