"use client";

import { useMemo } from "react";
import { useDemoState } from "./demo-store";
import { SHOWS, SIGNALS } from "./mock-data";
import { rankShows } from "./ranker";
import type { RankedShow } from "./types";

export function useRankedShows(): RankedShow[] {
  const { weights } = useDemoState();
  return useMemo(() => rankShows(SHOWS, SIGNALS, weights), [weights]);
}
