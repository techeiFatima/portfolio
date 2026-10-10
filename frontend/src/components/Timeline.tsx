import type { CalendarEvent, Course, PlanBlock } from "@/lib/types";
import { fmtTime } from "@/lib/format";
import { BlockProgress } from "./BlockProgress";
import { Dot, Empty } from "./ui";

type Item =
  | { kind: "event"; at: string; end: string; e: CalendarEvent }
  | { kind: "block"; at: string; end: string; b: PlanBlock };

/** A single day's calendar events (muted) and study blocks (prominent), merged by time. */
export function Timeline({
  events,
  blocks,
  courses,
  reportable = false,
}: {
  events: CalendarEvent[];
  blocks: PlanBlock[];
  courses: Course[];
  reportable?: boolean;
}) {
  const items: Item[] = [
    ...events.map((e) => ({ kind: "event" as const, at: e.startsAt, end: e.endsAt, e })),
    ...blocks.map((b) => ({ kind: "block" as const, at: b.startsAt, end: b.endsAt, b })),
  ].sort((a, b) => a.at.localeCompare(b.at));

  if (items.length === 0) return <Empty>Nothing scheduled. A free day.</Empty>;

  const course = (id: number) => courses.find((c) => c.id === id);

  return (
    <ol className="divide-y divide-line rounded-xl border border-line bg-surface">
      {items.map((it) => (
        <li key={`${it.kind}-${it.kind === "event" ? it.e.id : it.b.id}`} className="flex items-start gap-4 px-4 py-3">
          <time className="tabular w-[5.5rem] shrink-0 pt-px text-xs text-ink-3">
            {fmtTime(it.at)}
            <span className="hidden sm:inline"> – {fmtTime(it.end)}</span>
          </time>
          {it.kind === "event" ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink-2">{it.e.title}</p>
              {it.e.location && <p className="text-xs text-ink-3">{it.e.location}</p>}
            </div>
          ) : (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Dot color={course(it.b.courseId)?.color ?? "var(--accent)"} />
                <p className="truncate text-sm font-medium text-ink">{it.b.label}</p>
              </div>
              <p className="mt-0.5 text-xs text-ink-3">
                {course(it.b.courseId)?.code} · {it.b.plannedMinutes} min focus
                {it.b.status === "done" && it.b.actualMinutes != null && ` · you reported ${it.b.actualMinutes} min`}
              </p>
              {reportable && it.b.status !== "done" && (
                <div className="mt-2">
                  <BlockProgress initial={it.b.status} />
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
