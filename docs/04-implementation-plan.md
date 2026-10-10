# StudyOS — Implementation Plan

Repo layout (modular monolith, two apps):

```
frontend/   Next.js 15 · TypeScript · Tailwind · App Router
backend/    FastAPI · SQLAlchemy · Alembic · APScheduler
docs/       spec, architecture, feasibility, this plan
```

| Milestone | Deliverable | Real vs. mocked | Done when |
|---|---|---|---|
| **1** (this commit) | Today / Plan / Courses UI, design system, mock data layer behind a typed API client | All data mocked, labeled "Mock data" in the UI | `npm run build` passes; views render; mock API shape = future real API shape |
| **2** | FastAPI app, Postgres schema via Alembic, single-user login, Google OAuth (Calendar read), calendar sync job, frontend reads `/api/today` | Calendar real; assignments still mock | Your real events appear on Today and Plan |
| **3** | Canvas client (token) + ICS importer, provider selection, change detection, "deadline moved" surfacing | Canvas real (API or ICS, labeled) | Your real assignments appear with correct source labels |
| **4** | Academic context engine: unified deadlines, course status, workload estimates with calibration hooks, Courses view on real data | Estimates are engine defaults until you report time | Courses view is fully real |
| **5** | Scheduling engine + Plan view on real plans; feasibility warnings; replan on change | Everything real | Plan respects calendar, deadlines, preferences; infeasible weeks are flagged with numbers |
| **6** | Progress reporting, missed-block replan, assistant with tool calling and provenance tags, briefing generation | Everything real | Acceptance criteria 5–7 pass |
| **7** | Drive OAuth + resource linking, sync reliability (retries, logs), deployment config, backups | Everything real | Deployed URL you use daily |

## Milestone 1 scope (implemented)

- Design system: neutral palette, one accent, serif display face for headings,
  generous whitespace, dark mode via `prefers-color-scheme`.
- `src/lib/types.ts` — the domain types mirroring `backend/db/schema.sql`.
- `src/lib/api.ts` — the data access layer the UI calls. In M1 it returns mock
  data from `src/lib/mock/`. In M2 the same functions call FastAPI.
- `src/app/(views)/today`, `/plan`, `/courses` — the three views.
- Mock-data banner is shown while `NEXT_PUBLIC_DATA_MODE=mock`.

## Run

```
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # must pass before any commit
```
