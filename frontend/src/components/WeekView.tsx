"use client";

import { useState } from "react";
import type { WeekData } from "@/lib/types";
import { fmtDate, fmtDay, fmtHours } from "@/lib/format";
import { Timeline } from "./Timeline";

/** Week strip + one selected day. Fixed commitments muted; study blocks prominent. */
export function WeekView({ week, todayISO }: { week: WeekData; todayISO: string }) {
  const [sel, setSel] = useState(todayISO);
  const day = week.days.find((d) => d.date === sel) ?? week.days[0];

  return (
    <div>
      <div role="tablist" aria-label="Days" className="grid grid-cols-7 gap-1">
        {week.days.map((d) => {
          const minutes = d.blocks.reduce((s, b) => s + b.plannedMinutes, 0);
          const active = d.date === sel;
          return (
            <button
              key={d.date}
              role="tab"
              aria-selected={active}
              onClick={() => setSel(d.date)}
              className={
                "rounded-lg border px-1 py-2 text-center transition-colors " +
                (active ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-ink-3")
              }
            >
              <div className="text-[10px] uppercase tracking-wide text-ink-3">{fmtDay(d.date + "T12:00:00Z")}</div>
              <div className={"tabular text-sm " + (d.date === todayISO ? "font-semibold text-accent" : "text-ink")}>
                {Number(d.date.slice(8, 10))}
              </div>
              <div className="mt-1 h-1 rounded-full bg-line">
                <div
                  className="h-1 rounded-full bg-accent"
                  style={{ width: `${Math.min(100, (minutes / 360) * 100)}%` }}
                  aria-hidden
                />
              </div>
              <div className="tabular mt-1 text-[10px] text-ink-3">{minutes ? fmtHours(minutes) : "—"}</div>
            </button>
          );
        })}
      </div>

      <h3 className="mt-6 mb-3 text-sm text-ink-2">{fmtDate(day.date + "T12:00:00Z")}</h3>
      <Timeline events={day.events} blocks={day.blocks} courses={week.courses} />
    </div>
  );
}
