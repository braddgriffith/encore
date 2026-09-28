import { weekdayIndex } from "./format";
import type {
  Contribution,
  IntentSignal,
  IntentSignalKind,
  RankedShow,
  Show,
} from "./types";

/**
 * Rank September shows from intent signals.
 *
 * Matchers below are deliberate stand-ins. Wire real accounts here
 * without changing the card props:
 *
 * TODO(gmail): Replace `receipt` signals with parsed Gmail order mail
 * (Ticketmaster, AXS, venue box office). Do not scrape a live inbox
 * from the client.
 * TODO(gcal): Replace `calendar_history` and `free_window` with Google
 * Calendar free/busy and past event titles.
 * TODO(spotify): Replace `streaming` signals with Spotify top artists,
 * recently played, and genre affinity.
 *
 * `geo` is the demo home base (Woodinville). `sms_intent` is a Messages
 * export, not a live read of the phone.
 */

export const DEFAULT_WEIGHTS: Record<IntentSignalKind, number> = {
  receipt: 0.7,
  calendar_history: 0.66,
  streaming: 1,
  geo: 0.92,
  sms_intent: 0.9,
  free_window: 0.98,
};

const CONFLICT_FACTOR = { hard: 0.72, soft: 0.88 } as const;

/** Compresses raw weight into a 0–99 fit. A score, not a probability. */
const FIT_DIVISOR = 220;

const REASON_PRIORITY: IntentSignalKind[] = [
  "sms_intent",
  "streaming",
  "geo",
  "free_window",
  "receipt",
  "calendar_history",
];

export function signalMatches(signal: IntentSignal, show: Show): boolean {
  const match = signal.match;
  const checks: boolean[] = [];

  if (match.artists?.length) {
    checks.push(
      match.artists.some((artist) => show.artist.toLowerCase().includes(artist.toLowerCase())),
    );
  }
  if (match.genres?.length) {
    checks.push(
      match.genres.some((genre) =>
        show.genres.some((candidate) => candidate.toLowerCase() === genre.toLowerCase()),
      ),
    );
  }
  if (match.venues?.length) {
    checks.push(
      match.venues.some((venue) => show.venue.toLowerCase().includes(venue.toLowerCase())),
    );
  }
  if (match.dates?.length) {
    checks.push(match.dates.includes(show.date));
  }
  if (match.tags?.length) {
    checks.push(match.tags.some((tag) => show.tags.includes(tag)));
  }
  if (match.rooms?.length) {
    checks.push(match.rooms.includes(show.room));
  }
  if (match.maxMinutes != null) {
    checks.push(show.drive.minutes <= match.maxMinutes);
  }
  if (match.weekdays?.length) {
    checks.push(match.weekdays.includes(weekdayIndex(show.date)));
  }

  return checks.length > 0 && checks.every(Boolean);
}

function fill(template: string, show: Show): string {
  return template
    .replaceAll("{artist}", show.artist)
    .replaceAll("{venue}", show.venue)
    .replaceAll("{minutes}", String(show.drive.minutes));
}

function fitScore(raw: number): number {
  if (raw <= 0) return 0;
  const score = Math.round(100 * (1 - Math.exp(-raw / FIT_DIVISOR)));
  return Math.max(0, Math.min(99, score));
}

export function rankShows(
  shows: Show[],
  signals: IntentSignal[],
  weights: Record<IntentSignalKind, number> = DEFAULT_WEIGHTS,
): RankedShow[] {
  const ranked = shows.map((show) => {
    const contributions: Contribution[] = [];

    for (const signal of signals) {
      if (!signalMatches(signal, show)) continue;
      const weight = weights[signal.kind] ?? 0;
      const magnitude = signal.strength * weight * (signal.polarity === "positive" ? 100 : 70);
      const points = signal.polarity === "positive" ? magnitude : -magnitude;
      if (points === 0) continue;
      contributions.push({
        signalId: signal.id,
        kind: signal.kind,
        label: signal.label,
        blurb: fill(signal.blurb, show),
        polarity: signal.polarity,
        points,
      });
    }

    const signalRaw = contributions.reduce((sum, contribution) => sum + contribution.points, 0);
    const factor = show.conflict ? CONFLICT_FACTOR[show.conflict.severity] : 1;
    const raw = Math.max(0, signalRaw * factor);

    const positives = contributions
      .filter((contribution) => contribution.polarity === "positive")
      .sort((a, b) => {
        const priority = REASON_PRIORITY.indexOf(a.kind) - REASON_PRIORITY.indexOf(b.kind);
        if (priority !== 0) return priority;
        return b.points - a.points;
      });

    const negatives = contributions
      .filter((contribution) => contribution.polarity === "negative")
      .sort((a, b) => a.points - b.points);

    const reasons = positives.map((contribution) => contribution.blurb);
    const drags = [
      ...negatives.map((contribution) => contribution.blurb),
      ...(show.conflict ? [show.conflict.detail] : []),
    ];

    return {
      show,
      score: fitScore(raw),
      raw,
      reasons,
      drags,
      contributions,
    };
  });

  ranked.sort((a, b) => b.raw - a.raw || a.show.date.localeCompare(b.show.date));
  return ranked;
}
