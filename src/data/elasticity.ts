/**
 * Mock data and demand-model math for the Demand-Price Elasticity dashboard.
 *
 * Demand is modelled with a locally-linear elastic form anchored at the
 * tier's current base price. This keeps the math closed-form (so the
 * revenue-maximizing price has an analytic solution) and makes the curves
 * visibly interesting under realistic price moves.
 *
 *   D(p) = baselineSubs * (1 + (basePrice - p) * sensitivity / basePrice)
 *   R(p) = p * D(p)
 *   p* (revenue max) = basePrice * (1 + sensitivity) / (2 * sensitivity)
 *
 * Replace these exports with real model outputs when the backend is wired up.
 */

import type {
  Tier,
  TierMeta,
  ElasticityModel,
  ElasticityCurvePoint,
  ScenarioInput,
  ScenarioImpact,
  MarketScenarioResult,
  SensitivityFactor,
} from "./types";
import { MOCK_MARKETS } from "./mock";

export const TIER_META: TierMeta[] = [
  { id: "ad_lite",  label: "Ad-lite",          shortLabel: "Ad-lite"   },
  { id: "ad_free",  label: "Ad-free",          shortLabel: "Ad-free"   },
  { id: "ultimate", label: "Ultimate Ad-free", shortLabel: "Ultimate"  },
];

const TIER_BASE_PRICE: Record<Tier, number> = {
  ad_lite:  7.99,
  ad_free:  15.49,
  ultimate: 22.99,
};

const TIER_BASE_SENSITIVITY: Record<Tier, number> = {
  ad_lite:  1.30, // most price-sensitive (currently slightly past revenue-max)
  ad_free:  0.90, // near revenue-max
  ultimate: 0.55, // inelastic — room to raise
};

const TIER_BASE_CHURN: Record<Tier, number> = {
  ad_lite:  6.2,
  ad_free:  4.1,
  ultimate: 2.8,
};

// Stable per-market multipliers so the same scenario is reproducible.
const MARKET_SENSITIVITY_BIAS: Record<string, number> = {
  us:          0.95,
  uk:          1.00,
  brazil:      1.18,
  mexico:      1.20,
  argentina:   1.25,
  colombia:    1.15,
  chile:       1.10,
  spain:       1.08,
  france:      1.02,
  germany:     0.98,
  netherlands: 0.96,
  poland:      1.12,
  sweden:      0.92,
  norway:      0.88,
  denmark:     0.90,
  finland:     0.93,
  portugal:    1.10,
  italy:       1.05,
  canada:      0.97,
};

const MARKET_BASELINE_SUBS: Record<string, number> = {
  us:          12_400_000,
  uk:           4_100_000,
  brazil:       6_900_000,
  mexico:       3_800_000,
  argentina:    1_400_000,
  colombia:     1_100_000,
  chile:          720_000,
  spain:        2_300_000,
  france:       3_700_000,
  germany:      4_500_000,
  netherlands:  1_300_000,
  poland:       1_600_000,
  sweden:         990_000,
  norway:         710_000,
  denmark:        680_000,
  finland:        540_000,
  portugal:       620_000,
  italy:        2_650_000,
  canada:       2_050_000,
};

const TIER_SHARE: Record<Tier, number> = {
  ad_lite:  0.42,
  ad_free:  0.41,
  ultimate: 0.17,
};

const TIER_CONFIDENCE: Record<Tier, number> = {
  ad_lite:  93,
  ad_free:  91,
  ultimate: 86,
};

export function getMarketLabel(value: string): string {
  return MOCK_MARKETS.find((m) => m.value === value)?.label ?? value;
}

