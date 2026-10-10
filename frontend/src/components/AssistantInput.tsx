"use client";

import { useState, type FormEvent } from "react";
import { askAssistant } from "@/lib/api";
import type { AssistantReply } from "@/lib/types";
import { SourceBadge } from "./SourceBadge";

const suggestions = ["What should I work on right now?", "Am I behind in any class?", "I only have two hours today."];

export function AssistantInput() {
  const [q, setQ] = useState("");
  const [reply, setReply] = useState<AssistantReply | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    try {
      setReply(await askAssistant(q.trim()));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 focus-within:border-accent">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about your week…"
          aria-label="Ask the assistant"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-3"
        />
        <button
          type="submit"
          disabled={busy || !q.trim()}
          className="rounded-full bg-accent px-3 py-1 text-xs text-white disabled:opacity-40 dark:text-ink"
        >
          Ask
        </button>
      </form>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQ(s)}
            className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-3 hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
      {reply && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-ink-2">
          <p>{reply.text}</p>
          <div className="mt-2 flex gap-1.5">
            <SourceBadge source={reply.source} />
            {reply.provenance.map((p) => (
              <span key={p} className="rounded-sm bg-surface px-1.5 py-px text-[10px] uppercase tracking-wide text-ink-3">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
