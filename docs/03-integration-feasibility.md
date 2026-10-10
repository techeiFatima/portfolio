# StudyOS — Integration Feasibility Checklist

Legend: ✅ verified from official docs · ⚠️ known but needs a check against *your*
account · ❓ not verified, must be tested before relying on it.

## Canvas (canvas.mit.edu)

| Item | Status | Notes |
|---|---|---|
| Canvas REST API exists and covers courses, assignments, submissions, grades, quizzes, files, calendar | ✅ | Instructure developer docs. |
| Students can create a personal access token in *Account → Settings → Approved Integrations → New Access Token* | ⚠️ | Standard Canvas feature. Institutions can disable it; several universities (UW–Madison, Univ. of Missouri) have. **No public MIT statement found either way.** |
| MIT allows student tokens | ❓ | **Blocker check for Milestone 3:** log in to canvas.mit.edu → Account → Settings. If "+ New Access Token" is present, the API path is open. If absent, use the fallback. |
| Canvas policy on personal tokens | ⚠️ | Instructure's guide says personal tokens are for individual use and that putting a user-generated token into an *application* violates API policy. StudyOS is a single-user tool you run yourself, which is the "individual use" case, but MIT could read it differently. Developer-key OAuth2 would require an MIT admin to register StudyOS; not practical for v1. |
| Fallback: Canvas calendar ICS feed (*Calendar → Calendar Feed*) | ✅ | Gives assignment titles, due dates, course names, links. **Does not give** submission status, grades, descriptions, or quiz details. UI must label these as `canvas_ics` and show "status: reported by you". |
| Fallback 2: manual CSV/JSON import of exported assignment list | ✅ | Last resort; clearly labeled `manual`. |
| Change detection | ✅ | Store `assignments.external_id` + compare `due_at`/`title` each sync; log to `assignment_changes`. Works for both API and ICS (ICS UIDs are stable). |

**Decision for v1:** implement the API client *and* the ICS importer behind one
interface; pick at runtime based on which credential exists.

## Google Calendar

| Item | Status | Notes |
|---|---|---|
| Scope `https://www.googleapis.com/auth/calendar.readonly` | ✅ | Read all calendars and events. Classified as a *sensitive* scope. |
| Scope `calendar.events.readonly` | ✅ | Narrower; events only. Either is enough for v1. |
| Free/busy via `freebusy.query` | ✅ | Not needed if we have events; events give titles for categorisation. |
| OAuth verification | ⚠️ | A GCP project in **Testing** publishing status can be used by up to 100 listed test users with sensitive scopes without verification. Users see an "unverified app" screen once. |
| Refresh-token lifetime in Testing mode | ⚠️ | For *External* user type projects in Testing, Google expires refresh tokens after 7 days. Two options: (a) create the GCP project under your MIT Google Workspace and set user type **Internal** (no expiry, no verification); (b) accept re-authorizing weekly. **Check whether MIT Workspace lets students create GCP projects / Internal apps.** |
| Writes (creating study-block events) | ✅ deferred | Needs `calendar.events` scope. Not requested in v1; approval table exists for later. |

## Google Drive

| Item | Status | Notes |
|---|---|---|
| Scope `drive.readonly` | ✅ | Read all files. **Restricted** scope: production verification requires a security assessment. Fine in Testing/Internal mode for one user. |
| Scope `drive.metadata.readonly` | ✅ | Names, folders, mime types, modified dates. Also restricted. Enough for linking resources without reading content. |
| Scope `drive.file` (non-sensitive) | ✅ | Only files the user explicitly picks via the Google Picker. No automatic discovery. Fallback if restricted scopes are a problem. |
| Full-text search (`fullText contains`) | ✅ | Drive API `files.list` supports it with `drive.readonly`. |

**Decision for v1:** `drive.metadata.readonly` first (Milestone 7); upgrade to
`drive.readonly` only if content search proves necessary.

## LLM

| Item | Status | Notes |
|---|---|---|
| Structured tool calling with JSON schemas | ✅ | Anthropic Messages API `tools` parameter. Model id and pricing to be confirmed against current docs when Milestone 6 starts. |
| Cost control | ✅ | Briefing cached per data hash; assistant calls on demand only. |

## Items you need to confirm before Milestone 2/3

1. canvas.mit.edu → Account → Settings: is **New Access Token** available?
2. Can you create a Google Cloud project with your MIT account, and does the
   OAuth consent screen offer **Internal**? (Otherwise: External + Testing.)
3. Which Google calendars hold classes/research/personal? (Multiple calendar
   ids are supported; you'll tick them in Settings.)
