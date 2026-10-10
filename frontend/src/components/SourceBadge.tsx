import type { DataSource } from "@/lib/types";

const labels: Record<DataSource, string> = {
  canvas_api: "Canvas",
  canvas_ics: "Canvas feed",
  google_calendar: "Calendar",
  google_drive: "Drive",
  manual: "Reported by you",
  engine: "Estimate",
  mock: "Mock",
};

/** Every piece of academic data shows where it came from. */
export function SourceBadge({ source, className = "" }: { source: DataSource; className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-sm border border-line px-1.5 py-px text-[10px] uppercase tracking-wide text-ink-3 " +
        className
      }
    >
      {labels[source]}
    </span>
  );
}
