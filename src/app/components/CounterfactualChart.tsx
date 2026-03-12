import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import * as Toggle from "@radix-ui/react-toggle";
import type { ChartDataPoint } from "@/data/types";

export type Metric = "price" | "volume" | "revenue" | "grossAdds";

interface CounterfactualChartProps {
  data: ChartDataPoint[];
  eventStartWeek: number;
  metric: Metric;
  onMetricChange: (metric: Metric) => void;
}

const METRIC_LABELS: Record<Metric, string> = {
  price: "Price",
  volume: "Volume",
  revenue: "Revenue",
  grossAdds: "Gross Adds",
};

const METRIC_FORMATTERS: Record<Metric, (v: number) => string> = {
  price: (value) => `$${value.toFixed(2)}`,
  volume: (value) => `${(value / 1000).toFixed(1)}K`,
  revenue: (value) => `$${(value / 1000).toFixed(1)}K`,
  grossAdds: (value) => `${(value / 1000).toFixed(1)}K`,
};

function CustomTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null;

  const actual = payload[0].value;
  const counterfactual = payload[1].value;
  const delta = actual - counterfactual;
  const deltaPercent = ((delta / counterfactual) * 100).toFixed(1);
  const format = METRIC_FORMATTERS[metric as Metric];

  return (
    <div className="bg-white border border-[#E0DED8] rounded-lg p-3 shadow-lg">
      <p className="text-xs text-[#6B6B6B] mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#6B6B6B]">Actual:</span>
          <span className="text-sm font-mono text-[#2D7D78]">{format(actual)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#6B6B6B]">Counterfactual:</span>
          <span className="text-sm font-mono text-[#6B6B6B]">{format(counterfactual)}</span>
        </div>
        <div className="pt-1 mt-1 border-t border-[#E0DED8]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-[#6B6B6B]">Delta:</span>
            <span
              className={`text-sm font-mono ${delta > 0 ? "text-[#2D7D78]" : "text-[#C95D63]"}`}
            >
              {delta > 0 ? "+" : ""}{deltaPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CounterfactualChart({ data, eventStartWeek, metric, onMetricChange }: CounterfactualChartProps) {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-[#1A1A1A]">Actual vs. Counterfactual</h3>
        <div className="flex gap-1 bg-[#F8F7F4] p-1 rounded-md">
          {(["price", "volume", "revenue", "grossAdds"] as const).map((m) => (
            <Toggle.Root
              key={m}
              pressed={metric === m}
              onPressedChange={() => onMetricChange(m)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                metric === m
                  ? "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              {METRIC_LABELS[m]}
            </Toggle.Root>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E0DED8] rounded-lg p-6">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D7D78" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2D7D78" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0DED8" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: "#6B6B6B", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              stroke="#E0DED8"
            />
            <YAxis
              tick={{ fill: "#6B6B6B", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              stroke="#E0DED8"
              tickFormatter={(value) => METRIC_FORMATTERS[metric](value)}
            />
            <RechartsTooltip content={<CustomTooltip metric={metric} />} />
            <ReferenceLine
              x={`Week ${eventStartWeek}`}
              stroke="#1A1A1A"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            >
              <Label
                value="Event Start"
                position="top"
                fill="#1A1A1A"
                fontSize={11}
                fontFamily="IBM Plex Mono"
                offset={10}
              />
            </ReferenceLine>

            <ReferenceLine x={`Week ${eventStartWeek - 1}`} stroke="transparent">
              <Label
                value="Pre-Period"
                position="bottom"
                fill="#6B6B6B"
                fontSize={10}
                fontFamily="IBM Plex Mono"
                offset={5}
              />
            </ReferenceLine>
            <ReferenceLine x={`Week ${eventStartWeek + 1}`} stroke="transparent">
              <Label
                value="Post-Period"
                position="bottom"
                fill="#6B6B6B"
                fontSize={10}
                fontFamily="IBM Plex Mono"
                offset={5}
              />
            </ReferenceLine>

            <Area
              type="monotone"
              dataKey="counterfactual"
              stroke="#6B6B6B"
              strokeWidth={2.5}
              strokeDasharray="8 4"
              fill="transparent"
              name="Counterfactual"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#2D7D78"
              strokeWidth={3}
              fill="url(#colorActual)"
              name="Actual"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#E0DED8]">
          <div className="flex items-center gap-2">
            <div className="w-8" style={{ height: "3px", backgroundColor: "#2D7D78" }} />
            <span className="text-xs text-[#6B6B6B]">Actual {METRIC_LABELS[metric]}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8"
              style={{
                height: "2.5px",
                backgroundImage:
                  "repeating-linear-gradient(to right, #6B6B6B 0, #6B6B6B 8px, transparent 8px, transparent 12px)",
              }}
            />
            <span className="text-xs text-[#6B6B6B]">Counterfactual Baseline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
