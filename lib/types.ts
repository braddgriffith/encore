export const SIGNAL_KINDS = [
  "receipt",
  "calendar_history",
  "streaming",
  "geo",
  "sms_intent",
  "free_window",
] as const;

export type IntentSignalKind = (typeof SIGNAL_KINDS)[number];

export type Room = "arena" | "amphitheater" | "theater" | "club" | "park";

export interface Drive {
  minutes: number;
  miles: number;
  /** How the drive feels from Woodinville. Not a live traffic estimate. */
  vibe: string;
}

export interface Conflict {
  severity: "hard" | "soft";
  title: string;
  when: string;
  detail: string;
}

export interface TicketStub {
  section: string;
  seat: string;
  faceValue: number;
  confirmation: string;
  seller: string;
}

export interface PriorStub {
  artist: string;
  when: string;
  venue: string;
  confirmation: string;
  note: string;
}

export interface Show {
  id: string;
  artist: string;
  venue: string;
  address: string;
  neighborhood: string;
  date: string;
  doors: string;
  showtime: string;
  ends: string;
  genres: string[];
  tags: Array<"outdoor" | "intimate" | "comedy-adjacent">;
  room: Room;
  accent: string;
  priceFrom: number;
  venueUrl: string;
  drive: Drive;
  conflict: Conflict | null;
  stub: TicketStub;
  priorStub?: PriorStub;
  note: string;
}

export interface SignalMatch {
  artists?: string[];
  genres?: string[];
  venues?: string[];
  dates?: string[];
  tags?: Show["tags"];
  rooms?: Room[];
  /** Match when the drive is at most this many minutes. */
  maxMinutes?: number;
  /** 0 Sunday … 6 Saturday, America/Los_Angeles. */
  weekdays?: number[];
}

export interface IntentSignal {
  id: string;
  kind: IntentSignalKind;
  label: string;
  detail: string;
  /** 0–1 evidence strength, before the profile weight. */
  strength: number;
  polarity: "positive" | "negative";
  /** Demo source. Nothing here is read from a live account. */
  source: string;
  /** Supports {artist}, {venue}, and {minutes}. */
  blurb: string;
  match: SignalMatch;
}

export interface Contribution {
  signalId: string;
  kind: IntentSignalKind;
  label: string;
  blurb: string;
  polarity: "positive" | "negative";
  points: number;
}

export interface RankedShow {
  show: Show;
  /** 0–99 weighted fit. A score, not a probability. */
  score: number;
  /** Post-conflict raw total used to sort. */
  raw: number;
  reasons: string[];
  drags: string[];
  contributions: Contribution[];
}

export interface EveningHold {
  date: string;
  label: string;
}

export const KIND_LABEL: Record<IntentSignalKind, string> = {
  receipt: "Receipts",
  calendar_history: "Calendar history",
  streaming: "Streaming",
  geo: "Drive from home",
  sms_intent: "Texts",
  free_window: "Free nights",
};

export const KIND_SHORT: Record<IntentSignalKind, string> = {
  receipt: "Receipt",
  calendar_history: "Calendar",
  streaming: "Streaming",
  geo: "Drive",
  sms_intent: "Texts",
  free_window: "Free night",
};

export const KIND_HINT: Record<IntentSignalKind, string> = {
  receipt: "Would read Gmail ticket mail. Not connected.",
  calendar_history: "Would read Google Calendar history. Not connected.",
  streaming: "Would read Spotify. Not connected.",
  geo: "Demo home base: Woodinville, WA 98072.",
  sms_intent: "Demo Messages export, not a live inbox.",
  free_window: "Would read Google Calendar free/busy. Not connected.",
};
