export type DayEntry = {
  date: string;
  remember: string;
  complete: string;
  avoid: string;
  focus?: string;
  scratch?: string;
  createdAt: number;
  favorite?: boolean;
};

export type Settings = {
  resetHour: number;
  quiet: boolean;
  shortcuts: boolean;
  passcode?: string;
  theme?: "light" | "dark" | "system";
  features?: {
    focusTimer?: boolean;
    quickNotes?: boolean;
    dailyInspiration?: boolean;
    waterTracker?: boolean;
    priorityMatrix?: boolean;
    quickActions?: boolean;
  };
  layoutOrder?: string[];
  tutorialCompleted?: boolean;
  tutorialStep?: number;
};
