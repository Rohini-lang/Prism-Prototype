import { useState } from "react";
import { ChevronDown, Database } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ElasticityModel } from "@/data/types";
import { TIER_META, getMarketLabel } from "@/data/elasticity";

interface ConfidencePanelProps {
  model: ElasticityModel;
}

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n.toFixed(0);
}

const TRAINING_WINDOW = "Jan 2024 – Mar 2026 · 27 months";
const MODEL_NAME = "Prism elastic-net v3.2";
const LAST_REFRESH = "Apr 28, 2026 · 04:12 UTC";

export function ConfidencePanel({ model }: ConfidencePanelProps) {
  const [open, setOpen] = useState(false);
  const tier = TIER_META.find((t) => t.id === model.tier);

  return (
    <div className="bg-white border border-[#E8E4F0] rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FAFAFF] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#F0EDF8] border border-[#E8E4F0] flex items-center justify-center">
            <Database className="w-3.5 h-3.5 text-[#9B51E0]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#1E1B3A]">Model confidence & provenance</p>
            <p className="text-xs text-[#7B7694]">
              {MODEL_NAME} · {model.confidence}% confidence on {tier?.label} × {getMarketLabel(model.market)}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#7B7694] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 border-t border-[#E8E4F0]">
              <div>
                <p className="text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-1">Model</p>
                <p className="text-xs text-[#1E1B3A] font-mono">{MODEL_NAME}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-1">Confidence</p>
                <p className="text-xs text-[#1E1B3A] font-mono">{model.confidence}%</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-1">Sample size</p>
                <p className="text-xs text-[#1E1B3A] font-mono">{fmtCount(model.sampleSize)} subscribers</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-1">Elasticity coef.</p>
                <p className="text-xs text-[#1E1B3A] font-mono">{model.sensitivity.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-1">Training window</p>
                <p className="text-xs text-[#1E1B3A] font-mono">{TRAINING_WINDOW}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-1">Last refresh</p>
                <p className="text-xs text-[#1E1B3A] font-mono">{LAST_REFRESH}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-1">Tier</p>
                <p className="text-xs text-[#1E1B3A] font-mono">{tier?.label}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#B5B0C8] uppercase tracking-wide mb-1">Market</p>
                <p className="text-xs text-[#1E1B3A] font-mono">{getMarketLabel(model.market)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
