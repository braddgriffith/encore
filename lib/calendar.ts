import { formatShortDate, weekdayIndex } from "./format";
import { EVENING_HOLDS, SHOWS } from "./mock-data";
import type { EveningHold, Show } from "./types";

export type DayTone = "pad" | "open" | "busy" | "show" | "hard" | "soft";

export interface CalendarDay {
  iso: string | null;
  day: number | null;
  shows: Show[];
  hold: EveningHold | null;
  tone: DayTone;
}

const YEAR = 2026;
const MONTH_INDEX = 8;
const DAYS_IN_SEPTEMBER = 30;

function showsOn(iso: string): Show[] {
  return SHOWS.filter((show) => show.date === iso).sort((a, b) => a.showtime.localeCompare(b.showtime));
}

export function septemberDays(): CalendarDay[] {
  const firstWeekday = weekdayIndex(`${YEAR}-09-01`);
  const mondayOffset = (firstWeekday + 6) % 7;
  const cells: CalendarDay[] = [];

  for (let i = 0; i < mondayOffset; i += 1) {
    cells.push({ iso: null, day: null, shows: [], hold: null, tone: "pad" });
  }

  for (let day = 1; day <= DAYS_IN_SEPTEMBER; day += 1) {
    const iso = `${YEAR}-09-${String(day).padStart(2, "0")}`;
    const shows = showsOn(iso);
    const hold = EVENING_HOLDS.find((item) => item.date === iso) ?? null;
    const hard = shows.some((show) => show.conflict?.severity === "hard");
    const soft = shows.some((show) => show.conflict?.severity === "soft");
    let tone: DayTone = "open";
    if (shows.length && (hard || hold)) tone = "hard";
    else if (shows.length && soft) tone = "soft";
    else if (shows.length) tone = "show";
    else if (hold) tone = "busy";
    cells.push({ iso, day, shows, hold, tone });
  }

  return cells;
}

export interface OpenNight {
  iso: string;
  label: string;
}

/** Friday–Sunday evenings with no show and no hold. */
export function openWeekendNights(): OpenNight[] {
  return septemberDays()
    .filter((day): day is CalendarDay & { iso: string } => {
      if (!day.iso || day.tone !== "open") return false;
      const weekday = weekdayIndex(day.iso);
      return weekday === 5 || weekday === 6 || weekday === 0;
    })
    .map((day) => ({ iso: day.iso, label: formatShortDate(day.iso) }));
}

export function freeNightSummary(): string {
  const nights = openWeekendNights();
  if (!nights.length) return "No open weekend nights left in this mock September.";
  return `Open weekend nights with nothing booked: ${nights.map((night) => night.label).join(", ")}.`;
}

export function showsByDate(): Show[] {
  return [...SHOWS].sort((a, b) => a.date.localeCompare(b.date) || a.showtime.localeCompare(b.showtime));
}
