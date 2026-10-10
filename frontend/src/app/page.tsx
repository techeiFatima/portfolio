import { getToday } from "@/lib/api";
import { fmtDate, fmtDue, fmtHours } from "@/lib/format";
import { AssistantInput } from "@/components/AssistantInput";
import { SourceBadge } from "@/components/SourceBadge";
import { Timeline } from "@/components/Timeline";
import { Card, Dot, Empty, Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const now = new Date();
  const t = await getToday(now);
  const course = (id: number) => t.courses.find((c) => c.id === id);
  const plannedToday = t.blocks.reduce((s, b) => s + b.plannedMinutes, 0);

  return (
    <>
      <p className="text-sm text-ink-3">{fmtDate(now.toISOString())}</p>
      <h1 className="display mt-1 text-3xl leading-tight text-ink sm:text-[2rem]">What matters today</h1>

      <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink-2">{t.briefing.text}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-ink-3">
        <SourceBadge source={t.briefing.source} />
        <span>AI summary of verified data. Not a source of truth.</span>
      </div>

      <Section title="Top priorities" aside="planned by the engine">
        {t.priorities.length === 0 ? (
          <Empty>Nothing open. Enjoy it.</Empty>
        ) : (
          <ol className="space-y-2">
            {t.priorities.map((a, i) => {
              const c = course(a.courseId);
              const remaining = Math.max(0, a.estimatedMinutes - a.completedMinutes);
              return (
                <li key={a.id}>
                  <Card className="flex items-center gap-4 px-4 py-3">
                    <span className="display w-5 text-xl text-ink-3">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Dot color={c?.color ?? "#999"} />
                        <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-3">
                        {c?.code} · due {fmtDue(a.dueAt, now)} · ~{fmtHours(remaining)} left
                      </p>
                    </div>
                    <SourceBadge source={a.source} />
                  </Card>
                </li>
              );
            })}
          </ol>
        )}
      </Section>

      <Section title="Today" aside={plannedToday ? `${fmtHours(plannedToday)} of focused study` : undefined}>
        <Timeline events={t.events} blocks={t.blocks} courses={t.courses} reportable />
        <p className="mt-2 text-xs text-ink-3">
          Marking a block done records your time. Submission status always comes from Canvas.
        </p>
      </Section>

      <Section title="Due within 7 days">
        {t.urgent.length === 0 ? (
          <Empty>No deadlines this week.</Empty>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {t.urgent.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <Dot color={course(a.courseId)?.color ?? "#999"} />
                <span className="w-16 shrink-0 text-xs text-ink-3">{course(a.courseId)?.code}</span>
                <span className="min-w-0 flex-1 truncate text-ink">{a.title}</span>
                <span className="tabular shrink-0 text-xs text-ink-2">{fmtDue(a.dueAt, now)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Ask">
        <AssistantInput />
      </Section>
    </>
  );
}