export function getElasticityModel(tier: Tier, market: string): ElasticityModel {
  const baseSens   = TIER_BASE_SENSITIVITY[tier];
  const bias       = MARKET_SENSITIVITY_BIAS[market] ?? 1;
  const sensitivity = +(baseSens * bias).toFixed(3);
  const totalSubs   = MARKET_BASELINE_SUBS[market] ?? 1_000_000;
  const baselineSubs = Math.round(totalSubs * TIER_SHARE[tier]);
  const confidenceJitter = (bias - 1) * -8; // tighter sensitivity = higher confidence
  const confidence = Math.max(72, Math.min(98, Math.round(TIER_CONFIDENCE[tier] + confidenceJitter)));
  const sampleSize = Math.round(baselineSubs * 0.04); // 4% sample
  return {
    tier,
    market,
    basePrice:    TIER_BASE_PRICE[tier],
    baselineSubs,
    sensitivity,
    confidence,
    sampleSize,
  };
}

function demandAt(model: ElasticityModel, price: number): number {
  const { baselineSubs, basePrice, sensitivity } = model;
  const raw = baselineSubs * (1 + (basePrice - price) * sensitivity / basePrice);
  return Math.max(0, raw);
}

/** Confidence-band half-width as a fraction of demand at price p. */
function confidenceHalfWidth(model: ElasticityModel, price: number): number {
  const distance = Math.abs(price - model.basePrice) / model.basePrice;
  const base = (100 - model.confidence) / 100; // 0.07 at 93% conf
  return base + distance * 0.6; // wider further from anchor
}

export function buildElasticityCurve(model: ElasticityModel, samples = 41): ElasticityCurvePoint[] {
  const minPrice = Math.max(0.5, model.basePrice * 0.55);
  const maxPrice = model.basePrice * 1.55;
  const step = (maxPrice - minPrice) / (samples - 1);
  const points: ElasticityCurvePoint[] = [];
  for (let i = 0; i < samples; i++) {
    const price = +(minPrice + i * step).toFixed(2);
    const demand = demandAt(model, price);
    const halfWidth = confidenceHalfWidth(model, price);
    const demandLow  = Math.max(0, demand * (1 - halfWidth));
    const demandHigh = demand * (1 + halfWidth);
    points.push({
      price,
      demand:     Math.round(demand),
      demandLow:  Math.round(demandLow),
      demandHigh: Math.round(demandHigh),
      revenue:    +(price * demand).toFixed(2),
    });
  }
  return points;
}

/** Closed-form revenue-maximizing price for the linear elastic model. */
export function revenueMaxPrice(model: ElasticityModel): number {
  const { basePrice, sensitivity } = model;
  return +(basePrice * (1 + sensitivity) / (2 * sensitivity)).toFixed(2);
}

export function computeScenarioImpact(input: ScenarioInput): ScenarioImpact {
  const model = getElasticityModel(input.tier, input.market);
  const newPrice = +(model.basePrice + input.priceDelta).toFixed(2);

  const baselineSubs    = model.baselineSubs;
  const projectedSubs   = Math.round(demandAt(model, newPrice));
  const baselineRevenue = +(model.basePrice * baselineSubs).toFixed(2);
  const projectedRevenue = +(newPrice * projectedSubs).toFixed(2);

  const baselineChurnRate = TIER_BASE_CHURN[input.tier];
  // Churn rises ~0.45pp per 10% price increase, scaled by sensitivity.
  const pricePctChange    = (newPrice - model.basePrice) / model.basePrice;
  const churnDelta        = pricePctChange * 0.045 * model.sensitivity * 100;
  const projectedChurnRate = +(baselineChurnRate + churnDelta).toFixed(2);

  const subsDeltaPct    = ((projectedSubs    - baselineSubs)    / baselineSubs)    * 100;
  const revenueDeltaPct = ((projectedRevenue - baselineRevenue) / baselineRevenue) * 100;
  const churnDeltaPct   = ((projectedChurnRate - baselineChurnRate) / baselineChurnRate) * 100;

  // Confidence drops as we move further from anchor; horizon adds mild uncertainty.
  const distance = Math.abs(input.priceDelta) / model.basePrice;
  const horizonPenalty = (input.horizonMonths - 6) * 0.4;
  const confidence = Math.max(55, Math.round(model.confidence - distance * 25 - horizonPenalty));

  return {
    basePrice:        model.basePrice,
    newPrice,
    baselineSubs,
    projectedSubs,
    baselineRevenue,
    projectedRevenue,
    baselineChurnRate,
    projectedChurnRate,
    subsDeltaPct:     +subsDeltaPct.toFixed(2),
    revenueDeltaPct:  +revenueDeltaPct.toFixed(2),
    churnDeltaPct:    +churnDeltaPct.toFixed(2),
    confidence,
  };
}

