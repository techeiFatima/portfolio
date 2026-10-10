import { getCourses } from "@/lib/api";
import { fmtDue, fmtHours } from "@/lib/format";
import { SourceBadge } from "@/components/SourceBadge";
import { Card, Dot } from "@/components/ui";
import type { Assignment } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusLabel: Record<Assignment["status"], string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  graded: "Graded",
  missing: "Missing",
  excused: "Excused",
};

export default async function CoursesPage() {
  const now = new Date();
  const { courses, assignments, resources } = await getCourses();

  return (
    <>
      <h1 className="display text-3xl leading-tight text-ink sm:text-[2rem]">Courses</h1>
      <p className="mt-2 text-sm text-ink-3">Deadlines, status, and grades as reported by their source. Estimates are labeled.</p>

      <div className="mt-8 space-y-4">
        {courses.map((c) => {
          const items = assignments
            .filter((a) => a.courseId === c.id)
            .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
          const open = items.filter((a) => !["submitted", "graded", "excused"].includes(a.status));
          const remaining = open.reduce((s, a) => s + Math.max(0, a.estimatedMinutes - a.completedMinutes), 0);
          const done = items.length - open.length;
          const res = resources.filter((r) => r.courseId === c.id);

          return (
            <Card key={c.id} className="overflow-hidden">
              <details className="group" open={open.length > 0}>
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                  <Dot color={c.color} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      <span className="text-ink-3">{c.code}</span> {c.name}
                    </p>
                    <p className="tabular mt-0.5 text-xs text-ink-3">
                      {open.length} open · ~{fmtHours(remaining)} left · {done}/{items.length} done
                    </p>
                  </div>
                  {c.currentGrade ? (
                    <div className="text-right">
                      <p className="tabular text-sm text-ink">
                        {c.currentGrade.letter ?? ""} <span className="text-ink-3">{c.currentGrade.score}%</span>
                      </p>
                      <SourceBadge source={c.currentGrade.source} />
                    </div>
                  ) : (
                    <span className="text-xs text-ink-3">No grade yet</span>
                  )}
                  <span aria-hidden className="ml-1 text-ink-3 transition-transform group-open:rotate-90">›</span>
                </summary>

                <div className="border-t border-line">
                  <ul className="divide-y divide-line">
                    {items.map((a) => {
                      const left = Math.max(0, a.estimatedMinutes - a.completedMinutes);
                      const closed = ["submitted", "graded", "excused"].includes(a.status);
                      return (
                        <li key={a.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                          <div className="min-w-0 flex-1">
                            <p className={"truncate " + (closed ? "text-ink-3" : "text-ink")}>{a.title}</p>
                            <p className="tabular mt-0.5 text-xs text-ink-3">
                              {closed ? statusLabel[a.status] : `due ${fmtDue(a.dueAt, now)}`}
                              {a.score != null && a.pointsPossible != null && ` · ${a.score}/${a.pointsPossible}`}
                              {!closed && ` · ${statusLabel[a.status]} · ~${fmtHours(left)} left`}
                            </p>
                          </div>
                          <SourceBadge source={a.statusSource} />
                        </li>
                      );
                    })}
                  </ul>

                  {res.length > 0 && (
                    <div className="border-t border-line bg-surface-2 px-4 py-3">
                      <p className="mb-1.5 text-[10px] uppercase tracking-wide text-ink-3">Resources</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {res.map((r) => (
                          <li key={r.id}>
                            <a
                              href={r.url}
                              className={
                                "inline-block rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink-2 hover:text-ink " +
                                (r.linkConfidence < 0.6 ? "border-dashed" : "")
                              }
                              title={r.linkConfidence < 0.6 ? "Suggested link (low confidence)" : undefined}
                            >
                              {r.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            </Card>
          );
        })}
      </div>
    </>
  );
}
