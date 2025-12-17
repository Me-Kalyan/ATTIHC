export function currentDateString(resetHour: number) {
  const now = new Date();
  const local = new Date(now.getTime());
  const hour = local.getHours();
  if (hour < resetHour) local.setDate(local.getDate() - 1);
  const y = local.getFullYear();
  const m = (local.getMonth() + 1).toString().padStart(2, "0");
  const d = local.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