const COMPARABLE_BUNDLES: Record<string, string[]> = {
  us:          ["canada", "uk", "australia"],
  uk:          ["germany", "france", "netherlands"],
  brazil:      ["mexico", "argentina", "colombia"],
  mexico:      ["brazil", "argentina", "chile"],
  argentina:   ["brazil", "mexico", "chile"],
  colombia:    ["brazil", "mexico", "chile"],
  chile:       ["brazil", "mexico", "argentina"],
  spain:       ["italy", "portugal", "france"],
  france:      ["germany", "italy", "netherlands"],
  germany:     ["france", "netherlands", "uk"],
  netherlands: ["germany", "france", "denmark"],
  poland:      ["spain", "italy", "portugal"],
  sweden:      ["norway", "denmark", "finland"],
  norway:      ["sweden", "denmark", "finland"],
  denmark:     ["sweden", "norway", "netherlands"],
  finland:     ["sweden", "norway", "denmark"],
  portugal:    ["spain", "italy", "poland"],
  italy:       ["spain", "france", "portugal"],
  canada:      ["us", "uk", "germany"],
};

export function comparableMarkets(market: string): string[] {
  return COMPARABLE_BUNDLES[market] ?? ["us", "uk", "germany"];
}

export function computeCrossMarketResults(input: ScenarioInput): MarketScenarioResult[] {
  const peers = comparableMarkets(input.market);
  return peers
    .filter((m) => MOCK_MARKETS.some((mm) => mm.value === m))
    .map((m, idx) => {
      const peerModel  = getElasticityModel(input.tier, m);
      const peerImpact = computeScenarioImpact({ ...input, market: m });
      // Pre-computed similarity scores reflecting how close each peer is to
      // the treatment market's profile; declines down the list.
      const similarity = 92 - idx * 4;
      return {
        market:       m,
        marketLabel:  getMarketLabel(m),
        basePrice:    peerModel.basePrice,
        newPrice:     peerImpact.newPrice,
        subsDeltaPct:    peerImpact.subsDeltaPct,
        revenueDeltaPct: peerImpact.revenueDeltaPct,
        similarity,
      };
    });
}

export function computeSensitivityFactors(input: ScenarioInput): SensitivityFactor[] {
  const baseImpact = computeScenarioImpact(input);
  const baseRev = baseImpact.revenueDeltaPct;

  // Flex elasticity ±10%
  const elasticityFlex = (() => {
    const flexedHi = computeScenarioImpactWithFlex(input, { sensitivityMul: 1.1 });
    const flexedLo = computeScenarioImpactWithFlex(input, { sensitivityMul: 0.9 });
    return [flexedLo.revenueDeltaPct - baseRev, flexedHi.revenueDeltaPct - baseRev];
  })();

  // Flex baseline subs ±5%
  const baselineSubsFlex = (() => {
    const flexedHi = computeScenarioImpactWithFlex(input, { baselineSubsMul: 1.05 });
    const flexedLo = computeScenarioImpactWithFlex(input, { baselineSubsMul: 0.95 });
    // baseline subs scales both numerator and denominator → revenue % unchanged.
    // Show as small impact via downstream churn-driven net rev (proxy).
    return [
      (flexedLo.revenueDeltaPct - baseRev) - 0.4,
      (flexedHi.revenueDeltaPct - baseRev) + 0.4,
    ];
  })();

  // Flex horizon ±3 months (uncertainty grows over time)
  const horizonFlex = (() => {
    const longer  = computeScenarioImpact({ ...input, horizonMonths: input.horizonMonths + 3 });
    const shorter = computeScenarioImpact({ ...input, horizonMonths: Math.max(1, input.horizonMonths - 3) });
    return [shorter.revenueDeltaPct - baseRev - 0.6, longer.revenueDeltaPct - baseRev + 1.1];
  })();

  // Flex churn coefficient ±20%
  const churnFlex = (() => {
    const flexedHi = computeScenarioImpactWithFlex(input, { churnMul: 1.2 });
    const flexedLo = computeScenarioImpactWithFlex(input, { churnMul: 0.8 });
    // churn doesn't directly enter revenue, but reflects retention drag → translate as revenue penalty.
    const churnPenalty = (flexedHi.churnDeltaPct - flexedLo.churnDeltaPct) * 0.05;
    return [-churnPenalty, churnPenalty];
  })();

  return [
    {
      label: "Elasticity coefficient",
      description: "Model's estimate of how subscriber demand responds to price.",
      lowImpactPct:  +elasticityFlex[0].toFixed(2),
      highImpactPct: +elasticityFlex[1].toFixed(2),
    },
    {
      label: "Time horizon",
      description: "Uncertainty grows the further out we project.",
      lowImpactPct:  +horizonFlex[0].toFixed(2),
      highImpactPct: +horizonFlex[1].toFixed(2),
    },
    {
      label: "Baseline subscriber count",
      description: "Starting subscriber count for this tier × market.",
      lowImpactPct:  +baselineSubsFlex[0].toFixed(2),
      highImpactPct: +baselineSubsFlex[1].toFixed(2),
    },
    {
      label: "Churn response",
      description: "How sharply churn rate moves with price changes.",
      lowImpactPct:  +churnFlex[0].toFixed(2),
      highImpactPct: +churnFlex[1].toFixed(2),
    },
  ];
}

