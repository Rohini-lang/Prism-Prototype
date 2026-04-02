import { useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import type { ControlBundle } from "@/data/types";

interface ControlGroupSelectorProps {
  bundles: ControlBundle[];
  selectedBundle: string | null;
  onBundleChange: (bundleId: string) => void;
}

export function ControlGroupSelector({ bundles, selectedBundle, onBundleChange }: ControlGroupSelectorProps) {
  const [expandedBundle, setExpandedBundle] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {bundles.map((bundle) => {
        const isSelected = selectedBundle === bundle.id;
        const isExpanded = expandedBundle === bundle.id;
        return (
          <div key={bundle.id} className="border border-[#E8E4F0] rounded-xl overflow-hidden shadow-sm">
            <div className="w-full flex items-center justify-between gap-3 bg-white">
              <button type="button" onClick={() => onBundleChange(bundle.id)}
                className={`flex items-center gap-3 flex-1 min-w-0 text-left px-4 py-3 transition-colors ${isSelected ? "bg-[#F5F0FF]" : "hover:bg-[#F5F3FA]"}`}>
                <Checkbox.Root checked={isSelected}
                  className="w-4 h-4 border-2 border-[#9B51E0] rounded flex items-center justify-center data-[state=checked]:bg-[#9B51E0] shrink-0">
                  <Checkbox.Indicator><Check className="w-3 h-3 text-white" /></Checkbox.Indicator>
                </Checkbox.Root>
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-sm text-[#1E1B3A]">{bundle.name}</span>
                  {bundle.recommended && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white text-[10px] font-medium rounded-full whitespace-nowrap">
                      Recommended
                    </span>
                  )}
                </div>
              </button>
              <div className={`flex items-center gap-2 shrink-0 px-4 py-3 transition-colors ${isSelected ? "bg-[#F5F0FF]" : ""}`}>
                <span className="px-2.5 py-1 bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white text-xs font-mono rounded-full">
                  {bundle.markets.length}
                </span>
                <button type="button" onClick={(e) => { e.stopPropagation(); setExpandedBundle(isExpanded ? null : bundle.id); }}
                  className="text-[#7B7694] hover:text-[#1E1B3A] p-1">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {isExpanded && (
              <div className="px-4 py-3 bg-[#FAFAFF] border-t border-[#E8E4F0]">
                <div className="space-y-2">
                  {bundle.markets.map((market) => (
                    <div key={market} className="text-xs text-[#7B7694] font-mono pl-7">• {market}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <p className="text-xs text-[#7B7694] mt-4 px-1 leading-relaxed">
        These markets simulate what would have happened without the event.
      </p>
    </div>
  );
}
