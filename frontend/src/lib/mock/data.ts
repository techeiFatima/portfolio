/**
 * MOCK DATA — Milestone 1 only.
 *
 * Every record here is labeled source: "mock". None of it is real academic
 * information. Dates are generated relative to "now" so the UI always looks
 * current. Replaced by the FastAPI backend in Milestone 2+.
 */
import type {
  Assignment,
  Briefing,
  CalendarEvent,
  Course,
  PlanBlock,
  PlanSummary,
  Resource,
} from "../types";

const TZ = "America/New_York";

/** ISO date (YYYY-MM-DD) of `now` in New York. */
export function todayISO(now = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: TZ });
}

function nyOffset(dateISO: string): string {
  const probe = new Date(`${dateISO}T12:00:00Z`);
  const part = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(probe)
    .find((p) => p.type === "timeZoneName")?.value; // e.g. "GMT-04:00"
  return part?.replace("GMT", "") || "-05:00";
}

/** Build an ISO timestamp for `dayOffset` days from today at hh:mm New York time. */
export function at(dayOffset: number, hh: number, mm = 0, now = new Date()): string {
  const base = new Date(`${todayISO(now)}T12:00:00Z`);
  base.setUTCDate(base.getUTCDate() + dayOffset);
  const date = base.toISOString().slice(0, 10);
  const h = String(hh).padStart(2, "0");
  const m = String(mm).padStart(2, "0");
  return new Date(`${date}T${h}:${m}:00${nyOffset(date)}`).toISOString();
}

export const courses: Course[] = [
  { id: 1, code: "6.1210", name: "Introduction to Algorithms", color: "#4f6d8f", source: "mock",
    currentGrade: { score: 91.2, letter: "A", source: "mock" } },
  { id: 2, code: "7.012", name: "Introductory Biology", color: "#6f8f6a", source: "mock",
    currentGrade: { score: 87.5, letter: "B+", source: "mock" } },
  { id: 3, code: "18.06", name: "Linear Algebra", color: "#9a6f5a", source: "mock" },
  { id: 4, code: "21W.022", name: "Writing Autobiography", color: "#8a6f93", source: "mock",
    currentGrade: { score: 94.0, letter: "A", source: "mock" } },
];

export const assignments: Assignment[] = [
  { id: 101, courseId: 1, title: "Problem Set 5: Dynamic Programming", kind: "assignment",
    dueAt: at(2, 22), source: "mock", status: "in_progress", statusSource: "mock",
    pointsPossible: 100, estimatedMinutes: 360, estimateSource: "engine", completedMinutes: 150, priority: 1 },
  { id: 102, courseId: 2, title: "Exam 2: Genetics & Molecular Biology", kind: "exam",
    dueAt: at(5, 9), source: "mock", status: "not_started", statusSource: "mock",
    estimatedMinutes: 480, estimateSource: "engine", completedMinutes: 90, priority: 1 },
  { id: 103, courseId: 3, title: "PSet 6: Eigenvalues", kind: "assignment",
    dueAt: at(3, 16), source: "mock", status: "not_started", statusSource: "mock",
    pointsPossible: 50, estimatedMinutes: 180, estimateSource: "engine", completedMinutes: 0, priority: 2 },
  { id: 104, courseId: 4, title: "Essay 3 draft: A turning point", kind: "assignment",
    dueAt: at(6, 23, 59), source: "mock", status: "not_started", statusSource: "mock",
    pointsPossible: 100, estimateSource: "engine", estimatedMinutes: 240, completedMinutes: 0, priority: 3 },
  { id: 105, courseId: 2, title: "Pre-lecture reading: Ch. 14", kind: "reading",
    dueAt: at(1, 10), source: "mock", status: "not_started", statusSource: "mock",
    estimatedMinutes: 45, estimateSource: "engine", completedMinutes: 0, priority: 3 },
  { id: 106, courseId: 1, title: "Problem Set 4: Graph Algorithms", kind: "assignment",
    dueAt: at(-5, 22), source: "mock", status: "graded", statusSource: "mock",
    pointsPossible: 100, score: 94, estimatedMinutes: 300, estimateSource: "engine", completedMinutes: 320, priority: 3 },
  { id: 107, courseId: 3, title: "Quiz 2", kind: "quiz",
    dueAt: at(-2, 12), source: "mock", status: "submitted", statusSource: "mock",
    pointsPossible: 20, estimatedMinutes: 60, estimateSource: "engine", completedMinutes: 60, priority: 3 },
  { id: 108, courseId: 4, title: "Peer review: two classmates' drafts", kind: "assignment",
    dueAt: at(9, 23, 59), source: "mock", status: "not_started", statusSource: "mock",
    estimatedMinutes: 90, estimateSource: "engine", completedMinutes: 0, priority: 4 },
];

function dayEvents(d: number): CalendarEvent[] {
  // A plausible MIT weekly pattern; weekend days get fewer events.
  const dow = new Date(at(d, 12)).getUTCDay();
  const base = 100 + d * 10;
  if (dow === 0 || dow === 6) {
    return [
      { id: base + 1, title: "Brunch with Maya", startsAt: at(d, 11), endsAt: at(d, 12, 30), category: "personal", source: "mock" },
    ];
  }
  const ev: CalendarEvent[] = [
    { id: base + 1, title: "6.1210 Lecture", startsAt: at(d, 10), endsAt: at(d, 11), category: "class", location: "26-100", source: "mock" },
    { id: base + 2, title: "18.06 Lecture", startsAt: at(d, 13), endsAt: at(d, 14), category: "class", location: "10-250", source: "mock" },
  ];
  if (dow === 1 || dow === 3) ev.push({ id: base + 3, title: "7.012 Lecture", startsAt: at(d, 11), endsAt: at(d, 12), category: "class", location: "10-250", source: "mock" });
  if (dow === 2 || dow === 4) ev.push({ id: base + 4, title: "UROP: lab meeting", startsAt: at(d, 15), endsAt: at(d, 16, 30), category: "research", location: "32-G", source: "mock" });
  if (dow === 2) ev.push({ id: base + 5, title: "Club exec meeting", startsAt: at(d, 19), endsAt: at(d, 20), category: "meeting", source: "mock" });
  if (dow === 5) ev.push({ id: base + 6, title: "Dinner with friends", startsAt: at(d, 19), endsAt: at(d, 21), category: "personal", source: "mock" });
  return ev;
}

