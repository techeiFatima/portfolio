import { IS_MOCK } from "@/lib/api";

/** Shown while the app runs on mock data. Removed automatically once a real backend is configured. */
export function MockBanner() {
  if (!IS_MOCK) return null;
  return (
    <div className="bg-warn-soft px-4 py-1.5 text-center text-xs text-warn">
      Milestone 1 · all courses, deadlines, grades, and events on this screen are <strong>mock data</strong>.
      Nothing is connected yet.
    </div>
  );
}
