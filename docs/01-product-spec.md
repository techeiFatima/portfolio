# StudyOS — Product Specification

**Status:** v0.1 (Milestone 1). Single user. Personal tool, not a SaaS.

## One-line purpose

StudyOS answers one question every time it is opened:
**"What do I need to do today, and am I on track?"**

The user studies. StudyOS imports, organizes, plans, and adapts.

## Non-goals

- Not a general task manager, notes app, or calendar replacement.
- Not a chatbot you have to prompt to get value; the AI runs in the background.
- Not multi-tenant. One account, one database, one deployment.
- No gamification, streaks, dashboards full of charts.

## Users and context

One MIT undergraduate with: Canvas courses, a Google Calendar holding classes,
meetings, research, and personal events, and Google Drive holding course material.

## The three views

### 1. TODAY (default screen)

| Element | Source of truth | Label shown to user |
|---|---|---|
| Daily briefing (2–3 sentences) | LLM over verified data | "AI summary" |
| Top 3 priorities | Scheduling engine | "Planned" |
| Today's schedule (calendar + study blocks) | Google Calendar + engine | Calendar events: "Calendar". Study blocks: "Planned" |
| Urgent deadlines (≤ 7 days) | Canvas | "Canvas" (or "Imported" / "Manual") |
| Mark progress on a study block | User | "Reported by you" |
| Assistant input (one line) | LLM with tools | — |

Goal: the user understands the day within five seconds.

### 2. PLAN

- Week strip + a single-day column. Fixed commitments shown muted; study blocks
  shown prominent; free time left blank.
- Engine output includes: feasibility status, total planned vs. available hours,
  warnings ("12h of work, 7h available: infeasible").
- Missed block → engine proposes a replan; user accepts or edits. Nothing is
  marked "failed".
- Preference: long deep-focus sessions (default 90 min, max 180 min), one subject
  per block where possible, 10-minute buffer between blocks, no study after a
  configurable "day ends" time.

### 3. COURSES

- One card per course: upcoming assignments (due date, submission status,
  grade if available), remaining estimated workload, linked resources.
- Expand a course for its full assignment list and resources.
- No analytics beyond "remaining hours" and "completed / total".

## The assistant

Answers questions with tools, never from memory alone. Tool set (Milestone 6):
`get_assignments`, `get_schedule`, `get_free_time`, `get_course_status`,
`find_resources`, `propose_replan`, `report_progress`. Every answer tags each
fact as one of:

- **Verified** — came from Canvas / Google via sync.
- **Reported** — the user told StudyOS (progress, time spent, estimates).
- **Estimate** — produced by the engine or the LLM.

Consequential actions (changing an external calendar, deleting data) always
require an explicit confirm step in the UI.

## Data-provenance rule (applies everywhere)

Every assignment, deadline, grade, and event carries a `source` field:
`canvas_api`, `canvas_ics`, `manual`, `google_calendar`, `engine`.
The UI shows the source. The system never invents any of these values.

## Acceptance criteria for v1 (end of Milestone 6)

1. Connect Google Calendar (read-only).
2. Import real assignments from Canvas API or the verified ICS fallback.
3. See all deadlines in one place with source labels.
4. Generate a feasible plan around real calendar commitments.
5. Mark work done / report unfinished work in one click.
6. Get a replanned week when something changes.
7. Ask the assistant questions answered from the actual data.
