import { getWeek } from "@/lib/api";
import { todayISO } from "@/lib/mock/data";
import { fmtHours } from "@/lib/format";
import { SourceBadge } from "@/components/SourceBadge";
import { WeekView } from "@/components/WeekView";
import { Section } from "@/components/ui";

export const dynamic = "force-dynamic";

const tone = {
  feasible: { label: "Feasible", cls: "bg-accent-soft text-accent" },
  tight: { label: "Tight", cls: "bg-warn-soft text-warn" },
  infeasible: { label: "Infeasible", cls: "bg-danger-soft text-danger" },
} as const;

export default async function PlanPage() {
  const week = await getWeek(0);
  const s = week.summary;
  const t = tone[s.feasibility];

  return (
    <>
      <h1 className="display text-3xl leading-tight text-ink sm:text-[2rem]">This week</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-2">
        <span className={"rounded-full px-2.5 py-1 text-xs font-medium " + t.cls}>{t.label}</span>
        <span className="tabular">
          {fmtHours(s.requiredMinutes)} needed · {fmtHours(s.availableMinutes)} available
        </span>
        <SourceBadge source={s.source} />
      </div>

      {s.warnings.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {s.warnings.map((w) => (
            <li key={w} className="flex gap-2 text-sm text-ink-2">
              <span aria-hidden className="text-warn">•</span>
              {w}
            </li>
          ))}
        </ul>
      )}

      <Section title="Schedule" aside="tap a day">
        <WeekView week={week} todayISO={todayISO()} />
      </Section>

      <p className="mt-6 text-xs leading-relaxed text-ink-3">
        The plan is rebuilt whenever a deadline, event, or your reported progress changes. If a block is missed, StudyOS
        proposes a new arrangement instead of marking the day failed. It never writes to your Google Calendar without
        asking.
      </p>
    </>
  );
}