export function eventsForOffset(d: number): CalendarEvent[] {
  return dayEvents(d);
}

export const blocks: PlanBlock[] = [
  { id: 201, assignmentId: 101, courseId: 1, label: "PSet 5 · DP recurrences", startsAt: at(0, 14, 15), endsAt: at(0, 16, 15), plannedMinutes: 120, status: "planned" },
  { id: 202, assignmentId: 102, courseId: 2, label: "Exam 2 · genetics review", startsAt: at(0, 17), endsAt: at(0, 18, 30), plannedMinutes: 90, status: "planned" },
  { id: 203, assignmentId: 105, courseId: 2, label: "Reading · Ch. 14", startsAt: at(0, 20, 30), endsAt: at(0, 21, 15), plannedMinutes: 45, status: "planned" },
  { id: 204, assignmentId: 101, courseId: 1, label: "PSet 5 · finish & write-up", startsAt: at(1, 14, 15), endsAt: at(1, 16, 15), plannedMinutes: 120, status: "planned" },
  { id: 205, assignmentId: 103, courseId: 3, label: "PSet 6 · eigenvalues", startsAt: at(1, 17), endsAt: at(1, 18, 30), plannedMinutes: 90, status: "planned" },
  { id: 206, assignmentId: 103, courseId: 3, label: "PSet 6 · finish", startsAt: at(2, 14, 15), endsAt: at(2, 15, 45), plannedMinutes: 90, status: "planned" },
  { id: 207, assignmentId: 102, courseId: 2, label: "Exam 2 · molecular bio", startsAt: at(2, 16), endsAt: at(2, 18), plannedMinutes: 120, status: "planned" },
  { id: 208, assignmentId: 102, courseId: 2, label: "Exam 2 · practice problems", startsAt: at(3, 17), endsAt: at(3, 19, 30), plannedMinutes: 150, status: "planned" },
  { id: 209, assignmentId: 104, courseId: 4, label: "Essay 3 · outline & draft", startsAt: at(4, 14), endsAt: at(4, 16, 30), plannedMinutes: 150, status: "planned" },
  { id: 210, assignmentId: 102, courseId: 2, label: "Exam 2 · final review", startsAt: at(4, 17), endsAt: at(4, 18, 30), plannedMinutes: 90, status: "planned" },
  { id: 211, assignmentId: 104, courseId: 4, label: "Essay 3 · revise", startsAt: at(5, 13), endsAt: at(5, 14, 30), plannedMinutes: 90, status: "planned" },
  { id: 212, assignmentId: 101, courseId: 1, label: "PSet 5 · DP warm-up", startsAt: at(-1, 14, 15), endsAt: at(-1, 16, 15), plannedMinutes: 120, status: "done", actualMinutes: 150 },
];

export const planSummary: PlanSummary = {
  feasibility: "tight",
  requiredMinutes: 1095,
  availableMinutes: 1260,
  warnings: [
    "Exam 2 preparation is 6.5 h over 5 days; one missed block would make the week infeasible.",
    "Essay 3 is scheduled with 1 day of slack. Consider starting the outline earlier.",
  ],
  generatedAt: at(0, 7, 30),
  source: "mock",
};

export const resources: Resource[] = [
  { id: 301, courseId: 1, assignmentId: 101, name: "L12 Dynamic Programming I.pdf", mimeType: "application/pdf", url: "#", source: "mock", linkConfidence: 0.92 },
  { id: 302, courseId: 1, assignmentId: 101, name: "L13 Dynamic Programming II.pdf", mimeType: "application/pdf", url: "#", source: "mock", linkConfidence: 0.9 },
  { id: 303, courseId: 1, name: "6.1210 lecture notes.gdoc", mimeType: "application/vnd.google-apps.document", url: "#", source: "mock", linkConfidence: 0.8 },
  { id: 304, courseId: 2, assignmentId: 102, name: "7.012 Exam 2 study guide.pdf", mimeType: "application/pdf", url: "#", source: "mock", linkConfidence: 0.95 },
  { id: 305, courseId: 2, name: "Genetics lecture slides wk 7.pptx", mimeType: "application/vnd.ms-powerpoint", url: "#", source: "mock", linkConfidence: 0.7 },
  { id: 306, courseId: 3, name: "18.06 Strang Ch. 6 scan.pdf", mimeType: "application/pdf", url: "#", source: "mock", linkConfidence: 0.55 },
  { id: 307, courseId: 4, assignmentId: 104, name: "Essay 3 prompt.gdoc", mimeType: "application/vnd.google-apps.document", url: "#", source: "mock", linkConfidence: 0.9 },
];

export const briefing: Briefing = {
  text:
    "Good morning. Problem Set 5 is due in two days and you're about 40% through it, so it leads today. " +
    "The biology exam is in five days; today's 90-minute review keeps you on pace. " +
    "The week is tight but feasible if today's blocks happen.",
  generatedAt: at(0, 7, 30),
  source: "mock",
};
