import AsyncStorage from "@react-native-async-storage/async-storage";

import { DayEntry, Settings, SavedNote } from "../types";

const DAYS_KEY = "attihc:days";
const SETTINGS_KEY = "attihc:settings";
const SAVED_KEY = "attihc:saved";

export async function getSettings(): Promise<Settings> {
  return { resetHour: 0, quiet: false, shortcuts: true, theme: "system" };
}

export async function loadSettingsFromStorage(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return { resetHour: 0, quiet: false, shortcuts: true };
  try {
    const obj = JSON.parse(raw);
    return {
      resetHour: typeof obj.resetHour === "number" ? obj.resetHour : 0,
      quiet: typeof obj.quiet === "boolean" ? obj.quiet : false,
      shortcuts: typeof obj.shortcuts === "boolean" ? obj.shortcuts : true,
      passcode: typeof obj.passcode === "string" ? obj.passcode : undefined,
      theme: obj.theme === "dark" || obj.theme === "light" || obj.theme === "system" ? obj.theme : "system",
    };
  } catch {
    return { resetHour: 0, quiet: false, shortcuts: true, theme: "system" };
  }
}

export async function setSettings(s: Settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export async function loadDaysFromStorage(): Promise<Record<string, DayEntry>> {
  const raw = await AsyncStorage.getItem(DAYS_KEY);
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

export async function setDays(r: Record<string, DayEntry>) {
  await AsyncStorage.setItem(DAYS_KEY, JSON.stringify(r));
}

export async function loadSavedFromStorage(): Promise<SavedNote[]> {
  const raw = await AsyncStorage.getItem(SAVED_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    const result: SavedNote[] = [];
    for (const item of arr) {
      if (!item || typeof item !== "object") continue;
      const v = item as Record<string, unknown>;
      const text = typeof v.text === "string" ? v.text : "";
      const id = typeof v.id === "string" ? v.id : String(Date.now());
      const createdAt = typeof v.createdAt === "number" ? v.createdAt : Date.now();
      result.push({ id, text, createdAt });
    }
    return result;
  } catch {
    return [];
  }
}

export async function setSavedNotes(arr: SavedNote[]) {
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(arr));
}

export async function clearDays() {
  await AsyncStorage.removeItem(DAYS_KEY);
}
