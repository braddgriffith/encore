import { freeNightSummary } from "./calendar";
import { formatShortDate, withPt } from "./format";
import type { RankedShow } from "./types";

export interface ChatResult {
  text: string;
  goId?: string;
  skipId?: string;
}

const ALIASES: Record<string, string[]> = {
  "beck-chateau-2026-09-18": ["beck"],
  "weezer-cpa-2026-09-13": ["weezer"],
  "hermanos-showbox-2026-09-27": ["hermanos", "gutiérrez", "gutierrez"],
  "journey-cpa-2026-09-21": ["journey"],
  "b52s-devo-marymoor-2026-09-25": ["b-52s", "b52s", "devo"],
  "lily-allen-paramount-2026-09-24": ["lily allen", "lily", "allen"],
  "ghostbusters-benaroya-2026-09-19": ["ghostbusters", "ghostbuster"],
  "bocelli-cpa-2026-09-08": ["bocelli"],
};

function mentioned(text: string, ranked: RankedShow[]): RankedShow | undefined {
  const folded = text.toLowerCase();
  return ranked.find((row) =>
    (ALIASES[row.show.id] ?? []).some((alias) => {
      const pattern = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${pattern}\\b`, "i").test(folded);
    }),
  );
}

function pending(ranked: RankedShow[], going: string[], skipped: string[]): RankedShow[] {
  return ranked.filter((row) => !going.includes(row.show.id) && !skipped.includes(row.show.id));
}

function showLine(row: RankedShow): string {
  const { show } = row;
  return `${show.artist} · ${formatShortDate(show.date)} · ${withPt(show.showtime)} · ${show.venue} · /show/${show.id}`;
}

export function opener(ranked: RankedShow[]): string {
  const top = ranked[0];
  const next = ranked[1];
  if (!top) return "No shows in the September seed.";
  const why = top.reasons[0] ?? "It lines up with the demo signals.";
  const backup = next ? ` Next is ${next.show.artist}.` : "";
  return `Short list for September. ${top.show.artist} leads. ${why}${backup} Say go, skip, or more comedy. /show/${top.show.id}`;
}

export function replyTo(
  raw: string,
  ranked: RankedShow[],
  going: string[],
  skipped: string[],
): ChatResult {
  const text = raw.trim().toLowerCase().slice(0, 280);
  if (!text) return { text: "Say go, skip, or more comedy." };

  const hit = mentioned(text, ranked);
  const open = pending(ranked, going, skipped);

  if (/\b(comed(?:y|ies)|funny|laugh)\b/.test(text)) {
    const picks = ranked.filter(
      (row) => row.show.tags.includes("comedy-adjacent") && !skipped.includes(row.show.id),
    );
    if (!picks.length) {
      return { text: "The comedy-leaning shows are already skipped. Undo one on Discover." };
    }
    const lines = picks.map((row) => showLine(row)).join("\n");
    return {
      text: `Closer to comedy, and not a stadium:\n${lines}\nLily Allen is wry, not stand-up. Ghostbusters is the film with a symphony. The B-52s are the camp night, if the mixer moves.`,
    };
  }

  if (/\b(free night|open night|what(?:'s| is) free|calendar)\b/.test(text)) {
    return { text: `${freeNightSummary()} Show nights are on the Week tab.` };
  }

  if (/^(go|yes|yep|yeah|yup|lock( it)?|i'?m in|lets go|let's go)\b/.test(text)) {
    const target = hit ?? open[0];
    if (!target) {
      return { text: "You are through the list. Undo a skip on Discover if you want one back." };
    }
    if (going.includes(target.show.id)) {
      return { text: `${target.show.artist} is already a yes. The stub is a demo — nothing is charged. /show/${target.show.id}` };
    }
    return {
      goId: target.show.id,
      text: `Going — ${target.show.artist}, ${formatShortDate(target.show.date)} at ${target.show.venue}, ${withPt(target.show.showtime)}. Demo only, so nothing is charged. Stub: /show/${target.show.id}`,
    };
  }

  if (/^(skip|nah|nope|pass|not that|next)\b/.test(text)) {
    const target = hit ?? open[0];
    if (!target) {
      return { text: "Nothing left to skip." };
    }
    if (skipped.includes(target.show.id)) {
      return { text: `${target.show.artist} is already skipped.` };
    }
    const rest = ranked.filter(
      (row) => row.show.id !== target.show.id && !going.includes(row.show.id) && !skipped.includes(row.show.id),
    );
    const follow = rest[0]
      ? ` Next is ${rest[0].show.artist}. ${rest[0].reasons[0] ?? ""} /show/${rest[0].show.id}`
      : " That was the last one.";
    return {
      skipId: target.show.id,
      text: `Skipped ${target.show.artist}.${follow}`,
    };
  }

  if (/^why\b/.test(text)) {
    const target = hit ?? open[0] ?? ranked[0];
    if (!target) return { text: "No shows in the seed." };
    const because = target.reasons.slice(0, 3).join(" ");
    const drag = target.drags[0] ? ` Watch-out: ${target.drags[0]}` : "";
    return { text: `${target.show.artist}, fit ${target.score}. ${because}${drag} /show/${target.show.id}` };
  }

  if (hit) {
    const because = hit.reasons[0] ?? "It is on the September seed.";
    const drag = hit.drags[0] ? ` ${hit.drags[0]}` : "";
    return {
      text: `${hit.show.artist} · ${formatShortDate(hit.show.date)} · ${withPt(hit.show.showtime)} · ${hit.show.venue}. ${because}${drag} /show/${hit.show.id}`,
    };
  }

  const top = open[0] ?? ranked[0];
  return {
    text: top
      ? `I can go, skip, or tilt toward comedy. Right now ${top.show.artist} leads. /show/${top.show.id}`
      : "Say go, skip, or more comedy.",
  };
}
