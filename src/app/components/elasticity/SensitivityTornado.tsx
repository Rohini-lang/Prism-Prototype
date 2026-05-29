import type { SensitivityFactor } from "@/data/types";
import { Tooltip } from "../Tooltip";

interface SensitivityTornadoProps {
  factors: SensitivityFactor[];
}

function fmt(v: number): string {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}${Math.abs(v).toFixed(2)}%`;
}

export function SensitivityTornado({ factors }: SensitivityTornadoProps) {
  // Symmetric scale around 0 — find the largest magnitude across all factors.
  const maxMag = Math.max(
    0.5,
    ...factors.flatMap((f) => [Math.abs(f.lowImpactPct), Math.abs(f.highImpactPct)]),
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-sm text-[#1E1B3A] font-display">Sensitivity</h3>
        <Tooltip content="How much the projected revenue change shifts when each model assumption is flexed up or down. Long bars = the answer is fragile to that assumption." />
      </div>

      <div className="bg-white border border-[#E8E4F0] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-4">
          <span>Lower impact</span>
          <span>Revenue Δ% sensitivity</span>
          <span>Higher impact</span>
        </div>

        <div className="space-y-3">
          {factors.map((f) => {
            const lowPct  = (Math.abs(f.lowImpactPct)  / maxMag) * 50;
            const highPct = (Math.abs(f.highImpactPct) / maxMag) * 50;
            return (
              <div key={f.label}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="text-xs font-medium text-[#1E1B3A] truncate">{f.label}</span>
                    <Tooltip content={f.description} />
                  </div>
                </div>
                <div className="relative h-7 bg-[#FAFAFF] rounded-lg overflow-hidden">
                  {/* Center axis */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#E8E4F0]" />

                  {/* Low side */}
                  <div
                    className="absolute top-1 bottom-1 right-1/2 bg-gradient-to-l from-[#E94560]/70 to-[#E94560]/30 rounded-l-md"
                    style={{ width: `${lowPct}%` }}
                  />
                  {/* High side */}
                  <div
                    className="absolute top-1 bottom-1 left-1/2 bg-gradient-to-r from-[#10B981]/70 to-[#10B981]/30 rounded-r-md"
                    style={{ width: `${highPct}%` }}
                  />

                  {/* Labels */}
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-[#E94560] px-2"
                    style={{ right: `calc(50% + ${lowPct}% + 2px)` }}
                  >
                    {fmt(f.lowImpactPct)}
                  </span>
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-[#10B981] px-2"
                    style={{ left: `calc(50% + ${highPct}% + 2px)` }}
                  >
                    {fmt(f.highImpactPct)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
