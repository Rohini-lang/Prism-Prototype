import { Bookmark, X, TrendingUp, TrendingDown, Zap, ArrowUpRight, LineChart as LineChartIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MOCK_MODEL_DATA } from "@/data/mock";
import { TIER_META } from "@/data/elasticity";
import type { PinnedItem, PinnedTakeaway, PinnedScenario } from "@/app/hooks/useWatchlist";
import { MARKET_CODE } from "@/app/hooks/useWatchlist";
import { TYPE_CONFIG, MODEL_LABELS } from "./KeyTakeaways";

// ── Mini SVG sparkline ────────────────────────────────────────────────────────

interface SparklineProps {
  actual: number[];
  counterfactual: number[];
  w?: number;
  h?: number;
}

function Sparkline({ actual, counterfactual, w = 140, h = 44 }: SparklineProps) {
  const all  = [...actual, ...counterfactual];
  const min  = Math.min(...all);
  const max  = Math.max(...all);
  const rng  = max - min || 1;
  const n    = actual.length;

  const toX = (i: number) => (i / (n - 1)) * w;
  const toY = (v: number) => h - ((v - min) / rng) * (h - 6) - 3;

  const path = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(" ");

  // last-point delta
  const lastActual = actual[actual.length - 1];
  const lastCF     = counterfactual[counterfactual.length - 1];
  const delta      = ((lastActual - lastCF) / lastCF) * 100;
  const positive   = delta >= 0;

  return (
    <div className="relative">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        {/* CF dashed baseline */}
        <path d={path(counterfactual)} fill="none" stroke="#D1C9E8" strokeWidth={1.5} strokeDasharray="4 2" />
        {/* Actual line */}
        <path d={path(actual)} fill="none" stroke="#9B51E0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* End dot */}
        <circle
          cx={toX(n - 1)}
          cy={toY(lastActual)}
          r={3}
          fill="#9B51E0"
        />
      </svg>
      {/* Delta badge */}
      <span
        className={`absolute right-0 bottom-0 text-[10px] font-bold font-mono ${
          positive ? "text-[#10B981]" : "text-[#E94560]"
        }`}
      >
        {positive ? "+" : ""}{delta.toFixed(1)}%
      </span>
    </div>
  );
}

// ── Takeaway card ─────────────────────────────────────────────────────────────

