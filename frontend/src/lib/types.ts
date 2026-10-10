/**
 * Domain types. These mirror backend/db/schema.sql so the UI built in
 * Milestone 1 against mock data needs no changes when the real API arrives.
 */

/** Where a piece of data came from. Shown in the UI; never guessed. */
export type DataSource =
  | "canvas_api"
  | "canvas_ics"
  | "google_calendar"
  | "google_drive"
  | "manual"
  | "engine"
  | "mock";

export type AssignmentStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "graded"
  | "missing"
  | "excused";

export type AssignmentKind = "assignment" | "quiz" | "exam" | "reading" | "other";

export interface Course {
  id: number;
  code: string;
  name: string;
  color: string; // CSS color used as the course accent
  source: DataSource;
  canvasUrl?: string;
  currentGrade?: { score: number; letter?: string; source: DataSource };
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  kind: AssignmentKind;
  dueAt: string; // ISO timestamp
  url?: string;
  source: DataSource;
  status: AssignmentStatus;
  statusSource: DataSource;
  pointsPossible?: number;
  score?: number;
  estimatedMinutes: number;
  estimateSource: DataSource;
  completedMinutes: number;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = highest
}

export type EventCategory = "class" | "meeting" | "research" | "personal";

export interface CalendarEvent {
  id: number;
  title: string;
  startsAt: string;
  endsAt: string;
  category: EventCategory;
  location?: string;
  source: DataSource;
}

export type BlockStatus = "planned" | "done" | "partial" | "skipped";

export interface PlanBlock {
  id: number;
  assignmentId: number;
  courseId: number;
  label: string;
  startsAt: string;
  endsAt: string;
  plannedMinutes: number;
  status: BlockStatus;
  actualMinutes?: number;
}

export type Feasibility = "feasible" | "tight" | "infeasible";

export interface PlanSummary {
  feasibility: Feasibility;
  requiredMinutes: number;
  availableMinutes: number;
  warnings: string[];
  generatedAt: string;
  source: DataSource;
}

export interface Resource {
  id: number;
  courseId: number;
  assignmentId?: number;
  name: string;
  mimeType: string;
  url: string;
  source: DataSource;
  linkConfidence: number; // 0..1
}

export interface Briefing {
  text: string;
  generatedAt: string;
  source: DataSource; // "engine" when LLM-generated, "mock" in M1
}

/** Everything the TODAY view needs, in one call. */
export interface TodayData {
  date: string; // ISO date
  briefing: Briefing;
  priorities: Assignment[];
  events: CalendarEvent[];
  blocks: PlanBlock[];
  urgent: Assignment[];
  courses: Course[];
}

export interface WeekData {
  days: { date: string; events: CalendarEvent[]; blocks: PlanBlock[] }[];
  summary: PlanSummary;
  courses: Course[];
  assignments: Assignment[];
}

export interface CoursesData {
  courses: Course[];
  assignments: Assignment[];
  resources: Resource[];
}

export interface AssistantReply {
  text: string;
  provenance: ("verified" | "reported" | "estimate")[];
  source: DataSource;
}
