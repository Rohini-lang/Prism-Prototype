import { Bookmark, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { PinnedScenario } from "@/app/hooks/useWatchlist";
import { MARKET_CODE } from "@/app/hooks/useWatchlist";
import { TIER_META } from "@/data/elasticity";

interface ScenarioTrayProps {
  scenarios: PinnedScenario[];
  onUnpin: (key: string) => void;
  onLoad: (s: PinnedScenario) => void;
  activeKey?: string;
}

function fmtSigned(v: number): string {
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

export function ScenarioTray({ scenarios, onUnpin, onLoad, activeKey }: ScenarioTrayProps) {
  if (scenarios.length === 0) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Bookmark className="w-3.5 h-3.5 text-[#6B5CE7] fill-[#6B5CE7]" />
        <span className="text-xs font-semibold text-[#6B5CE7] uppercase tracking-wide">
          Saved scenarios
        </span>
        <span className="text-xs text-[#B5B0C8]">· {scenarios.length} pinned · click to compare</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        <AnimatePresence mode="popLayout">
          {scenarios.map((s) => {
            const tier = TIER_META.find((t) => t.id === s.tier);
            const isActive = activeKey === s.key;
            const priceSign = s.priceDelta >= 0 ? "+" : "−";
            const revUp = s.revenueDeltaPct >= 0;

            return (
              <motion.div
                key={s.key}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`flex-shrink-0 w-[260px] bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all group/card cursor-pointer overflow-hidden ${
                  isActive ? "border-[#9B51E0] ring-2 ring-[#9B51E0]/20" : "border-[#E8E4F0] hover:border-[#C4BAF5]"
                }`}
                onClick={() => onLoad(s)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-[#7B7694] font-semibold">{tier?.shortLabel}</span>
                      <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F0EDF8] text-[#6B5CE7] border border-[#C4BAF5]">
                        {MARKET_CODE[s.market] ?? s.market.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#B5B0C8] font-mono">{s.horizonMonths}mo</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onUnpin(s.key); }}
                      className="shrink-0 p-1 rounded-md text-[#C4BAF5] hover:text-[#E94560] hover:bg-[#FEE2E2] transition-all"
                      title="Remove from watchlist"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="font-mono text-sm font-semibold text-[#1E1B3A] mb-3">
                    ${s.basePrice.toFixed(2)} <span className="text-[#B5B0C8]">→</span> ${s.newPrice.toFixed(2)}
                    <span className="text-xs font-medium text-[#7B7694] ml-2">({priceSign}${Math.abs(s.priceDelta).toFixed(2)})</span>
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[9px] text-[#B5B0C8] uppercase tracking-wide font-semibold mb-0.5">Rev</div>
                      <div className={`text-xs font-mono font-semibold ${revUp ? "text-[#10B981]" : "text-[#E94560]"}`}>
                        {fmtSigned(s.revenueDeltaPct)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#B5B0C8] uppercase tracking-wide font-semibold mb-0.5">Subs</div>
                      <div className={`text-xs font-mono font-semibold ${s.subsDeltaPct >= 0 ? "text-[#10B981]" : "text-[#E94560]"}`}>
                        {fmtSigned(s.subsDeltaPct)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#B5B0C8] uppercase tracking-wide font-semibold mb-0.5">Conf</div>
                      <div className="text-xs font-mono font-semibold text-[#1E1B3A]">{s.confidence}%</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 py-1.5 bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] translate-y-full group-hover/card:translate-y-0 transition-transform duration-200">
                  <span className="text-[10px] font-semibold text-white">Load scenario</span>
                  <ArrowUpRight className="w-3 h-3 text-white" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
