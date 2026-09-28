"use client";

import Link from "next/link";
import { PriorReceipt, TicketStub } from "@/components/TicketStub";
import { cn } from "@/lib/cn";
import { markGoing, skipShow, toggleGoing, undoSkip, useDemoState } from "@/lib/demo-store";
import { formatLongDate, withPt } from "@/lib/format";
import { KIND_SHORT, type Show } from "@/lib/types";
import { useRankedShows } from "@/lib/use-ranked";

export function ShowDetail({ show }: { show: Show }) {
  const ranked = useRankedShows();
  const { going, skipped } = useDemoState();
  const index = ranked.findIndex((row) => row.show.id === show.id);
  const row = index >= 0 ? ranked[index] : undefined;
  const isGoing = going.includes(show.id);
  const isSkipped = skipped.includes(show.id);
  const previous = index > 0 ? ranked[index - 1] : undefined;
  const next = index >= 0 ? ranked[index + 1] : undefined;
  const bars = [...(row?.contributions ?? [])].sort((a, b) => Math.abs(b.points) - Math.abs(a.points)).slice(0, 5);
  const maxPoints = Math.max(...bars.map((bar) => Math.abs(bar.points)), 1);

  return (
    <div className="px-4 pb-28 pt-6">
      <Link href="/" className="text-sm text-gold">
        September
      </Link>

      <header className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist">
            {formatLongDate(show.date)}
            {row ? ` · ${index + 1} of ${ranked.length}` : ""}
          </p>
          {row ? (
            <div className="text-right">
              <p className="font-display text-4xl leading-none text-gold">{row.score}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-mist">Fit</p>
            </div>
          ) : null}
        </div>
        <h1
          className={cn(
            "mt-2 font-display uppercase leading-[0.86] text-paper",
            show.artist.length > 16 ? "text-[2.65rem]" : "text-[3.4rem]",
          )}
        >
          {show.artist}
        </h1>
        <p className="mt-3 text-base text-paper/90">{show.venue}</p>
        <p className="text-sm text-mist">
          {show.neighborhood} · {show.address}
        </p>
        <p className="mt-3 font-serif text-lg leading-snug text-paper">{show.note}</p>
      </header>

      <section className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-card px-3 py-4">
        <Time label="Doors" value={withPt(show.doors)} />
        <Time label="Show" value={withPt(show.showtime)} />
        <Time label="Ends" value={withPt(show.ends)} />
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-card px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">Drive from Woodinville</p>
        <p className="mt-2 font-display text-5xl leading-none text-paper">
          {show.drive.minutes}
          <span className="ml-1 text-2xl text-mist">min</span>
        </p>
        <p className="mt-1 text-sm text-mist">{show.drive.miles} miles</p>
        <p className="mt-3 font-serif text-lg leading-snug text-paper">{show.drive.vibe}</p>
      </section>

      {row && row.reasons.length > 0 ? (
        <section className="mt-4">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">Why you</h2>
          <ul className="mt-2 space-y-2">
            {row.reasons.slice(0, 4).map((reason) => (
              <li key={reason} className="font-serif text-lg leading-snug text-paper">
                {reason}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">Calendar</h2>
        {show.conflict ? (
          <div
            className={cn(
              "mt-2 rounded-2xl border px-4 py-3",
              show.conflict.severity === "hard" ? "border-ember/40 bg-ember/10" : "border-gold/30 bg-gold/10",
            )}
          >
            <p className={cn("text-sm font-medium", show.conflict.severity === "hard" ? "text-ember" : "text-gold")}>
              {show.conflict.severity === "hard" ? "Hard conflict" : "Soft conflict"} · {show.conflict.title}
            </p>
            <p className="mt-1 text-sm text-paper">{show.conflict.when}</p>
            <p className="mt-2 font-serif text-lg leading-snug text-paper">{show.conflict.detail}</p>
          </div>
        ) : (
          <p className="mt-2 rounded-2xl border border-moss/30 bg-moss/10 px-4 py-3 font-serif text-lg text-paper">
            Calendar is clear. No hold that night.
          </p>
        )}
      </section>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-pressed={isGoing}
          onClick={() => {
            if (!isGoing) markGoing(show.id);
          }}
          className={cn(
            "rounded-full px-4 py-3 text-sm font-medium",
            isGoing ? "bg-moss text-ink" : "bg-gold text-ink",
          )}
        >
          {isGoing ? "Going · demo" : "I'm going"}
        </button>
        {!isGoing ? (
          <button
            type="button"
            onClick={() => (isSkipped ? undoSkip(show.id) : skipShow(show.id))}
            className="rounded-full border border-white/15 px-4 py-3 text-sm text-paper"
          >
            {isSkipped ? "Undo skip" : "Skip"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => toggleGoing(show.id)}
            className="rounded-full border border-white/15 px-4 py-3 text-sm text-paper"
          >
            Clear
          </button>
        )}
      </div>

      {bars.length > 0 ? (
        <section className="mt-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist">Signals in the score</h2>
          {show.conflict ? (
            <p className="mt-1 text-xs text-mist">Bars are the signal weight before the calendar cut.</p>
          ) : null}
          <ul className="mt-3 space-y-3">
            {bars.map((bar) => (
              <li key={bar.signalId}>
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="text-paper">
                    {KIND_SHORT[bar.kind]} · {bar.label}
                  </span>
                  <span className={bar.polarity === "negative" ? "text-ember" : "text-mist"}>
                    {bar.polarity === "negative" ? "−" : "+"}
                    {Math.round(Math.abs(bar.points))}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn("h-full rounded-full", bar.polarity === "negative" ? "bg-ember" : "bg-gold")}
                    style={{ width: `${Math.max(8, (Math.abs(bar.points) / maxPoints) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">Ticket stub</h2>
        <div className="mt-3">
          <TicketStub show={show} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-mist">
          Demo confirmation only. Encore does not call a ticket API and will not charge a card.
        </p>
        <a
          href={show.venueUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm text-gold"
        >
          Venue site
        </a>
      </section>

      {show.priorStub ? (
        <section className="mt-5">
          <PriorReceipt stub={show.priorStub} />
        </section>
      ) : null}

      <nav className="mt-8 flex items-stretch justify-between gap-3 text-sm" aria-label="Other shows">
        {previous ? (
          <Link href={`/show/${previous.show.id}`} className="text-mist">
            Higher fit
            <span className="mt-1 block text-paper">{previous.show.artist}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/show/${next.show.id}`} className="text-right text-mist">
            Next
            <span className="mt-1 block text-paper">{next.show.artist}</span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}

function Time({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-mist">{label}</p>
      <p className="mt-1 text-sm font-medium leading-tight text-paper">{value}</p>
    </div>
  );
}
