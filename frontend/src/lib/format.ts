/** Small, dependency-free date helpers. All inputs are ISO strings. */

const TZ = "America/New_York";

export function fmtTime(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ })
    .replace(" ", " ")
    .toLowerCase();
}

export function fmtDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", timeZone: TZ });
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  });
}

export function fmtShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ });
}

export function fmtDue(iso: string, now = new Date()): string {
  const due = new Date(iso);
  const ms = due.getTime() - now.getTime();
  const hours = ms / 36e5;
  if (hours < 0) return "overdue";
  if (hours < 24) return `today, ${fmtTime(iso)}`;
  if (hours < 48) return `tomorrow, ${fmtTime(iso)}`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${fmtDay(iso)}, ${fmtTime(iso)}`;
  return fmtShortDate(iso);
}

export function fmtHours(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = minutes / 60;
  return Number.isInteger(h) ? `${h} h` : `${h.toFixed(1)} h`;
}

export function isSameDay(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}
