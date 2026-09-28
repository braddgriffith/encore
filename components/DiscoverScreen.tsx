"use client";

import { ShowCard } from "@/components/ShowCard";
import { undoSkip, useDemoState } from "@/lib/demo-store";
import { PROFILE } from "@/lib/mock-data";
import { useRankedShows } from "@/lib/use-ranked";

export function DiscoverScreen() {
  const ranked = useRankedShows();
  const { going, skipped } = useDemoState();
  const active = ranked.filter((row) => !skipped.includes(row.show.id));
  const passed = ranked.filter((row) => skipped.includes(row.show.id));

  return (
    <div className="px-4 pb-28 pt-8">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Encore · Demo</p>
        <h1 className="mt-2 font-display text-[4.25rem] uppercase leading-[0.8] text-paper">September</h1>
        <p className="mt-3 max-w-[18rem] font-serif text-[1.2rem] leading-snug text-paper">
          Seattle shows, ranked for {PROFILE.name.split(" ")[0]} in Woodinville.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-mist">
          Fictional 2026 seed. Fit is a weighted score across demo signals, not the chance you will go. Nothing here sells a ticket.
        </p>
      </header>

      <ol className="mt-6 space-y-3">
        {active.map((row) => (
          <li key={row.show.id}>
            <ShowCard
              row={row}
              rank={ranked.findIndex((item) => item.show.id === row.show.id) + 1}
              featured={ranked[0]?.show.id === row.show.id}
              going={going.includes(row.show.id)}
            />
          </li>
        ))}
      </ol>

      {active.length === 0 ? (
        <p className="mt-8 font-serif text-lg text-paper">You passed on the month. Undo a skip below, or reset weights on Profile.</p>
      ) : null}

      {passed.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist">Passed</h2>
          <ul className="mt-3 space-y-3">
            {passed.map((row) => (
              <li key={row.show.id}>
                <ShowCard
                  row={row}
                  rank={ranked.findIndex((item) => item.show.id === row.show.id) + 1}
                  skipped
                />
                <button
                  type="button"
                  onClick={() => undoSkip(row.show.id)}
                  className="mt-2 text-sm text-gold"
                >
                  Undo skip
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
