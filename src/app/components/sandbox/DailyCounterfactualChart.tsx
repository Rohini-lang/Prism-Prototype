import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  ReferenceLine, Label,
} from "recharts";
import type { SandboxChartPoint } from "@/data/sandbox";

interface DailyCounterfactualChartProps {
  data: SandboxChartPoint[];
  eventStartDate: string;
}

function fmtAxisValue(v: number): string {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toFixed(0);
}

function fmtTooltipValue(v: number): string {
  return v.toLocaleString("en-US");
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const actual = payload.find((p: any) => p.dataKey === "actual")?.value as number | undefined;
  const cf     = payload.find((p: any) => p.dataKey === "counterfactual")?.value as number | undefined;
  if (actual == null || cf == null) return null;
  const delta = actual - cf;
  const deltaPct = ((delta / cf) * 100).toFixed(1);
  const isUp = delta >= 0;

  return (
    <div className="bg-[#141414] border border-[#333333] rounded-lg p-3 shadow-xl">
      <p className="text-[11px] text-[#A39DB8] mb-2">{label} 2025</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-[#A39DB8]">Actual:</span>
          <span className="text-xs font-mono text-[#B57AFF]">{fmtTooltipValue(actual)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-[#A39DB8]">Counterfactual:</span>
          <span className="text-xs font-mono text-[#A39DB8]">{fmtTooltipValue(cf)}</span>
        </div>
        <div className="pt-1.5 mt-1.5 border-t border-[#262626] flex items-center justify-between gap-4">
          <span className="text-[11px] text-[#A39DB8]">Delta:</span>
          <span className={`text-xs font-mono font-semibold ${isUp ? "text-[#34D399]" : "text-[#F87171]"}`}>
            {isUp ? "+" : ""}{deltaPct}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function DailyCounterfactualChart({ data, eventStartDate }: DailyCounterfactualChartProps) {
  // Sparsify x-axis ticks so they don't crowd at daily granularity.
  const tickInterval = Math.floor(data.length / 18);
  const xTicks = data
    .filter((_, i) => i % tickInterval === 0)
    .map((d) => d.date);

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#F2EFFF]">Actual vs. Counterfactual</h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis
            dataKey="date"
            ticks={xTicks}
            tick={{ fill: "#6F6A85", fontSize: 10, fontFamily: "SF Mono, Monaco, monospace" }}
            stroke="#262626"
            interval={0}
          />
          <YAxis
            tick={{ fill: "#6F6A85", fontSize: 10, fontFamily: "SF Mono, Monaco, monospace" }}
            stroke="#262626"
            tickFormatter={fmtAxisValue}
            domain={["auto", "auto"]}
          />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: "#333333", strokeWidth: 1 }} />

          <ReferenceLine
            x={eventStartDate}
            stroke="#B57AFF"
            strokeWidth={1.5}
          >
            <Label
              value="Event Start"
              position="top"
              fill="#F2EFFF"
              fontSize={10}
              fontWeight={600}
              fontFamily="SF Mono, Monaco, monospace"
              offset={8}
              style={{
                background: "#B57AFF",
              }}
            />
          </ReferenceLine>

          <Line
            type="monotone"
            dataKey="counterfactual"
            stroke="#6F6A85"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            isAnimationActive={false}
            name="Counterfactual"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#B57AFF"
            strokeWidth={2.2}
            dot={false}
            isAnimationActive={false}
            name="Actual"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#262626] flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-[2.2px] bg-[#B57AFF]" />
          <span className="text-[11px] text-[#A39DB8]">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-8"
            style={{
              height: "2px",
              backgroundImage: "repeating-linear-gradient(to right, #6F6A85 0, #6F6A85 5px, transparent 5px, transparent 9px)",
            }}
          />
          <span className="text-[11px] text-[#A39DB8]">Counterfactual Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-px h-3 bg-[#B57AFF]" />
          <span className="text-[11px] text-[#A39DB8]">Event Start</span>
        </div>
      </div>
    </div>
  );
}
