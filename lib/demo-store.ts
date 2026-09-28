"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SHOWS } from "./mock-data";
import { DEFAULT_WEIGHTS } from "./ranker";
import { SIGNAL_KINDS, type IntentSignalKind } from "./types";

const STORAGE_KEY = "encore.demo.v1";

export interface DemoState {
  weights: Record<IntentSignalKind, number>;
  going: string[];
  skipped: string[];
  ready: boolean;
}

const knownIds = new Set(SHOWS.map((show) => show.id));

function blankState(ready: boolean): DemoState {
  return {
    weights: { ...DEFAULT_WEIGHTS },
    going: [],
    skipped: [],
    ready,
  };
}

function sanitizeWeights(input: unknown): Record<IntentSignalKind, number> {
  const next = { ...DEFAULT_WEIGHTS };
  if (!input || typeof input !== "object") return next;
  const record = input as Record<string, unknown>;
  for (const kind of SIGNAL_KINDS) {
    const value = record[kind];
    if (typeof value === "number" && Number.isFinite(value)) {
      next[kind] = Math.min(1, Math.max(0, value));
    }
  }
  return next;
}

function sanitizeIds(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter((id): id is string => typeof id === "string" && knownIds.has(id));
}

let state: DemoState = blankState(false);
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): DemoState {
  return state;
}

export function readDemo(): DemoState {
  return state;
}

function persist(): void {
  if (!state.ready || typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ weights: state.weights, going: state.going, skipped: state.skipped }),
  );
}

export function hydrateDemo(): void {
  if (state.ready || typeof window === "undefined") return;
  let next = blankState(true);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoState>;
      next = {
        weights: sanitizeWeights(parsed.weights),
        going: sanitizeIds(parsed.going),
        skipped: sanitizeIds(parsed.skipped).filter((id) => !sanitizeIds(parsed.going).includes(id)),
        ready: true,
      };
    }
  } catch {
    next = blankState(true);
  }
  state = next;
  emit();
}

function update(patch: Partial<Omit<DemoState, "ready">>): void {
  if (!state.ready) hydrateDemo();
  state = { ...state, ...patch, ready: true };
  persist();
  emit();
}

export function setWeight(kind: IntentSignalKind, value: number): void {
  update({ weights: { ...state.weights, [kind]: Math.min(1, Math.max(0, value)) } });
}

export function markGoing(id: string): void {
  if (!knownIds.has(id)) return;
  const going = state.going.includes(id) ? state.going : [...state.going, id];
  update({ going, skipped: state.skipped.filter((item) => item !== id) });
}

export function toggleGoing(id: string): void {
  if (!knownIds.has(id)) return;
  const going = state.going.includes(id)
    ? state.going.filter((item) => item !== id)
    : [...state.going, id];
  update({ going, skipped: state.skipped.filter((item) => item !== id) });
}

export function skipShow(id: string): void {
  if (!knownIds.has(id) || state.skipped.includes(id)) return;
  update({
    skipped: [...state.skipped, id],
    going: state.going.filter((item) => item !== id),
  });
}

export function undoSkip(id: string): void {
  update({ skipped: state.skipped.filter((item) => item !== id) });
}

export function resetDemo(): void {
  update({ weights: { ...DEFAULT_WEIGHTS }, going: [], skipped: [] });
}

export function useDemoState(): DemoState {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    hydrateDemo();
  }, []);
  return snapshot;
}
