"use client";

import Link from "next/link";
import { resetDemo, setWeight, undoSkip, useDemoState } from "@/lib/demo-store";
import { getShow, PROFILE, SIGNALS } from "@/lib/mock-data";
import { KIND_HINT, KIND_LABEL, SIGNAL_KINDS, type IntentSignalKind } from "@/lib/types";

export function ProfileScreen() {
  const { weights, going, skipped } = useDemoState();

  return (
    <div className="px-4 pb-28 pt-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Encore · Demo</p>
      <h1 className="mt-2 font-display text-6xl uppercase leading-[0.85] text-paper">Signals</h1>
      <p className="mt-3 font-serif text-lg leading-snug text-paper">
        Taste and intent weights for {PROFILE.name}, {PROFILE.home} {PROFILE.zip}.
      </p>

      <div className="mt-4 rounded-2xl border border-dashed border-gold/50 px-4 py-3 text-sm leading-relaxed text-mist">
        Demo data, stored in this browser only. Gmail, Google Calendar, and Spotify are not connected. A slider re-ranks September immediately.
      </div>

      <ul className="mt-4 space-y-1 text-xs uppercase tracking-[0.14em] text-mist">
        <li>TODO · Gmail receipts</li>
        <li>TODO · Calendar history and free/busy</li>
        <li>TODO · Spotify recently played</li>
      </ul>

      {SIGNAL_KINDS.map((kind) => (
        <SignalGroup key={kind} kind={kind} value={weights[kind]} />
      ))}

      <section className="mt-10">
        <h2 className="font-display text-3xl uppercase text-paper">Decisions</h2>
        {going.length === 0 && skipped.length === 0 ? (
          <p className="mt-2 text-sm text-mist">None yet. Go or skip from Discover or Text.</p>
        ) : null}
        <ul className="mt-3 space-y-2">
          {going.map((id) => {
            const show = getShow(id);
            if (!show) return null;
            return (
              <li key={id} className="flex items-center justify-between gap-3 text-sm">
                <Link href={`/show/${id}`} className="text-paper">
                  {show.artist}
                </Link>
                <span className="text-[10px] uppercase tracking-wider text-moss">Going</span>
              </li>
            );
          })}
          {skipped.map((id) => {
            const show = getShow(id);
            if (!show) return null;
            return (
              <li key={id} className="flex items-center justify-between gap-3 text-sm">
                <Link href={`/show/${id}`} className="text-mist">
                  {show.artist}
                </Link>
                <button type="button" onClick={() => undoSkip(id)} className="text-gold">
                  Undo skip
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={resetDemo}
          className="mt-6 w-full rounded-full border border-white/15 py-3 text-sm text-paper"
        >
          Reset demo
        </button>
      </section>
    </div>
  );
}

function SignalGroup({ kind, value }: { kind: IntentSignalKind; value: number }) {
  const signals = SIGNALS.filter((signal) => signal.kind === kind);
  const percent = Math.round(value * 100);

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-display text-3xl uppercase leading-none text-paper">{KIND_LABEL[kind]}</h2>
        <p className="font-display text-3xl leading-none text-gold">{percent}</p>
      </div>
      <p className="mt-2 text-sm text-mist">{KIND_HINT[kind]}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{kind}</p>
      <label className="mt-3 block">
        <span className="sr-only">{KIND_LABEL[kind]} weight</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={percent}
          onChange={(event) => setWeight(kind, Number(event.target.value) / 100)}
        />
      </label>
      <ul>
        {signals.map((signal) => (
          <li key={signal.id} className="border-b border-white/10 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm text-paper">{signal.label}</p>
              <span className="shrink-0 text-[10px] uppercase tracking-wider text-mist">
                {signal.polarity === "negative" ? "Drag" : "Pull"}
              </span>
            </div>
            <p className="mt-1 text-sm leading-snug text-mist">{signal.detail}</p>
            <p className="mt-1 text-[11px] text-gold/80">{signal.source}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
