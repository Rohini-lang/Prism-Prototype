import { Info, TrendingDown, TrendingUp, Minus, Check } from "lucide-react";
import type { SandboxKPI } from "@/data/sandbox";

interface StatCardProps {
  kpi: SandboxKPI;
}

function valueColor(value: string, trend: SandboxKPI["trend"]): string {
  if (trend === "neutral") return "text-[#F2EFFF]";
  // Down = red (decrease). Up = green.
  if (trend === "down") return "text-[#F87171]";
  return "text-[#34D399]";
}

export function StatCard({ kpi }: StatCardProps) {
  const TrendIcon =
    kpi.trend === "down" ? TrendingDown :
    kpi.trend === "up"   ? TrendingUp   :
    Minus;
  const trendColor =
    kpi.trend === "down" ? "text-[#F87171]" :
    kpi.trend === "up"   ? "text-[#34D399]" :
    "text-[#6F6A85]";

  return (
    <div className="flex-1 px-5 py-4 bg-[#141414] border border-[#262626] rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#A39DB8] font-medium">{kpi.label}</span>
          <Info className="w-3 h-3 text-[#6F6A85]" />
        </div>
        <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
      </div>

      <div className={`font-mono text-2xl font-semibold mb-1.5 ${valueColor(kpi.value, kpi.trend)}`}>
        {kpi.value}
      </div>

      {kpi.passes ? (
        <div className="flex items-center gap-1 text-[11px] text-[#34D399]">
          <Check className="w-3 h-3" />
          <span>{kpi.helper}</span>
        </div>
      ) : (
        <div className="text-[11px] text-[#6F6A85] leading-relaxed">{kpi.helper}</div>
      )}
    </div>
  );
}
