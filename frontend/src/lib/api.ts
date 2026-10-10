/**
 * Data access layer used by every view.
 *
 * Milestone 1: NEXT_PUBLIC_DATA_MODE=mock (default) → returns mock data.
 * Milestone 2+: the same functions call the FastAPI backend, so the views do
 * not change. Keep every function async for that reason.
 */
import type { AssistantReply, CoursesData, TodayData, WeekData } from "./types";
import * as mock from "./mock/data";

export const DATA_MODE = process.env.NEXT_PUBLIC_DATA_MODE ?? "mock";
export const IS_MOCK = DATA_MODE === "mock";

function notImplemented(): never {
  throw new Error(
    `NEXT_PUBLIC_DATA_MODE=${DATA_MODE} is not available yet. The FastAPI backend arrives in Milestone 2.`,
  );
}

const open = (s: { status: string }) => !["submitted", "graded", "excused"].includes(s.status);

export async function getToday(now = new Date()): Promise<TodayData> {
  if (!IS_MOCK) notImplemented();
  const date = mock.todayISO(now);
  const weekAhead = now.getTime() + 7 * 864e5;
  const openAssignments = mock.assignments.filter(open);
  // Priorities: the engine's top three by urgency. Mocked here by priority then due date.
  const priorities = [...openAssignments]
    .sort((a, b) => a.priority - b.priority || a.dueAt.localeCompare(b.dueAt))
    .slice(0, 3);
  const urgent = openAssignments
    .filter((a) => new Date(a.dueAt).getTime() <= weekAhead)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  return {
    date,
    briefing: mock.briefing,
    priorities,
    events: mock.eventsForOffset(0),
    blocks: mock.blocks.filter((b) => b.startsAt.slice(0, 10) === mock.at(0, 12).slice(0, 10)),
    urgent,
    courses: mock.courses,
  };
}

export async function getWeek(startOffset = 0): Promise<WeekData> {
  if (!IS_MOCK) notImplemented();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = startOffset + i;
    const date = mock.at(d, 12).slice(0, 10);
    return {
      date,
      events: mock.eventsForOffset(d),
      blocks: mock.blocks.filter((b) => b.startsAt.slice(0, 10) === date),
    };
  });
  return { days, summary: mock.planSummary, courses: mock.courses, assignments: mock.assignments };
}

export async function getCourses(): Promise<CoursesData> {
  if (!IS_MOCK) notImplemented();
  return { courses: mock.courses, assignments: mock.assignments, resources: mock.resources };
}

/** Milestone 1: a canned reply that demonstrates provenance labels. No LLM is called. */
export async function askAssistant(question: string): Promise<AssistantReply> {
  if (!IS_MOCK) notImplemented();
  return {
    text:
      `This is a mock reply (no AI is connected yet). You asked: "${question}". ` +
      "In Milestone 6 the assistant will answer from your verified Canvas and Calendar data, " +
      "your reported progress, and the engine's estimates, and will label each.",
    provenance: ["estimate"],
    source: "mock",
  };
}
