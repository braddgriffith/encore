# Encore

Phone-first concert discovery for Brad Griffith — Woodinville, WA, and Seattle live shows.

September 2026 is a **fictional seed**, ranked from mock intent signals. Encore does not sell tickets and does not call a ticket API.

## Run

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The layout is a 390px phone column.

```bash
npm run build
npm run check
```

`check` locks the default September ranking and the text replies (go, skip, more comedy).

## Screens

| Route | What it is |
| --- | --- |
| `/` | Discover. Ranked show cards and a why-for-you line. |
| `/show/[id]` | Pacific Time doors / show / end, drive from Woodinville, demo ticket stub, calendar conflict. |
| `/profile` | Signal weights. Labeled demo. Sliders re-rank the month in this browser. |
| `/text` | iMessage-style thread. Try **Go**, **Skip**, or **More comedy**. |
| `/week` | Mock September 2026 calendar. Free nights against show nights. |

## September seed

| Date | Show | Room |
| --- | --- | --- |
| Tue Sep 8 | Andrea Bocelli · Climate Pledge Arena | Arena, soft weeknight |
| Sun Sep 13 | Weezer · Climate Pledge Arena | Hard conflict with Sunday dinner |
| Fri Sep 18 | Beck · Chateau Ste. Michelle | Short drive, night is clear |
| Sat Sep 19 | Ghostbusters in Concert · Benaroya Hall | Film and symphony |
| Mon Sep 21 | Journey · Climate Pledge Arena | Soft conflict with Tuesday standup |
| Thu Sep 24 | Lily Allen · Paramount Theatre | Seated, night is clear |
| Fri Sep 25 | The B-52s + DEVO · Marymoor Park | Hard conflict with a mixer |
| Sun Sep 27 | Hermanos Gutiérrez · The Showbox | Recently played, night is clear |

## How a show gets its rank

Signals live in `lib/mock-data.ts` as `IntentSignal` records:

`receipt` · `calendar_history` · `streaming` · `geo` · `sms_intent` · `free_window`

`lib/ranker.ts` scores each show from those signals times the Profile weights, then cuts the total when the mock calendar conflicts. Fit is that weighted score, not a probability.

The ranker is the seam for real accounts. It does not read them today:

- **TODO(gmail):** replace `receipt` with parsed order mail.
- **TODO(gcal):** replace `calendar_history` and `free_window` with Google Calendar.
- **TODO(spotify):** replace `streaming` with top artists and recently played.

`geo` is the Woodinville home base. `sms_intent` is a demo Messages export, not a live inbox.

Going and skip choices, plus slider weights, stay in `localStorage` under `encore.demo.v1`.