interface FlexOptions {
  sensitivityMul?: number;
  baselineSubsMul?: number;
  churnMul?: number;
}

function computeScenarioImpactWithFlex(input: ScenarioInput, opts: FlexOptions): ScenarioImpact {
  const base = getElasticityModel(input.tier, input.market);
  const flexed: ElasticityModel = {
    ...base,
    sensitivity:  base.sensitivity * (opts.sensitivityMul ?? 1),
    baselineSubs: base.baselineSubs * (opts.baselineSubsMul ?? 1),
  };
  const newPrice = +(flexed.basePrice + input.priceDelta).toFixed(2);
  const projectedSubs   = demandAt(flexed, newPrice);
  const baselineRevenue = flexed.basePrice * flexed.baselineSubs;
  const projectedRevenue = newPrice * projectedSubs;
  const subsDeltaPct    = ((projectedSubs    - flexed.baselineSubs) / flexed.baselineSubs) * 100;
  const revenueDeltaPct = ((projectedRevenue - baselineRevenue)     / baselineRevenue)     * 100;

  const baseChurn = TIER_BASE_CHURN[input.tier];
  const pricePctChange = (newPrice - flexed.basePrice) / flexed.basePrice;
  const churnDelta = pricePctChange * 0.045 * flexed.sensitivity * 100 * (opts.churnMul ?? 1);
  const projectedChurnRate = baseChurn + churnDelta;
  const churnDeltaPct = (churnDelta / baseChurn) * 100;

  return {
    basePrice:         flexed.basePrice,
    newPrice,
    baselineSubs:      Math.round(flexed.baselineSubs),
    projectedSubs:     Math.round(projectedSubs),
    baselineRevenue:   +baselineRevenue.toFixed(2),
    projectedRevenue:  +projectedRevenue.toFixed(2),
    baselineChurnRate: baseChurn,
    projectedChurnRate: +projectedChurnRate.toFixed(2),
    subsDeltaPct:      +subsDeltaPct.toFixed(2),
    revenueDeltaPct:   +revenueDeltaPct.toFixed(2),
    churnDeltaPct:     +churnDeltaPct.toFixed(2),
    confidence:        flexed.confidence,
  };
}

export const HORIZON_OPTIONS: { value: number; label: string }[] = [
  { value: 3,  label: "3 months"  },
  { value: 6,  label: "6 months"  },
  { value: 12, label: "12 months" },
];

export const DEFAULT_SCENARIO: ScenarioInput = {
  tier: "ad_lite",
  market: "us",
  priceDelta: 1.0,
  horizonMonths: 6,
};
