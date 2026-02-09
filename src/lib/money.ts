const formatter = new Intl.NumberFormat("ms-MY", {
  style: "currency",
  currency: "MYR"
});

export function formatMYRFromCents(amountCents: number): string {
  return formatter.format(amountCents / 100);
}

export function parseAmountToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replaceAll(",", "");
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;

  const [whole, frac = ""] = normalized.split(".");
  const fracPadded = (frac + "00").slice(0, 2);
  const cents = Number(whole) * 100 + Number(fracPadded);
  if (!Number.isFinite(cents)) return null;
  return cents;
}

