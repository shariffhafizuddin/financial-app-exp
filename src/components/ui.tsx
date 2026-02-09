import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

export function Card({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  const cls = ["rounded-xl border border-slate-200 bg-white p-4 shadow-sm", className]
    .filter(Boolean)
    .join(" ");
  return <div className={cls}>{children}</div>;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : variant === "danger"
        ? "bg-rose-600 text-white hover:bg-rose-500"
        : "bg-slate-100 text-slate-900 hover:bg-slate-200";
  const cls = [base, styles, className].filter(Boolean).join(" ");
  return <button className={cls} {...props} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const cls = [
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300",
    props.className
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <input
      {...props}
      className={cls}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const cls = [
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300",
    props.className
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <select
      {...props}
      className={cls}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const cls = [
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300",
    props.className
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <textarea
      {...props}
      className={cls}
    />
  );
}
