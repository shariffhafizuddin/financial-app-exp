import { addDays, addWeeks, format, parse, startOfISOWeek } from "date-fns";

export function parseYMD(ymd: string): Date {
  return parse(ymd, "yyyy-MM-dd", new Date());
}

export function formatYMD(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getISOWeekStart(date: Date): string {
  return formatYMD(startOfISOWeek(date));
}

export function addDaysYMD(ymd: string, days: number): string {
  return formatYMD(addDays(parseYMD(ymd), days));
}

export function addWeeksYMD(ymd: string, weeks: number): string {
  return formatYMD(addWeeks(parseYMD(ymd), weeks));
}

export function getWeekDays(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDaysYMD(weekStart, i));
}

