import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
