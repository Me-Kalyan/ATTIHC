import { DayEntry, Settings } from "@/types";

const DAYS_KEY = "attihc:days";
const SETTINGS_KEY = "attihc:settings";

export function getSettings(): Settings {
  return { 
    resetHour: 0, 
    quiet: false, 
    shortcuts: true, 
    theme: "system",
    features: {
      focusTimer: false,
      quickNotes: false,
      dailyInspiration: false,
      waterTracker: false,
      priorityMatrix: false,
      quickActions: false,
    },
    tutorialCompleted: false
  };
}

export function loadSettingsFromStorage(): Settings {
  if (typeof window === "undefined") return getSettings();
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return getSettings();
  try {
    const obj = JSON.parse(raw);
    return {
      resetHour: typeof obj.resetHour === "number" ? obj.resetHour : 0,
      quiet: typeof obj.quiet === "boolean" ? obj.quiet : false,
      shortcuts: typeof obj.shortcuts === "boolean" ? obj.shortcuts : true,
      passcode: typeof obj.passcode === "string" ? obj.passcode : undefined,
      theme: obj.theme === "dark" || obj.theme === "light" || obj.theme === "system" ? obj.theme : "system",
      features: {
        focusTimer: obj.features?.focusTimer ?? false,
        quickNotes: obj.features?.quickNotes ?? false,
        dailyInspiration: obj.features?.dailyInspiration ?? false,
        waterTracker: obj.features?.waterTracker ?? false,
        priorityMatrix: obj.features?.priorityMatrix ?? false,
        quickActions: obj.features?.quickActions ?? false,
      },
      layoutOrder: Array.isArray(obj.layoutOrder) ? obj.layoutOrder : undefined,
      tutorialCompleted: typeof obj.tutorialCompleted === "boolean" ? obj.tutorialCompleted : false,
      tutorialStep: typeof obj.tutorialStep === "number" ? obj.tutorialStep : 0,
    };
  } catch {
    return getSettings();
  }
}

export function setSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function getDays(): Record<string, DayEntry> {
  return {};
}

export function loadDaysFromStorage(): Record<string, DayEntry> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(DAYS_KEY);
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

export function setDays(r: Record<string, DayEntry>) {
  localStorage.setItem(DAYS_KEY, JSON.stringify(r));
}

export function importDays(raw: string): Record<string, DayEntry> | null {
  if (typeof window === "undefined") return null;
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return null;
    const result: Record<string, DayEntry> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (!value || typeof value !== "object") continue;
      const v = value as Record<string, unknown>;
      const date = typeof v.date === "string" ? v.date : key;
      const remember = typeof v.remember === "string" ? v.remember : "";
      const complete = typeof v.complete === "string" ? v.complete : "";
      const avoid = typeof v.avoid === "string" ? v.avoid : "";
      const focus = typeof v.focus === "string" ? v.focus : "";
      const scratch = typeof v.scratch === "string" ? v.scratch : "";
      const createdAt = typeof v.createdAt === "number" ? v.createdAt : Date.now();
      const favorite = typeof v.favorite === "boolean" ? v.favorite : false;
      result[key] = { date, remember, complete, avoid, focus, scratch, createdAt, favorite };
    }
    setDays(result);
    return result;
  } catch {
    return null;
  }
}

export function exportDays(): string {
  return typeof window === "undefined" ? "{}" : localStorage.getItem(DAYS_KEY) ?? "{}";
}

export function clearDays() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DAYS_KEY);
}
