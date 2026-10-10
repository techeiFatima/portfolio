"use client";

import { useState } from "react";
import type { BlockStatus } from "@/lib/types";

/**
 * One-tap progress reporting for a study block.
 * Milestone 1: local state only. Milestone 6: POSTs to /api/blocks/{id}/report.
 * Reporting "done" never marks the assignment submitted; submission comes from Canvas.
 */
export function BlockProgress({ initial }: { initial: BlockStatus }) {
  const [status, setStatus] = useState<BlockStatus>(initial);
  const opts: { value: BlockStatus; label: string }[] = [
    { value: "done", label: "Done" },
    { value: "partial", label: "Partly" },
    { value: "skipped", label: "Skipped" },
  ];
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Report progress">
      {opts.map((o) => {
        const on = status === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => setStatus(on ? "planned" : o.value)}
            className={
              "rounded-full border px-2.5 py-1 text-xs transition-colors " +
              (on ? "border-accent bg-accent-soft text-accent" : "border-line text-ink-3 hover:text-ink")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
