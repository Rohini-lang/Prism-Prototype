import { useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import type { ControlBundle } from "@/data/types";

interface ControlGroupSelectorProps {
  bundles: ControlBundle[];
  selectedBundle: string | null;
  onBundleChange: (bundleId: string) => void;
}

export function ControlGroupSelector({
  bundles,
  selectedBundle,
  onBundleChange,
}: ControlGroupSelectorProps) {
  const [expandedBundle, setExpandedBundle] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {bundles.map((bundle) => {
        const isSelected = selectedBundle === bundle.id;
        const isExpanded = expandedBundle === bundle.id;

        return (
          <div key={bundle.id} className="border border-[#E0DED8] rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => onBundleChange(bundle.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors ${
                isSelected ? "bg-[#F8F7F4]" : "bg-white hover:bg-[#F8F7F4]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Checkbox.Root
                  checked={isSelected}
                  className="w-4 h-4 border-2 border-[#2D7D78] rounded flex items-center justify-center data-[state=checked]:bg-[#2D7D78]"
                >
                  <Checkbox.Indicator>
                    <Check className="w-3 h-3 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-sm text-[#1A1A1A]">{bundle.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#2D7D78] text-white text-xs font-mono rounded-full">
                  {bundle.markets.length}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedBundle(isExpanded ? null : bundle.id);
                  }}
                  className="text-[#6B6B6B] hover:text-[#1A1A1A]"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </button>
            {isExpanded && (
              <div className="px-3 py-2 bg-[#F8F7F4] border-t border-[#E0DED8]">
                <div className="space-y-1.5">
                  {bundle.markets.map((market) => (
                    <div key={market} className="text-xs text-[#6B6B6B] font-mono pl-6">
                      • {market}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <p className="text-xs text-[#6B6B6B] mt-3 px-1">
        These markets simulate what would have happened without the event.
      </p>
    </div>
  );
}
