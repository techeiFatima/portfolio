-- StudyOS database schema (PostgreSQL). Milestone 2 creates this via Alembic;
-- it is kept here as the readable source of truth.

CREATE TYPE data_source AS ENUM ('canvas_api', 'canvas_ics', 'google_calendar', 'google_drive', 'manual', 'engine');
CREATE TYPE assignment_status AS ENUM ('not_started', 'in_progress', 'submitted', 'graded', 'missing', 'excused');
CREATE TYPE block_status AS ENUM ('planned', 'done', 'partial', 'skipped');
CREATE TYPE plan_feasibility AS ENUM ('feasible', 'tight', 'infeasible');

-- Single user. Row exists once; kept as a table so auth and preferences are explicit.
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  timezone      TEXT NOT NULL DEFAULT 'America/New_York',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE preferences (
  user_id            INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  study_day_start    TIME NOT NULL DEFAULT '09:00',
  study_day_end      TIME NOT NULL DEFAULT '22:00',
  min_block_minutes  INT  NOT NULL DEFAULT 60,
  pref_block_minutes INT  NOT NULL DEFAULT 90,
  max_block_minutes  INT  NOT NULL DEFAULT 180,
  buffer_minutes     INT  NOT NULL DEFAULT 10,
  max_study_hours_per_day NUMERIC(3,1) NOT NULL DEFAULT 6.0,
  prefer_single_subject_blocks BOOLEAN NOT NULL DEFAULT TRUE
);

-- Encrypted OAuth / API credentials. `secret_enc` is Fernet ciphertext; never plaintext.
CREATE TABLE integration_credentials (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider    TEXT NOT NULL CHECK (provider IN ('google', 'canvas')),
  kind        TEXT NOT NULL CHECK (kind IN ('oauth_refresh', 'oauth_access', 'api_token', 'ics_url')),
  secret_enc  BYTEA NOT NULL,
  scopes      TEXT[],
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider, kind)
);

CREATE TABLE courses (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source        data_source NOT NULL,
  external_id   TEXT,                 -- Canvas course id when known
  code          TEXT NOT NULL,        -- e.g. "6.1210"
  name          TEXT NOT NULL,
  term          TEXT,
  color         TEXT,                 -- UI accent, user-editable
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  canvas_url    TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, source, external_id)
);

CREATE TABLE assignments (
  id                SERIAL PRIMARY KEY,
  user_id           INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id         INT REFERENCES courses(id) ON DELETE SET NULL,
  source            data_source NOT NULL,
  external_id       TEXT,
  title             TEXT NOT NULL,
  description_text  TEXT,             -- HTML stripped at import; treated as untrusted data
  kind              TEXT NOT NULL DEFAULT 'assignment' CHECK (kind IN ('assignment','quiz','exam','reading','other')),
  due_at            TIMESTAMPTZ,
  points_possible   NUMERIC(8,2),
  url               TEXT,
  -- Verified from Canvas when source = canvas_api; otherwise user-reported.
  status            assignment_status NOT NULL DEFAULT 'not_started',
  status_source     data_source NOT NULL DEFAULT 'manual',
  -- Estimates: engine or user. Never from Canvas.
  estimated_minutes INT,
  estimate_source   data_source,
  completed_minutes INT NOT NULL DEFAULT 0,
  priority          SMALLINT NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  first_seen_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ,      -- soft delete when it disappears upstream
  UNIQUE (user_id, source, external_id)
);

-- Keeps every upstream change so "deadline moved" can be shown and audited.
CREATE TABLE assignment_changes (
  id            SERIAL PRIMARY KEY,
  assignment_id INT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  field         TEXT NOT NULL,
  old_value     TEXT,
  new_value     TEXT,
  detected_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE submissions (
  id            SERIAL PRIMARY KEY,
  assignment_id INT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  source        data_source NOT NULL,           -- canvas_api only in v1
  submitted_at  TIMESTAMPTZ,
  workflow_state TEXT,                          -- Canvas: unsubmitted|submitted|graded|pending_review
  score         NUMERIC(8,2),
  grade         TEXT,
  late          BOOLEAN,
  missing       BOOLEAN,
  synced_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, source)
);

