import { ArrowRight, TrendingUp, TrendingDown, Minus, Shield } from "lucide-react";
import type { ScenarioImpact, ScenarioInput } from "@/data/types";
import { TIER_META, getMarketLabel } from "@/data/elasticity";

interface ImpactHeroProps {
  scenario: ScenarioInput;
  impact: ScenarioImpact;
}

function fmtCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function fmtRevenue(n: number): string {
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(n) >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtSigned(v: number, suffix = "%"): string {
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}${suffix}`;
}

interface MetricProps {
  label: string;
  before: string;
  after: string;
  deltaPct: number;
  deltaIsBad: boolean; // true if positive delta is harmful (e.g. churn)
}

function Metric({ label, before, after, deltaPct, deltaIsBad }: MetricProps) {
  const isPositive = deltaPct > 0.005;
  const isNegative = deltaPct < -0.005;
  const isFlat = !isPositive && !isNegative;
  const goodDirection =
    (isPositive && !deltaIsBad) || (isNegative && deltaIsBad);
  const color = isFlat
    ? "text-[#7B7694]"
    : goodDirection
    ? "text-[#10B981]"
    : "text-[#E94560]";
  const Icon = isFlat ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="flex-1 px-5 py-4 bg-white border border-[#E8E4F0] rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#7B7694] font-medium">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-sm text-[#7B7694]">{before}</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#B5B0C8]" />
        <span className="font-mono text-base text-[#1E1B3A] font-semibold">{after}</span>
      </div>
      <div className={`text-xs font-mono font-semibold ${color}`}>{fmtSigned(deltaPct)}</div>
    </div>
  );
}

function buildNarrative(scenario: ScenarioInput, impact: ScenarioImpact): string {
  const tier = TIER_META.find((t) => t.id === scenario.tier)?.label ?? "tier";
  const market = getMarketLabel(scenario.market);
  const direction = scenario.priceDelta >= 0 ? "increase" : "decrease";
  const absDelta = Math.abs(scenario.priceDelta);

  if (Math.abs(scenario.priceDelta) < 0.005) {
    return `No price change selected — projections match today's baseline. Use the price control to explore a hypothetical move.`;
  }

  const revWord = impact.revenueDeltaPct >= 0 ? "lifts" : "reduces";
  const revAbs  = Math.abs(impact.revenueDeltaPct).toFixed(1);
  const subWord = impact.subsDeltaPct >= 0 ? "gains" : "costs";
  const subAbs  = Math.abs(impact.projectedSubs - impact.baselineSubs);

  const verdict = (() => {
    if (impact.revenueDeltaPct > 0.5 && impact.subsDeltaPct > -2) return "Net positive at current LTV assumptions.";
    if (impact.revenueDeltaPct > 0 && impact.subsDeltaPct < -3)   return "Revenue gain trades off significant subscriber loss — pressure-test before committing.";
    if (impact.revenueDeltaPct < -0.5)                            return "Net negative — model suggests reconsidering or pairing with retention levers.";
    return "Impact is roughly neutral within the model's confidence band.";
  })();

  return `A $${absDelta.toFixed(2)} ${direction} on ${tier} in ${market} ${revWord} revenue ${revAbs}% but ${subWord} ~${fmtCompact(subAbs)} subscribers over ${scenario.horizonMonths} months. ${verdict}`;
}

export function ImpactHero({ scenario, impact }: ImpactHeroProps) {
  const tier = TIER_META.find((t) => t.id === scenario.tier);
  const marketLabel = getMarketLabel(scenario.market);
  const narrative = buildNarrative(scenario, impact);

  return (
    <div className="bg-gradient-to-br from-[#9B51E0]/10 to-[#7B68EE]/5 border border-[#E8E4F0] rounded-2xl p-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <p className="text-xs font-semibold text-[#9B51E0] uppercase tracking-wide mb-2">Projected impact</p>
          <h2 className="font-display text-2xl text-[#1E1B3A] tracking-tight">
            {tier?.label} · {marketLabel}
          </h2>
          <p className="text-sm font-mono text-[#7B7694] mt-1">
            ${impact.basePrice.toFixed(2)} → ${impact.newPrice.toFixed(2)} · {scenario.horizonMonths}-month horizon
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E8E4F0] rounded-full shrink-0 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-[#9B51E0]" />
          <span className="text-xs font-semibold text-[#1E1B3A]">{impact.confidence}% confidence</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <Metric
          label="Subscribers"
          before={fmtCompact(impact.baselineSubs)}
          after={fmtCompact(impact.projectedSubs)}
          deltaPct={impact.subsDeltaPct}
          deltaIsBad={false}
        />
        <Metric
          label="Revenue"
          before={fmtRevenue(impact.baselineRevenue)}
          after={fmtRevenue(impact.projectedRevenue)}
          deltaPct={impact.revenueDeltaPct}
          deltaIsBad={false}
        />
        <Metric
          label="Churn rate"
          before={`${impact.baselineChurnRate.toFixed(2)}%`}
          after={`${impact.projectedChurnRate.toFixed(2)}%`}
          deltaPct={impact.churnDeltaPct}
          deltaIsBad
        />
      </div>

      <div className="bg-white/60 border border-[#E8E4F0] rounded-xl px-5 py-3.5">
        <p className="text-sm text-[#1E1B3A] leading-relaxed">
          {narrative}
        </p>
      </div>
    </div>
  );
}
