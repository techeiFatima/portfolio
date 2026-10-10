# StudyOS — System Architecture

Modular monolith. Two deployable processes (web + API) and one database.

```
┌──────────────────────┐   HTTPS/JSON    ┌───────────────────────────────┐
│  frontend/ (Next.js) │ ─────────────▶ │  backend/ (FastAPI, Python)    │
│  Today · Plan ·      │ ◀───────────── │                               │
│  Courses · Assistant │                │  modules/                     │
└──────────────────────┘                │   auth        (session, 1 user)│
                                        │   integrations/               │
                                        │     google_calendar (OAuth, RO)│
                                        │     google_drive    (OAuth, RO)│
                                        │     canvas          (token|ICS)│
                                        │   academic   (unified model)  │
                                        │   planner    (deterministic)  │
                                        │   progress   (reports, actuals)│
                                        │   assistant  (LLM + tools)    │
                                        │   sync       (background jobs)│
                                        └───────────────┬───────────────┘
                                                        │ SQLAlchemy
                                                 ┌──────▼──────┐
                                                 │ PostgreSQL  │
                                                 └─────────────┘
```

## Module responsibilities

| Module | Owns | Must not |
|---|---|---|
| `auth` | Single-user login (password + session cookie), CSRF | Store OAuth tokens in plaintext |
| `integrations.google_calendar` | OAuth flow, pull events into `calendar_events` | Write to Google without an `approvals` row |
| `integrations.google_drive` | OAuth flow, list files + metadata, link to courses | Download file bodies unless needed for search index |
| `integrations.canvas` | Token-based API client **or** ICS feed importer; writes `courses`, `assignments`, `submissions`, `grades` with `source` set | Guess a submission status or a grade |
| `academic` | Unified read model: "all deadlines", "course status", workload estimates | Call external APIs directly |
| `planner` | Deterministic scheduler: inputs → `plan_blocks` + feasibility report | Call an LLM |
| `progress` | Block completion, actual minutes, assignment status overrides, estimate calibration | Infer submission from a completed block |
| `assistant` | LLM with structured tool calls over the modules above; provenance tagging; injection defenses | Execute consequential actions without `approvals` |
| `sync` | Scheduled jobs (Canvas every 30 min, Calendar every 15 min, Drive hourly), change detection, logging | Run concurrently for the same provider |

## Request flow for TODAY

1. Frontend calls `GET /api/today`.
2. `academic` loads assignments due ≤ 7 days, `calendar_events` for today,
   `plan_blocks` for today, latest `briefings` row.
3. If the briefing is stale (> 6 h or data changed), `assistant.briefing()` is
   called with the verified data and returns 2–3 sentences, stored with its input
   hash. The LLM is never given anything it could mistake for an instruction
   without the injection wrapper (see Security).

## Scheduling engine (Milestone 5)

Version 1 is a transparent greedy + repair algorithm, not OR-Tools. It is small,
auditable, and good enough for one person's week. OR-Tools CP-SAT is kept as an
option if constraints grow (dependencies across many tasks, hard exam-prep
windows).

Inputs: free windows (calendar inverse within study hours), tasks with
`remaining_minutes`, `due_at`, `priority`, `min_block`, `max_block`, exam dates.
Algorithm:
1. Order tasks by urgency score = f(time to due, remaining work, priority).
2. Fill free windows earliest-first with the most urgent task, honoring
   min/max block length, buffers, and "one subject per block" preference.
3. If any task cannot be fully placed before its due date → `infeasible` with
   the shortfall in hours and three candidate fixes (extend study hours, reduce
   estimate, drop/defer lowest-priority item).
4. Replan = rerun with completed minutes subtracted and the past frozen.

## Security

- Secrets only in environment variables; `.env` files git-ignored.
- OAuth refresh tokens and the Canvas token encrypted at rest with a
  server-side key (Fernet) before being stored in `integration_credentials`.
- All integrations are read-only in v1. The only external write path
  (calendar event creation) is behind an `approvals` table and a UI confirm.
- Prompt injection: imported text (assignment descriptions, Drive file names,
  event descriptions) is passed to the LLM only inside a delimited
  `<untrusted_data>` block with the instruction that it is data, and tool
  outputs never include raw HTML. Tool calls that change state are allow-listed
  and validated by Pydantic schemas.
- "Disconnect" deletes credentials; "Delete imported data" removes all rows
  with that source and re-runs nothing.

## Deployment (Milestone 7)

Single VM or Fly.io/Railway: `web` (Next.js), `api` (FastAPI + APScheduler for
sync jobs), managed Postgres. No queue system needed at this scale.
