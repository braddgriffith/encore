import { replyTo } from "../lib/chat";
import { weekdayIndex } from "../lib/format";
import { SHOWS, SIGNALS } from "../lib/mock-data";
import { rankShows } from "../lib/ranker";

const expected = [
  "beck-chateau-2026-09-18",
  "hermanos-showbox-2026-09-27",
  "ghostbusters-benaroya-2026-09-19",
  "lily-allen-paramount-2026-09-24",
  "b52s-devo-marymoor-2026-09-25",
  "weezer-cpa-2026-09-13",
  "journey-cpa-2026-09-21",
  "bocelli-cpa-2026-09-08",
];

let failed = 0;

function assert(condition: unknown, message: string): void {
  if (!condition) {
    failed += 1;
    console.error(`FAIL ${message}`);
  }
}

const ranked = rankShows(SHOWS, SIGNALS);
console.log("rank  fit  raw    artist");
for (const [index, row] of ranked.entries()) {
  console.log(
    `${String(index + 1).padStart(2)}   ${String(row.score).padStart(3)}  ${row.raw.toFixed(1).padStart(6)}  ${row.show.artist}`,
  );
  console.log(`    why: ${row.reasons[0] ?? "(none)"}`);
  if (row.drags[0]) console.log(`    drag: ${row.drags[0]}`);
}

assert(ranked.map((row) => row.show.id).join("|") === expected.join("|"), `order ${ranked.map((r) => r.show.id).join(" > ")}`);
assert(new Set(SHOWS.map((show) => show.id)).size === 8, "8 unique shows");
assert(weekdayIndex("2026-09-18") === 5, "Sep 18 2026 is Friday");
assert(weekdayIndex("2026-09-21") === 1, "Sep 21 2026 is Monday");
assert(
  ranked.every((row) => row.reasons.length > 0 && row.score >= 0 && row.score <= 99),
  "every show has a reason and a fit score",
);
assert(ranked[0].reasons[0]?.includes("texted about Beck"), "Beck leads with the text");

const go = replyTo("Go", ranked, [], []);
assert(go.goId === expected[0] && go.text.includes("Beck"), "go locks Beck");

const skip = replyTo("skip", ranked, [], []);
assert(skip.skipId === expected[0] && skip.text.includes("Hermanos"), "skip moves to Hermanos");

const comedy = replyTo("more comedy", ranked, [], []);
assert(
  comedy.text.includes("Ghostbusters") && comedy.text.includes("Lily Allen") && comedy.text.includes("B-52s"),
  "more comedy names the three comedy-adjacent shows",
);

const zeroed = rankShows(SHOWS, SIGNALS, {
  receipt: 0,
  calendar_history: 0,
  streaming: 0,
  geo: 0,
  sms_intent: 0,
  free_window: 0,
});
assert(zeroed.every((row) => row.score === 0), "zero weights produce zero fit");

if (failed > 0) {
  console.error(`${failed} assertion(s) failed`);
  process.exit(1);
}

console.log("ok");
