const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Noon Pacific on a September date, so the weekday does not depend on ICU. */
export function weekdayIndex(iso: string): number {
  return new Date(`${iso}T19:00:00Z`).getUTCDay();
}

function parts(iso: string): { weekday: number; month: number; day: number } {
  const [, month, day] = iso.split("-").map(Number);
  return { weekday: weekdayIndex(iso), month, day };
}

export function formatShortDate(iso: string): string {
  const { weekday, month, day } = parts(iso);
  return `${WEEKDAYS[weekday]}, ${MONTHS[month - 1]} ${day}`;
}

export function formatLongDate(iso: string): string {
  const { weekday, month, day } = parts(iso);
  return `${WEEKDAYS_LONG[weekday]}, ${MONTHS_LONG[month - 1]} ${day}`;
}

export function formatMoney(amount: number): string {
  return `$${amount}`;
}

export function withPt(clock: string): string {
  return `${clock} PT`;
}
