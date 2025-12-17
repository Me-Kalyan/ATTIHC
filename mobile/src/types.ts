export type DayEntry = {
  date: string;
  remember: string;
  complete: string;
  avoid: string;
  focus?: string;
  scratch?: string;
  createdAt: number;
};

export type Settings = {
  resetHour: number;
  quiet: boolean;
  shortcuts: boolean;
  passcode?: string;
  theme?: "light" | "dark" | "system";
};

export type SavedNote = {
  id: string;
  text: string;
  createdAt: number;
};
