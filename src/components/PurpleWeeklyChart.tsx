import type { DailySeriesPoint } from "@/lib/insights/weekSeries";
import { parseYMD } from "@/lib/week";

type SeriesProps = {
  points: DailySeriesPoint[];
};

function formatWeekday(ymd: string): string {
  return parseYMD(ymd).toLocaleDateString("en-GB", { weekday: "short" });
}

export default function PurpleWeeklyChart({ points }: SeriesProps) {
  const maxValue = points.reduce((acc, p) => Math.max(acc, p.incomeCents, p.expenseCents), 0);
  const incomePoints = points.map((p) => p.incomeCents);
  const expensePoints = points.map((p) => p.expenseCents);
  const labels = points.map((p) => formatWeekday(p.day));

  const width = 700;
  const height = 240;
  const paddingX = 28;
  const paddingY = 24;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const yFor = (value: number) => {
    if (maxValue === 0) return paddingY + innerHeight;
    const ratio = value / maxValue;
    return paddingY + innerHeight - ratio * innerHeight;
  };

  const xFor = (index: number) => {
    if (points.length <= 1) return paddingX;
    return paddingX + (innerWidth * index) / (points.length - 1);
  };

  const linePath = (values: number[]) =>
    values
      .map((value, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(value)}`)
      .join(" ");

  const areaPath = (values: number[]) => {
    if (values.length === 0) return "";
    const start = `M ${xFor(0)} ${yFor(values[0])}`;
    const lines = values.map((value, i) => `L ${xFor(i)} ${yFor(value)}`).join(" ");
    const end = `L ${xFor(values.length - 1)} ${paddingY + innerHeight} L ${xFor(0)} ${paddingY + innerHeight} Z`;
    return `${start} ${lines} ${end}`;
  };

  return (
    <div className="space-y-3">
      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
          <defs>
            <linearGradient id="purpleGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="55%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          <path d={areaPath(incomePoints)} fill="url(#purpleGradient)" opacity="0.25" />
          <path d={areaPath(expensePoints)} fill="url(#purpleGradient)" opacity="0.12" />
          <path d={linePath(incomePoints)} stroke="url(#purpleGradient)" strokeWidth="3" fill="none" />
          <path d={linePath(expensePoints)} stroke="url(#purpleGradient)" strokeWidth="2" fill="none" opacity="0.65" />
        </svg>
        {maxValue === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
            No data for this week
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        {labels.map((label) => (
          <div key={label} className="w-full text-center">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
