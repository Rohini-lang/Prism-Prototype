import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPIData } from "@/data/types";

export function KPIChip({ label, value, trend, sublabel }: KPIData) {
  const trendColor =
    trend === "up"
      ? "text-[#2D7D78]"
      : trend === "down"
      ? "text-[#C95D63]"
      : "text-[#6B6B6B]";

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className="flex-1 px-4 py-3 bg-white border border-[#E0DED8] rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#6B6B6B]">{label}</span>
        <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
      </div>
      <div className="font-mono text-xl text-[#1A1A1A] mb-0.5">{value}</div>
      {sublabel && <div className="text-xs text-[#6B6B6B]">{sublabel}</div>}
    </div>
  );
}
