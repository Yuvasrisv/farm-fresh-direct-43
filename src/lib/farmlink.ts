export const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Pulses",
  "Spices",
  "Other",
] as const;

export const UNITS = ["kg", "dozen", "litre", "bundle", "quintal", "piece"] as const;

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=70";

export function formatMoney(value: number | string | null | undefined) {
  const num = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function statusTone(status: string) {
  switch (status) {
    case "delivered":
      return "bg-primary/15 text-primary";
    case "shipped":
      return "bg-harvest/25 text-harvest-foreground";
    case "confirmed":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function freshnessLabel(harvestDate: string | null | undefined) {
  if (!harvestDate) return "Freshness not stated";
  const days = Math.round(
    (Date.now() - new Date(harvestDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "Harvested today";
  if (days === 1) return "Harvested yesterday";
  if (days <= 7) return `Harvested ${days} days ago`;
  return `Harvested ${formatDate(harvestDate)}`;
}
