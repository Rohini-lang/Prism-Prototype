import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPIData } from "@/data/types";

export function KPIChip({ label, value, trend, sublabel }: KPIData) {
  const trendColor =
    trend === "up" ? "text-[#10B981]" : trend === "down" ? "text-[#E94560]" : "text-[#7B7694]";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className="flex-1 px-5 py-4 bg-white border border-[#E8E4F0] rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#7B7694] font-medium">{label}</span>
        <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
      </div>
      <div className="font-mono text-xl text-[#1E1B3A] mb-1">{value}</div>
      {sublabel && <div className="text-xs text-[#7B7694] leading-relaxed">{sublabel}</div>}
    </div>
  );
}