CREATE TABLE course_grades (
  course_id     INT PRIMARY KEY REFERENCES courses(id) ON DELETE CASCADE,
  source        data_source NOT NULL,
  current_score NUMERIC(6,2),
  current_grade TEXT,
  final_score   NUMERIC(6,2),
  synced_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE calendar_events (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source        data_source NOT NULL DEFAULT 'google_calendar',
  external_id   TEXT NOT NULL,
  calendar_id   TEXT NOT NULL,
  title         TEXT NOT NULL,
  description_text TEXT,
  location      TEXT,
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ NOT NULL,
  all_day       BOOLEAN NOT NULL DEFAULT FALSE,
  transparency  TEXT NOT NULL DEFAULT 'opaque',  -- 'transparent' events do not block study time
  category      TEXT,                            -- class|meeting|research|personal (heuristic + user override)
  course_id     INT REFERENCES courses(id) ON DELETE SET NULL,
  synced_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, calendar_id, external_id)
);

CREATE TABLE resources (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source        data_source NOT NULL,             -- google_drive | canvas_api
  external_id   TEXT NOT NULL,
  name          TEXT NOT NULL,
  mime_type     TEXT,
  url           TEXT NOT NULL,
  modified_at   TIMESTAMPTZ,
  course_id     INT REFERENCES courses(id) ON DELETE SET NULL,
  assignment_id INT REFERENCES assignments(id) ON DELETE SET NULL,
  link_confidence NUMERIC(3,2),                   -- 0..1; links < 0.6 shown as "suggested"
  link_source   data_source,                      -- engine | manual
  synced_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, source, external_id)
);

CREATE TABLE plans (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  horizon_start DATE NOT NULL,
  horizon_end   DATE NOT NULL,
  feasibility   plan_feasibility NOT NULL,
  required_minutes  INT NOT NULL,
  available_minutes INT NOT NULL,
  warnings      JSONB NOT NULL DEFAULT '[]',
  inputs_hash   TEXT NOT NULL,                    -- for "plan is stale" detection
  is_current    BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE plan_blocks (
  id            SERIAL PRIMARY KEY,
  plan_id       INT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  assignment_id INT REFERENCES assignments(id) ON DELETE CASCADE,
  course_id     INT REFERENCES courses(id) ON DELETE SET NULL,
  label         TEXT NOT NULL,
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ NOT NULL,
  planned_minutes INT NOT NULL,
  status        block_status NOT NULL DEFAULT 'planned',
  actual_minutes INT,                              -- reported by user
  reported_at   TIMESTAMPTZ,
  note          TEXT
);

-- Actual time spent, by assignment; feeds estimate calibration.
CREATE TABLE study_sessions (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id INT REFERENCES assignments(id) ON DELETE SET NULL,
  plan_block_id INT REFERENCES plan_blocks(id) ON DELETE SET NULL,
  started_at    TIMESTAMPTZ NOT NULL,
  minutes       INT NOT NULL,
  finished_task BOOLEAN NOT NULL DEFAULT FALSE,
  source        data_source NOT NULL DEFAULT 'manual'
);

CREATE TABLE briefings (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  for_date      DATE NOT NULL,
  text          TEXT NOT NULL,
  inputs_hash   TEXT NOT NULL,
  model         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assistant_messages (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL CHECK (role IN ('user','assistant','tool')),
  content       JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Any external write (e.g. create a calendar event) must reference an approved row.
CREATE TABLE approvals (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action        TEXT NOT NULL,
  payload       JSONB NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','executed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at    TIMESTAMPTZ
);

CREATE TABLE sync_runs (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider      TEXT NOT NULL,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at   TIMESTAMPTZ,
  ok            BOOLEAN,
  items_changed INT,
  error         TEXT
);

CREATE INDEX ON assignments (user_id, due_at) WHERE deleted_at IS NULL;
CREATE INDEX ON calendar_events (user_id, starts_at);
CREATE INDEX ON plan_blocks (plan_id, starts_at);
