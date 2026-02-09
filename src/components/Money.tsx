import { formatMYRFromCents } from "@/lib/money";

export default function Money({ cents }: { cents: number }) {
  return <span>{formatMYRFromCents(cents)}</span>;
}

