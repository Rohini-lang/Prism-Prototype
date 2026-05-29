import { useMemo, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  ReferenceLine, ReferenceDot, ReferenceArea, Label,
} from "recharts";
import type { ElasticityModel, ElasticityCurvePoint } from "@/data/types";
import { revenueMaxPrice, buildElasticityCurve } from "@/data/elasticity";
import { Tooltip } from "../Tooltip";

type Overlay = "demand" | "revenue";

interface ElasticityCurveInteractiveProps {
  model: ElasticityModel;
  proposedPrice: number;
  onProposedPriceChange: (p: number) => void;
}

function fmtSubs(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n.toFixed(0);
}

function fmtRevenue(n: number): string {
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(n) >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function CurveTooltip({ active, payload, label, overlay }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as ElasticityCurvePoint | undefined;
  if (!point) return null;
  return (
    <div className="bg-white border border-[#E8E4F0] rounded-xl p-3 shadow-lg">
      <p className="text-xs text-[#7B7694] mb-2">@ ${typeof label === "number" ? label.toFixed(2) : label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#7B7694]">Demand:</span>
          <span className="text-sm font-mono text-[#9B51E0]">{fmtSubs(point.demand)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#7B7694]">Revenue:</span>
          <span className="text-sm font-mono text-[#1E1B3A]">{fmtRevenue(point.revenue)}</span>
        </div>
        {overlay === "demand" && (
          <div className="pt-1 mt-1 border-t border-[#E8E4F0] flex items-center justify-between gap-4">
            <span className="text-xs text-[#7B7694]">95% band:</span>
            <span className="text-xs font-mono text-[#7B7694]">{fmtSubs(point.demandLow)} – {fmtSubs(point.demandHigh)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ElasticityCurveInteractive({
  model,
  proposedPrice,
  onProposedPriceChange,
}: ElasticityCurveInteractiveProps) {
  const [overlay, setOverlay] = useState<Overlay>("demand");
  const [showRevMax, setShowRevMax] = useState(false);

  const curve = useMemo(() => buildElasticityCurve(model), [model]);
  const sweetSpot = useMemo(() => revenueMaxPrice(model), [model]);

  const minPrice = curve[0].price;
  const maxPrice = curve[curve.length - 1].price;
  const sliderStep = 0.25;

  // Snap proposed to nearest curve sample for ReferenceDot accuracy.
  const nearest = useMemo(() => {
    let best = curve[0];
    let bestDist = Infinity;
    for (const p of curve) {
      const d = Math.abs(p.price - proposedPrice);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    return best;
  }, [curve, proposedPrice]);

  const baseline = useMemo(
    () => curve.find((p) => Math.abs(p.price - model.basePrice) < 0.01) ?? curve[0],
    [curve, model.basePrice],
  );

  const lowerPrice = Math.min(model.basePrice, proposedPrice);
  const upperPrice = Math.max(model.basePrice, proposedPrice);
  const isIncrease = proposedPrice > model.basePrice;
  const noChange = Math.abs(proposedPrice - model.basePrice) < 0.01;

  const yKey = overlay === "demand" ? "demand" : "revenue";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm text-[#1E1B3A] font-display">Elasticity Curve</h3>
          <Tooltip content="The demand curve for this tier × market. Drag the slider to set a proposed price — the page recomputes downstream impact in real time." />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-[#7B7694] cursor-pointer">
            <input
              type="checkbox"
              checked={showRevMax}
              onChange={(e) => setShowRevMax(e.target.checked)}
              className="accent-[#9B51E0]"
            />
            Show revenue-max
          </label>
          <div className="flex items-center gap-1 bg-[#F0EDF8] p-1 rounded-lg border border-[#E8E4F0]">
            {(["demand", "revenue"] as Overlay[]).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOverlay(o)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                  overlay === o
                    ? "bg-white text-[#1E1B3A] shadow-sm border border-[#E8E4F0]"
                    : "text-[#7B7694] hover:text-[#1E1B3A]"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E4F0] rounded-2xl p-6 shadow-sm">
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={curve} margin={{ top: 28, right: 24, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="elasticityBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#9B51E0" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#9B51E0" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4F0" vertical={false} />
            <XAxis
              dataKey="price"
              type="number"
              domain={[minPrice, maxPrice]}
              tick={{ fill: "#7B7694", fontSize: 11, fontFamily: "SF Mono, Monaco, monospace" }}
              stroke="#E8E4F0"
              tickFormatter={(v) => `$${v.toFixed(0)}`}
              label={{ value: "Price ($)", position: "insideBottom", offset: -5, style: { fill: "#7B7694", fontSize: 10 } }}
            />
            <YAxis
              tick={{ fill: "#7B7694", fontSize: 11, fontFamily: "SF Mono, Monaco, monospace" }}
              stroke="#E8E4F0"
              tickFormatter={(v) => overlay === "revenue" ? fmtRevenue(v) : fmtSubs(v)}
              label={{
                value: overlay === "revenue" ? "Revenue" : "Demand (subs)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#7B7694", fontSize: 10 },
              }}
            />
            <RechartsTooltip content={<CurveTooltip overlay={overlay} />} />

            {/* Confidence band — only on demand view */}
            {overlay === "demand" && (
              <Area
                type="monotone"
                dataKey="demandHigh"
                stroke="none"
                fill="url(#elasticityBand)"
                isAnimationActive={false}
              />
            )}
            {overlay === "demand" && (
              <Area
                type="monotone"
                dataKey="demandLow"
                stroke="none"
                fill="#FFFFFF"
                isAnimationActive={false}
              />
            )}

            {/* Delta region between current and proposed price */}
            {!noChange && (
              <ReferenceArea
                x1={lowerPrice}
                x2={upperPrice}
                fill={isIncrease ? "#10B981" : "#9B51E0"}
                fillOpacity={0.08}
              />
            )}

            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#9B51E0"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
              name={overlay === "revenue" ? "Revenue" : "Demand"}
            />

            {/* Anchored current price */}
            <ReferenceLine
              x={model.basePrice}
              stroke="#7B7694"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            >
              <Label
                value={`Current $${model.basePrice.toFixed(2)}`}
                position="top"
                fill="#7B7694"
                fontSize={10}
                fontFamily="SF Mono, Monaco, monospace"
                offset={8}
              />
            </ReferenceLine>
            <ReferenceDot
              x={baseline.price}
              y={(baseline as any)[yKey]}
              r={5}
              fill="#FFFFFF"
              stroke="#7B7694"
              strokeWidth={2}
              isFront
            />

            {/* Proposed price */}
            {!noChange && (
              <ReferenceLine
                x={proposedPrice}
                stroke="#9B51E0"
                strokeWidth={2}
              >
                <Label
                  value={`Proposed $${proposedPrice.toFixed(2)}`}
                  position="top"
                  fill="#9B51E0"
                  fontSize={11}
                  fontFamily="SF Mono, Monaco, monospace"
                  fontWeight={600}
                  offset={8}
                />
              </ReferenceLine>
            )}
            <ReferenceDot
              x={nearest.price}
              y={(nearest as any)[yKey]}
              r={6}
              fill="#9B51E0"
              stroke="#FFFFFF"
              strokeWidth={2}
              isFront
            />

            {/* Revenue-max marker */}
            {showRevMax && sweetSpot >= minPrice && sweetSpot <= maxPrice && (
              <ReferenceLine
                x={sweetSpot}
                stroke="#10B981"
                strokeDasharray="2 4"
                strokeWidth={1.5}
              >
                <Label
                  value={`Rev-max $${sweetSpot.toFixed(2)}`}
                  position="insideTopRight"
                  fill="#10B981"
                  fontSize={10}
                  fontFamily="SF Mono, Monaco, monospace"
                  offset={6}
                />
              </ReferenceLine>
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Drag slider */}
        <div className="mt-2 px-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-[#B5B0C8] shrink-0 w-12">${minPrice.toFixed(2)}</span>
            <Slider.Root
              value={[proposedPrice]}
              min={minPrice}
              max={maxPrice}
              step={sliderStep}
              onValueChange={(v) => onProposedPriceChange(+v[0].toFixed(2))}
              className="relative flex items-center select-none touch-none w-full h-5"
            >
              <Slider.Track className="bg-[#F0EDF8] relative grow rounded-full h-1.5">
                <Slider.Range className="absolute bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-[#9B51E0] rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-[#9B51E0]/30" />
            </Slider.Root>
            <span className="text-[10px] font-mono text-[#B5B0C8] shrink-0 w-12 text-right">${maxPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#E8E4F0] flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[3px] bg-[#9B51E0]" />
            <span className="text-xs text-[#7B7694]">{overlay === "revenue" ? "Revenue curve" : "Demand curve"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8" style={{ height: "2.5px", backgroundImage: "repeating-linear-gradient(to right, #7B7694 0, #7B7694 4px, transparent 4px, transparent 8px)" }} />
            <span className="text-xs text-[#7B7694]">Current price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#9B51E0] border-2 border-white shadow" />
            <span className="text-xs text-[#7B7694]">Proposed price</span>
          </div>
          {overlay === "demand" && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 rounded-sm" style={{ background: "linear-gradient(to bottom, rgba(155,81,224,0.2), rgba(155,81,224,0.02))" }} />
              <span className="text-xs text-[#7B7694]">95% confidence band</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
