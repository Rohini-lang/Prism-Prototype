import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tooltip } from "./Tooltip";
import type { ElasticityDataPoint } from "@/data/types";

interface ElasticityChartProps {
  data: ElasticityDataPoint[];
}

export function ElasticityChart({ data }: ElasticityChartProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-sm text-[#1A1A1A]">Elasticity Curve Overlay</h3>
        <Tooltip content="This chart shows how sensitive demand is to price changes. The treatment market's curve is compared against similar markets to isolate the event's true effect." />
      </div>
      <div className="bg-white border border-[#E0DED8] rounded-lg p-6">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0DED8" vertical={false} />
            <XAxis
              dataKey="price"
              tick={{ fill: "#6B6B6B", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              stroke="#E0DED8"
              label={{
                value: "Price ($)",
                position: "insideBottom",
                offset: -5,
                style: { fill: "#6B6B6B", fontSize: 10 },
              }}
            />
            <YAxis
              tick={{ fill: "#6B6B6B", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              stroke="#E0DED8"
              label={{
                value: "Demand",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#6B6B6B", fontSize: 10 },
              }}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E0DED8",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              itemStyle={{ fontFamily: "IBM Plex Mono", fontSize: "11px" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="control1"
              stroke="#E0DED8"
              strokeWidth={1.5}
              dot={false}
              name="Control Market 1"
              opacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="control2"
              stroke="#C4C2BA"
              strokeWidth={1.5}
              dot={false}
              name="Control Market 2"
              opacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="control3"
              stroke="#C4C2BA"
              strokeWidth={1.5}
              dot={false}
              name="Control Market 3"
              opacity={0.4}
            />
            <Line
              type="monotone"
              dataKey="treatment"
              stroke="#2D7D78"
              strokeWidth={3}
              dot={false}
              name="Treatment Market"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
