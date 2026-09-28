"use client";

import Link from "next/link";
import { septemberDays, openWeekendNights, showsByDate, type DayTone } from "@/lib/calendar";
import { cn } from "@/lib/cn";
import { useDemoState } from "@/lib/demo-store";
import { formatShortDate, withPt } from "@/lib/format";
import { PROFILE } from "@/lib/mock-data";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeekScreen() {
  const days = septemberDays();
  const shows = showsByDate();
  const opens = openWeekendNights();
  const { going } = useDemoState();

  return (
    <div className="px-4 pb-28 pt-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Encore · Demo</p>
      <h1 className="mt-2 font-display text-6xl uppercase leading-[0.85] text-paper">The month</h1>
      <p className="mt-3 font-serif text-lg leading-snug text-paper">
        Free nights against the September seed. Mock calendar for {PROFILE.home}.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.14em] text-mist">
        <Legend swatch="bg-moss" label="Open" />
        <Legend swatch="bg-gold" label="Show" />
        <Legend swatch="bg-ember" label="Conflict" />
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((label, index) => (
          <div key={`${label}-${index}`} className="pb-1 text-[10px] uppercase tracking-wider text-mist">
            {label}
          </div>
        ))}
        {days.map((day, index) => {
          const show = day.shows[0];
          const label = day.hold?.label ?? show?.artist ?? "Open";
          const className = cn("flex h-11 flex-col items-center justify-center rounded-lg text-sm", toneClass(day.tone));
          const inner = (
            <>
              <span>{day.day}</span>
              <span className={cn("mt-0.5 h-1 w-1 rounded-full", dotClass(day.tone))} />
            </>
          );
          if (!day.iso) {
            return <div key={`pad-${index}`} />;
          }
          if (show) {
            return (
              <Link key={day.iso} href={`/show/${show.id}`} title={label} className={className}>
                {inner}
              </Link>
            );
          }
          return (
            <div key={day.iso} title={label} className={className}>
              {inner}
            </div>
          );
        })}
      </div>

      <section className="mt-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">Show nights</h2>
        <ul className="mt-3 divide-y divide-white/10">
          {shows.map((show) => {
            const badge = show.conflict?.severity === "hard" ? "Busy" : show.conflict ? "Tight" : "Free";
            return (
              <li key={show.id}>
                <Link href={`/show/${show.id}`} className="flex items-start justify-between gap-3 py-3">
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-mist">
                      {formatShortDate(show.date)}
                      {going.includes(show.id) ? " · Going" : ""}
                    </span>
                    <span className="mt-1 block font-display text-2xl uppercase leading-none text-paper">{show.artist}</span>
                    <span className="mt-1 block text-sm text-mist">
                      {show.venue} · {withPt(show.showtime)} · {show.drive.minutes} min
                    </span>
                    {show.conflict ? (
                      <span className={cn("mt-1 block text-sm", show.conflict.severity === "hard" ? "text-ember" : "text-gold")}>
                        {show.conflict.title} · {show.conflict.when}
                      </span>
                    ) : (
                      <span className="mt-1 block text-sm text-moss">Evening is open.</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider",
                      badge === "Busy" && "bg-ember/15 text-ember",
                      badge === "Tight" && "bg-gold/15 text-gold",
                      badge === "Free" && "bg-moss/15 text-moss",
                    )}
                  >
                    {badge}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">Open weekend nights</h2>
        <p className="mt-2 text-sm text-mist">Nothing booked, and no show on the seed.</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {opens.map((night) => (
            <li key={night.iso} className="rounded-full border border-moss/40 px-3 py-1 text-sm text-moss">
              {night.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", swatch)} />
      {label}
    </span>
  );
}

function toneClass(tone: DayTone): string {
  if (tone === "show") return "bg-gold/15 text-gold";
  if (tone === "hard") return "bg-ember/15 text-ember";
  if (tone === "soft") return "text-paper ring-1 ring-gold/40";
  if (tone === "busy") return "text-mist/80";
  return "text-paper";
}

function dotClass(tone: DayTone): string {
  if (tone === "show" || tone === "soft") return "bg-gold";
  if (tone === "hard") return "bg-ember";
  if (tone === "busy") return "bg-mist/50";
  return "bg-moss";
}
