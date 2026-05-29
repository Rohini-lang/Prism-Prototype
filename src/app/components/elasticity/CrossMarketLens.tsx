import { TrendingUp, TrendingDown } from "lucide-react";
import type { MarketScenarioResult } from "@/data/types";
import { Tooltip } from "../Tooltip";
import { MARKET_CODE } from "@/app/hooks/useWatchlist";

interface CrossMarketLensProps {
  results: MarketScenarioResult[];
  onSelectMarket: (market: string) => void;
}

function fmt(v: number): string {
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}%`;
}

export function CrossMarketLens({ results, onSelectMarket }: CrossMarketLensProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-sm text-[#1E1B3A] font-display">Cross-market lens</h3>
        <Tooltip content="The same scenario applied to comparable markets. A useful pressure test — does the model behave reasonably elsewhere?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((r) => {
          const revUp = r.revenueDeltaPct >= 0;
          const subUp = r.subsDeltaPct >= 0;
          return (
            <button
              key={r.market}
              type="button"
              onClick={() => onSelectMarket(r.market)}
              className="bg-white border border-[#E8E4F0] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#C4BAF5] transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F0EDF8] text-[#6B5CE7] border border-[#C4BAF5]">
                    {MARKET_CODE[r.market] ?? r.market.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-[#1E1B3A] group-hover:text-[#9B51E0] transition-colors">
                    {r.marketLabel}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#7B7694]">{r.similarity}% similar</span>
              </div>

              <p className="text-xs text-[#7B7694] mb-3 font-mono">
                ${r.basePrice.toFixed(2)} → ${r.newPrice.toFixed(2)}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7B7694]">Revenue</span>
                  <div className={`flex items-center gap-1 font-mono text-sm font-semibold ${revUp ? "text-[#10B981]" : "text-[#E94560]"}`}>
                    {revUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {fmt(r.revenueDeltaPct)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7B7694]">Subscribers</span>
                  <div className={`flex items-center gap-1 font-mono text-sm font-semibold ${subUp ? "text-[#10B981]" : "text-[#E94560]"}`}>
                    {subUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {fmt(r.subsDeltaPct)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
