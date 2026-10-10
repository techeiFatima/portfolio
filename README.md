# StudyOS

A personal academic assistant for one MIT student. It imports courses,
deadlines, calendar commitments and study materials, plans realistic
deep-focus study blocks around real commitments, and adapts when things change.

**The only question it answers:** *What do I need to do today, and am I on track?*

## Status

| Milestone | State |
|---|---|
| 1 · Interface on labeled mock data | **Done** (this commit) |
| 2 · Auth, Postgres, Google Calendar | Next |
| 3 · Canvas (API or verified ICS fallback) | Planned |
| 4 · Academic context engine | Planned |
| 5 · Scheduling engine | Planned |
| 6 · Progress, replanning, assistant | Planned |
| 7 · Drive, reliability, deployment | Planned |

Everything shown in the app today is **mock data** and is labeled as such.
No integration is connected and no AI is called yet.

## Layout

```
frontend/              Next.js 16 · TypeScript · Tailwind 4 (App Router)
  src/app/             three views: / (Today), /plan, /courses
  src/components/      small reusable pieces (Timeline, SourceBadge, …)
  src/lib/types.ts     domain types, mirrors the DB schema
  src/lib/api.ts       data layer: mock now, FastAPI later
  src/lib/mock/        clearly labeled mock data
backend/db/schema.sql  PostgreSQL schema (source of truth for Milestone 2)
docs/                  spec · architecture · integration feasibility · plan
```

## Run the frontend

```
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; must pass before committing
npm run lint
```

## Read first

- `docs/01-product-spec.md`
- `docs/02-architecture.md`
- `docs/03-integration-feasibility.md` — includes three checks only you can do
- `docs/04-implementation-plan.md`

## Principles

Never invent deadlines, grades, or progress. Every record shows its source.
Integrations are read-only until an explicit approval flow exists. No secrets in git.
