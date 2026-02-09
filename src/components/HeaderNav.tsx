"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function extractWeekStart(pathname: string | null): string | null {
  if (!pathname) return null;
  const match = pathname.match(/\/(week|insights)\/(\d{4}-\d{2}-\d{2})/);
  return match?.[2] ?? null;
}

export default function HeaderNav() {
  const pathname = usePathname();
  const weekStart = extractWeekStart(pathname);
  const weekHref = weekStart ? `/week/${weekStart}` : "/";
  const insightsHref = weekStart ? `/insights/${weekStart}` : "/insights";

  return (
    <nav className="flex items-center gap-3 text-sm">
      <Link className="text-slate-600 hover:text-slate-900" href={weekHref}>
        Week
      </Link>
      <Link className="text-slate-600 hover:text-slate-900" href={insightsHref}>
        Insights
      </Link>
    </nav>
  );
}