function TakeawayCard({ item, onUnpin, onNavigate }: { item: PinnedTakeaway; onUnpin: () => void; onNavigate: () => void }) {
  const cfg       = TYPE_CONFIG[item.type];
  const chartData = MOCK_MODEL_DATA[item.modelType].chartData;
  const actual    = chartData.map((d) => d.actual);
  const cf        = chartData.map((d) => d.counterfactual);

  const dirIcon =
    item.direction === "positive" ? (
      <TrendingUp className="w-3 h-3 text-[#10B981]" />
    ) : item.direction === "negative" ? (
      <TrendingDown className="w-3 h-3 text-[#E94560]" />
    ) : (
      <Zap className="w-3 h-3 text-[#D97706]" />
    );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 w-[220px] bg-white border border-[#E8E4F0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#C4BAF5] transition-all group/card cursor-pointer overflow-hidden"
      onClick={onNavigate}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border"
              style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
            >
              {cfg.label}
            </span>
            <span className="text-[10px] text-[#B5B0C8] font-medium">{MODEL_LABELS[item.modelType]}</span>
            {item.market && (
              <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F0EDF8] text-[#6B5CE7] border border-[#C4BAF5]">
                {MARKET_CODE[item.market] ?? item.market.toUpperCase()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onUnpin(); }}
            className="shrink-0 p-1 rounded-md text-[#C4BAF5] hover:text-[#E94560] hover:bg-[#FEE2E2] transition-all"
            title="Remove from watchlist"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-start gap-1.5 mb-3">
          <span className="mt-0.5 shrink-0">{dirIcon}</span>
          <p className="text-xs font-semibold text-[#1E1B3A] leading-snug line-clamp-2">{item.headline}</p>
        </div>

        <Sparkline actual={actual} counterfactual={cf} />
      </div>

      <div className="flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] translate-y-full group-hover/card:translate-y-0 transition-transform duration-200">
        <span className="text-[10px] font-semibold text-white">View full trendline</span>
        <ArrowUpRight className="w-3 h-3 text-white" />
      </div>
    </motion.div>
  );
}

// ── Scenario card ─────────────────────────────────────────────────────────────

function fmtSigned(v: number, suffix = "%"): string {
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}${suffix}`;
}

function ScenarioCard({ item, onUnpin, onNavigate }: { item: PinnedScenario; onUnpin: () => void; onNavigate: () => void }) {
  const tier = TIER_META.find((t) => t.id === item.tier);
  const priceSign = item.priceDelta >= 0 ? "+" : "−";
  const priceLabel = `${priceSign}$${Math.abs(item.priceDelta).toFixed(2)}`;
  const revUp = item.revenueDeltaPct >= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 w-[220px] bg-white border border-[#E8E4F0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#C4BAF5] transition-all group/card cursor-pointer overflow-hidden"
      onClick={onNavigate}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border bg-[#EDE9FC] text-[#6B5CE7] border-[#C4BAF5] flex items-center gap-1">
              <LineChartIcon className="w-2.5 h-2.5" />
              Scenario
            </span>
            <span className="text-[10px] text-[#B5B0C8] font-medium">{tier?.shortLabel}</span>
            <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F0EDF8] text-[#6B5CE7] border border-[#C4BAF5]">
              {MARKET_CODE[item.market] ?? item.market.toUpperCase()}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onUnpin(); }}
            className="shrink-0 p-1 rounded-md text-[#C4BAF5] hover:text-[#E94560] hover:bg-[#FEE2E2] transition-all"
            title="Remove from watchlist"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <p className="text-xs font-semibold text-[#1E1B3A] leading-snug mb-3">
          {priceLabel} on {tier?.shortLabel} over {item.horizonMonths}mo
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#FAFAFF] border border-[#E8E4F0] px-2 py-1.5">
            <div className="text-[9px] text-[#7B7694] uppercase tracking-wide font-semibold mb-0.5">Revenue</div>
            <div className={`text-sm font-mono font-semibold ${revUp ? "text-[#10B981]" : "text-[#E94560]"}`}>
              {fmtSigned(item.revenueDeltaPct)}
            </div>
          </div>
          <div className="rounded-lg bg-[#FAFAFF] border border-[#E8E4F0] px-2 py-1.5">
            <div className="text-[9px] text-[#7B7694] uppercase tracking-wide font-semibold mb-0.5">Subs</div>
            <div className={`text-sm font-mono font-semibold ${item.subsDeltaPct >= 0 ? "text-[#10B981]" : "text-[#E94560]"}`}>
              {fmtSigned(item.subsDeltaPct)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[9px] text-[#B5B0C8] uppercase tracking-wide">Confidence</span>
          <span className="text-[10px] font-mono text-[#1E1B3A] font-semibold">{item.confidence}%</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] translate-y-full group-hover/card:translate-y-0 transition-transform duration-200">
        <span className="text-[10px] font-semibold text-white">Open scenario</span>
        <ArrowUpRight className="w-3 h-3 text-white" />
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface WatchlistSectionProps {
  pinned: PinnedItem[];
  onUnpin: (key: string) => void;
  onNavigate: (item: PinnedItem) => void;
}

export function WatchlistSection({ pinned, onUnpin, onNavigate }: WatchlistSectionProps) {
  return (
    <AnimatePresence>
      {pinned.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <div className="flex items-center gap-2 mb-3">
            <Bookmark className="w-3.5 h-3.5 text-[#6B5CE7] fill-[#6B5CE7]" />
            <span className="text-xs font-semibold text-[#6B5CE7] uppercase tracking-wide">
              Watchlist
            </span>
            <span className="text-xs text-[#B5B0C8]">· {pinned.length} tracked</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            <AnimatePresence mode="popLayout">
              {pinned.map((item) =>
                item.kind === "scenario" ? (
                  <ScenarioCard
                    key={item.key}
                    item={item}
                    onUnpin={() => onUnpin(item.key)}
                    onNavigate={() => onNavigate(item)}
                  />
                ) : (
                  <TakeawayCard
                    key={item.key}
                    item={item}
                    onUnpin={() => onUnpin(item.key)}
                    onNavigate={() => onNavigate(item)}
                  />
                )
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
