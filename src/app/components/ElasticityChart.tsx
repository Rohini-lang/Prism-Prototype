import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Tooltip } from "./Tooltip";
import type { ElasticityDataPoint } from "@/data/types";

interface ElasticityChartProps { data: ElasticityDataPoint[]; }

export function ElasticityChart({ data }: ElasticityChartProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-sm text-[#1E1B3A] font-display">Elasticity Curve Overlay</h3>
        <Tooltip content="This chart shows how sensitive demand is to price changes. The treatment market's curve is compared against similar markets to isolate the event's true effect." />
      </div>
      <div className="bg-white border border-[#E8E4F0] rounded-2xl p-6 shadow-sm">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4F0" vertical={false} />
            <XAxis dataKey="price" tick={{ fill: "#7B7694", fontSize: 11, fontFamily: "SF Mono, Monaco, monospace" }} stroke="#E8E4F0"
              label={{ value: "Price ($)", position: "insideBottom", offset: -5, style: { fill: "#7B7694", fontSize: 10 } }} />
            <YAxis tick={{ fill: "#7B7694", fontSize: 11, fontFamily: "SF Mono, Monaco, monospace" }} stroke="#E8E4F0"
              label={{ value: "Demand", angle: -90, position: "insideLeft", style: { fill: "#7B7694", fontSize: 10 } }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: "12px", fontSize: "12px", color: "#1E1B3A" }}
              itemStyle={{ fontFamily: "SF Mono, Monaco, monospace", fontSize: "11px" }} />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px", color: "#7B7694" }} iconType="line" />
            <Line type="monotone" dataKey="control1" stroke="#DDD8ED" strokeWidth={1.5} dot={false} name="Control Market 1" opacity={0.7} />
            <Line type="monotone" dataKey="control2" stroke="#DDD8ED" strokeWidth={1.5} dot={false} name="Control Market 2" opacity={0.7} />
            <Line type="monotone" dataKey="control3" stroke="#DDD8ED" strokeWidth={1.5} dot={false} name="Control Market 3" opacity={0.6} />
            <Line type="monotone" dataKey="treatment" stroke="#9B51E0" strokeWidth={3} dot={false} name="Treatment Market" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
