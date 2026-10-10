"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Today" },
  { href: "/plan", label: "Plan" },
  { href: "/courses", label: "Courses" },
] as const;

export function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="display text-lg text-ink">
          StudyOS
        </Link>
        <nav aria-label="Primary" className="flex gap-1">
          {items.map((it) => {
            const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-full px-3 py-1.5 text-sm transition-colors " +
                  (active ? "bg-accent-soft text-accent" : "text-ink-2 hover:text-ink")
                }
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
