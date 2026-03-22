export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(value: number, decimals = 5): string {
  return value.toFixed(decimals);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatPL(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatCurrency(value)}`;
}

export function formatVolume(value: number): string {
  return value.toFixed(2);
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const month = MONTHS[d.getMonth()];
  const day = d.getDate();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${month} ${day}, ${hours}:${mins}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${mins}`;
}
