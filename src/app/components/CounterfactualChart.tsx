import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Label,
} from "recharts";
import type { ChartDataPoint } from "@/data/types";

type ChartView = "subscribers" | "revenue" | "arpu";

const VIEW_OPTIONS: { id: ChartView; label: string }[] = [
  { id: "subscribers", label: "Subscribers" },
  { id: "revenue",     label: "Revenue"      },
  { id: "arpu",        label: "ARPU"         },
];

// Promotional ARPU ramps up toward full price over 16 weeks as cohorts hit renewal
const FULL_ARPU  = 12.99;
const PROMO_ARPU =  7.99;

function actualArpu(weekNum: number) {
  return PROMO_ARPU + (FULL_ARPU - PROMO_ARPU) * Math.min(weekNum / 16, 1);
}

function transformData(data: ChartDataPoint[], view: ChartView) {
  return data.map((d) => {
    if (view === "revenue") {
      return {
        ...d,
        actual:         parseFloat(((d.actual        * actualArpu(d.weekNum)) / 1000).toFixed(2)),
        counterfactual: parseFloat(((d.counterfactual * FULL_ARPU)            / 1000).toFixed(2)),
      };
    }
    if (view === "arpu") {
      return {
        ...d,
        actual:         parseFloat(actualArpu(d.weekNum).toFixed(2)),
        counterfactual: FULL_ARPU,
      };
    }
    return d;
  });
}

function fmtValue(value: number, view: ChartView) {
  if (view === "arpu")    return `$${value.toFixed(2)}`;
  if (view === "revenue") return `$${value.toFixed(1)}K`;
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toFixed(0);
}

function CustomTooltip({ active, payload, label, view }: any) {
  if (!active || !payload?.length) return null;
  const actual = payload.find((p: any) => p.dataKey === "actual")?.value;
  const cf     = payload.find((p: any) => p.dataKey === "counterfactual")?.value;
  if (actual == null || cf == null) return null;
  const delta        = actual - cf;
  const deltaPercent = ((delta / cf) * 100).toFixed(1);
  const fmt          = (v: number) => fmtValue(v, view);

  return (
    <div className="bg-white border border-[#E8E4F0] rounded-xl p-3 shadow-lg">
      <p className="text-xs text-[#7B7694] mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#7B7694]">Actual:</span>
          <span className="text-sm font-mono text-[#9B51E0]">{fmt(actual)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#7B7694]">Counterfactual:</span>
          <span className="text-sm font-mono text-[#7B7694]">{fmt(cf)}</span>
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

interface CounterfactualChartProps {
  data: ChartDataPoint[];
  eventStartWeek: number;
}

export function CounterfactualChart({ data, eventStartWeek }: CounterfactualChartProps) {
  const [view, setView] = useState<ChartView>("subscribers");

  const chartData = transformData(data, view);
  const lastWeek  = data[data.length - 1]?.week ?? `Week ${data.length}`;
  const preEnd    = `Week ${eventStartWeek - 1}`;
  const postStart = `Week ${eventStartWeek}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-[#1E1B3A] font-display">Actual vs. Counterfactual</h3>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-[#F0EDF8] p-1 rounded-lg border border-[#E8E4F0]">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setView(opt.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                view === opt.id
                  ? "bg-white text-[#1E1B3A] shadow-sm border border-[#E8E4F0]"
                  : "text-[#7B7694] hover:text-[#1E1B3A]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E8E4F0] rounded-2xl p-6 shadow-sm">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 24, right: 10, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#9B51E0" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9B51E0" stopOpacity={0}   />
              </linearGradient>
            </defs>

            {/* Pre-period shading */}
            <ReferenceArea x1="Week 1" x2={preEnd} fill="#F5F3FA" fillOpacity={0.7}>
              <Label
                value="Pre-Period"
                position="insideTopLeft"
                fill="#7B7694"
                fontSize={10}
                fontFamily="SF Mono, Monaco, monospace"
                dy={-18}
                dx={4}
              />
            </ReferenceArea>

            {/* Post-period shading */}
            <ReferenceArea x1={postStart} x2={lastWeek} fill="#F0EDF8" fillOpacity={0.5}>
              <Label
                value="Post-Period"
                position="insideTopRight"
                fill="#9B51E0"
                fontSize={10}
                fontFamily="SF Mono, Monaco, monospace"
                dy={-18}
                dx={-4}
              />
            </ReferenceArea>

            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4F0" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: "#7B7694", fontSize: 11, fontFamily: "SF Mono, Monaco, monospace" }}
              stroke="#E8E4F0"
            />
            <YAxis
              tick={{ fill: "#7B7694", fontSize: 11, fontFamily: "SF Mono, Monaco, monospace" }}
              stroke="#E8E4F0"
              tickFormatter={(v) => fmtValue(v, view)}
            />
            <RechartsTooltip content={<CustomTooltip view={view} />} />

            {/* Event start marker */}
            <ReferenceLine x={postStart} stroke="#1E1B3A" strokeDasharray="5 5" strokeWidth={1.5}>
              <Label
                value="Event Start"
                position="top"
                fill="#1E1B3A"
                fontSize={11}
                fontFamily="SF Mono, Monaco, monospace"
                offset={8}
              />
            </ReferenceLine>

            <Area
              type="monotone"
              dataKey="counterfactual"
              stroke="#B5B0C8"
              strokeWidth={2.5}
              strokeDasharray="8 4"
              fill="transparent"
              name="Counterfactual"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#9B51E0"
              strokeWidth={3}
              fill="url(#colorActual)"
              name="Actual"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#E8E4F0]">
          <div className="flex items-center gap-2">
            <div className="w-8" style={{ height: "3px", backgroundColor: "#9B51E0" }} />
            <span className="text-xs text-[#7B7694]">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8"
              style={{
                height: "2.5px",
                backgroundImage:
                  "repeating-linear-gradient(to right, #B5B0C8 0, #B5B0C8 8px, transparent 8px, transparent 12px)",
              }}
            />
            <span className="text-xs text-[#7B7694]">Counterfactual Baseline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
