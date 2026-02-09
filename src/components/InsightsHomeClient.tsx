"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getISOWeekStart } from "@/lib/week";

export default function InsightsHomeClient() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/insights/${getISOWeekStart(new Date())}`);
  }, [router]);

  return <div className="text-sm text-slate-600">Loading…</div>;
}
