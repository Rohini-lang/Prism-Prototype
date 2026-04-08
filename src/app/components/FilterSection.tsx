import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import * as Toggle from "@radix-ui/react-toggle";
import type { ModelType } from "@/data/types";

export type Tier = "Ad-lite" | "Ad-free" | "Ultimate Ad-free";
export type Category = "Retail" | "Wholesale" | "Both";
export type ContentType = "Tentpole" | "Library" | "Both";

interface FilterSectionProps {
  timeWindow: number;
  onTimeWindowChange: (value: number) => void;
  tiers: Tier[];
  onTiersChange: (values: Tier[]) => void;
  category: Category;
  onCategoryChange: (value: Category) => void;
  contentType: ContentType;
  onContentTypeChange: (value: ContentType) => void;
  selectedModel: ModelType;
  onReset: () => void;
  hasChanges: boolean;
}

const TIER_OPTIONS: Tier[] = ["Ad-lite", "Ad-free", "Ultimate Ad-free"];
const CATEGORY_OPTIONS: Category[] = ["Retail", "Wholesale", "Both"];
const CONTENT_TYPE_OPTIONS: ContentType[] = ["Tentpole", "Library", "Both"];

export function FilterSection({
  timeWindow, onTimeWindowChange, tiers, onTiersChange, category, onCategoryChange,
  contentType, onContentTypeChange, selectedModel, onReset, hasChanges,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const allTiersSelected = tiers.length === TIER_OPTIONS.length;

  const handleTierToggle = (tier: Tier) => {
    if (tiers.includes(tier)) {
      const next = tiers.filter((t) => t !== tier);
      if (next.length > 0) onTiersChange(next);
    } else {
      onTiersChange([...tiers, tier]);
    }
  };

  const handleSelectAllTiers = () => {
    onTiersChange(allTiersSelected ? [TIER_OPTIONS[0]] : [...TIER_OPTIONS]);
  };

  const pillClass = (active: boolean) =>
    `px-3 py-2 text-xs rounded-full border transition-colors ${
      active
        ? "bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white border-[#9B51E0]"
        : "bg-white text-[#1E1B3A] border-[#E8E4F0] hover:border-[#9B51E0]/30"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-[#1E1B3A] font-medium hover:text-[#9B51E0] transition-colors">
          <span>Refine your view</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {hasChanges && (
          <button type="button" onClick={onReset}
            className="text-xs text-[#9B51E0] hover:text-[#7B68EE] flex items-center gap-1.5 transition-colors">
            <RotateCcw className="w-3 h-3" />Reset
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-5 pt-2">
          <div className="space-y-3">
            <label className="text-xs text-[#7B7694] font-medium">Time window</label>
            <Slider.Root value={[timeWindow]} onValueChange={([v]) => onTimeWindowChange(v)}
              min={4} max={16} step={2} className="relative flex items-center select-none touch-none w-full h-5">
              <Slider.Track className="bg-[#E8E4F0] relative grow rounded-full h-1">
                <Slider.Range className="absolute bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-[#9B51E0] rounded-full hover:bg-[#FAFAFF] focus:outline-none focus:ring-2 focus:ring-[#9B51E0] shadow-md" />
            </Slider.Root>
            <div className="text-xs font-mono text-[#1E1B3A] text-center bg-white py-1.5 rounded-lg border border-[#E8E4F0]">
              ±{timeWindow} weeks
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-[#7B7694] font-medium">Tier</label>
            <div className="flex gap-2 flex-wrap">
              <Toggle.Root pressed={allTiersSelected} onPressedChange={handleSelectAllTiers} className={pillClass(allTiersSelected)}>All</Toggle.Root>
              {TIER_OPTIONS.map((tier) => {
                const isSelected = !allTiersSelected && tiers.includes(tier);
                return (
                  <Toggle.Root key={tier} pressed={isSelected}
                    onPressedChange={() => { if (allTiersSelected) onTiersChange([tier]); else handleTierToggle(tier); }}
                    className={pillClass(isSelected)}>{tier}</Toggle.Root>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-[#7B7694] font-medium">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_OPTIONS.map((cat) => (
                <Toggle.Root key={cat} pressed={category === cat} onPressedChange={() => onCategoryChange(cat)}
                  className={pillClass(category === cat)}>{cat}</Toggle.Root>
              ))}
            </div>
          </div>

          {selectedModel === "gross_adds" && (
            <div className="space-y-3">
              <label className="text-xs text-[#7B7694] font-medium">Content type</label>
              <div className="flex gap-2 flex-wrap">
                {CONTENT_TYPE_OPTIONS.map((ct) => (
                  <Toggle.Root key={ct} pressed={contentType === ct} onPressedChange={() => onContentTypeChange(ct)}
                    className={pillClass(contentType === ct)}>{ct}</Toggle.Root>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
