import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Label,
} from "recharts";
import type { ChartDataPoint } from "@/data/types";

interface CounterfactualChartProps {
  data: ChartDataPoint[];
  eventStartWeek: number;
}

function formatValue(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toFixed(0);
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const actual = payload[0].value;
  const counterfactual = payload[1].value;
  const delta = actual - counterfactual;
  const deltaPercent = ((delta / counterfactual) * 100).toFixed(1);

  return (
    <div className="bg-white border border-[#E8E4F0] rounded-xl p-3 shadow-lg">
      <p className="text-xs text-[#7B7694] mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#7B7694]">Actual:</span>
          <span className="text-sm font-mono text-[#9B51E0]">{formatValue(actual)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#7B7694]">Counterfactual:</span>
          <span className="text-sm font-mono text-[#7B7694]">{formatValue(counterfactual)}</span>
        </div>
        <div className="pt-1 mt-1 border-t border-[#E8E4F0]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-[#7B7694]">Delta:</span>
            <span className={`text-sm font-mono ${delta > 0 ? "text-[#10B981]" : "text-[#E94560]"}`}>
              {delta > 0 ? "+" : ""}{deltaPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CounterfactualChart({ data, eventStartWeek }: CounterfactualChartProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm text-[#1E1B3A] font-display">Actual vs. Counterfactual</h3>
      <div className="bg-white border border-[#E8E4F0] rounded-2xl p-6 shadow-sm">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9B51E0" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9B51E0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4F0" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#7B7694", fontSize: 11, fontFamily: "SF Mono, Monaco, monospace" }} stroke="#E8E4F0" />
            <YAxis tick={{ fill: "#7B7694", fontSize: 11, fontFamily: "SF Mono, Monaco, monospace" }} stroke="#E8E4F0" tickFormatter={formatValue} />
            <RechartsTooltip content={<CustomTooltip />} />
            <ReferenceLine x={`Week ${eventStartWeek}`} stroke="#1E1B3A" strokeDasharray="5 5" strokeWidth={1.5}>
              <Label value="Event Start" position="top" fill="#1E1B3A" fontSize={11} fontFamily="SF Mono, Monaco, monospace" offset={10} />
            </ReferenceLine>
            <ReferenceLine x={`Week ${eventStartWeek - 1}`} stroke="transparent">
              <Label value="Pre-Period" position="bottom" fill="#7B7694" fontSize={10} fontFamily="SF Mono, Monaco, monospace" offset={5} />
            </ReferenceLine>
            <ReferenceLine x={`Week ${eventStartWeek + 1}`} stroke="transparent">
              <Label value="Post-Period" position="bottom" fill="#7B7694" fontSize={10} fontFamily="SF Mono, Monaco, monospace" offset={5} />
            </ReferenceLine>
            <Area type="monotone" dataKey="counterfactual" stroke="#B5B0C8" strokeWidth={2.5} strokeDasharray="8 4" fill="transparent" name="Counterfactual" />
            <Area type="monotone" dataKey="actual" stroke="#9B51E0" strokeWidth={3} fill="url(#colorActual)" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#E8E4F0]">
          <div className="flex items-center gap-2">
            <div className="w-8" style={{ height: "3px", backgroundColor: "#9B51E0" }} />
            <span className="text-xs text-[#7B7694]">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8" style={{ height: "2.5px", backgroundImage: "repeating-linear-gradient(to right, #B5B0C8 0, #B5B0C8 8px, transparent 8px, transparent 12px)" }} />
            <span className="text-xs text-[#7B7694]">Counterfactual Baseline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
