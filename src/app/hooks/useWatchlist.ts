import { useState, useEffect } from "react";
import type { ModelType, Tier } from "@/data/types";

export type TakeawayType = "trend" | "volatility" | "anomaly";

export interface PinnedTakeaway {
  kind: "takeaway";
  key: string;
  modelType: ModelType;
  type: TakeawayType;
  direction?: "positive" | "negative" | "neutral";
  headline: string;
  market?: string;
  pinnedAt: number;
}

export interface PinnedScenario {
  kind: "scenario";
  key: string;
  tier: Tier;
  market: string;
  basePrice: number;
  newPrice: number;
  priceDelta: number;
  horizonMonths: number;
  subsDeltaPct: number;
  revenueDeltaPct: number;
  confidence: number;
  pinnedAt: number;
}

export type PinnedItem = PinnedTakeaway | PinnedScenario;

export const MARKET_CODE: Record<string, string> = {
  us:          "US",
  uk:          "UK",
  brazil:      "BR",
  mexico:      "MX",
  argentina:   "AR",
  colombia:    "CO",
  chile:       "CL",
  spain:       "ES",
  france:      "FR",
  germany:     "DE",
  netherlands: "NL",
  poland:      "PL",
  sweden:      "SE",
  norway:      "NO",
  denmark:     "DK",
  finland:     "FI",
  portugal:    "PT",
  italy:       "IT",
  canada:      "CA",
};

const STORAGE_KEY = "prism-watchlist";

function loadFromStorage(): PinnedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PinnedItem[];
    // Migrate legacy entries (pre-discriminated-union) to default takeaway kind.
    return parsed.map((item) => {
      if ((item as { kind?: string }).kind) return item;
      return { ...(item as object), kind: "takeaway" } as PinnedTakeaway;
    });
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [pinned, setPinned] = useState<PinnedItem[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pinned));
  }, [pinned]);

  const isPinned = (key: string) => pinned.some((p) => p.key === key);

  const pin = (item: Omit<PinnedTakeaway, "pinnedAt"> | Omit<PinnedScenario, "pinnedAt">) => {
    if (isPinned(item.key)) return;
    setPinned((prev) => [...prev, { ...item, pinnedAt: Date.now() } as PinnedItem]);
  };

  const unpin = (key: string) => setPinned((prev) => prev.filter((p) => p.key !== key));

  const toggle = (item: Omit<PinnedTakeaway, "pinnedAt"> | Omit<PinnedScenario, "pinnedAt">) =>
    isPinned(item.key) ? unpin(item.key) : pin(item);

  return { pinned, isPinned, pin, unpin, toggle };
}
