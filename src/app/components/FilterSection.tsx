import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import * as Toggle from "@radix-ui/react-toggle";

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
  activeMetric: string;
  onReset: () => void;
  hasChanges: boolean;
}

const TIER_OPTIONS: Tier[] = ["Ad-lite", "Ad-free", "Ultimate Ad-free"];
const CATEGORY_OPTIONS: Category[] = ["Retail", "Wholesale", "Both"];
const CONTENT_TYPE_OPTIONS: ContentType[] = ["Tentpole", "Library", "Both"];

export function FilterSection({
  timeWindow,
  onTimeWindowChange,
  tiers,
  onTiersChange,
  category,
  onCategoryChange,
  contentType,
  onContentTypeChange,
  activeMetric,
  onReset,
  hasChanges,
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-[#1A1A1A] hover:text-[#2D7D78] transition-colors"
        >
          <span>Refine your view</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {hasChanges && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-[#2D7D78] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-2">
          {/* Time Window */}
          <div className="space-y-2">
            <label className="text-xs text-[#6B6B6B]">Time window</label>
            <div className="space-y-3">
              <Slider.Root
                value={[timeWindow]}
                onValueChange={([value]) => onTimeWindowChange(value)}
                min={4}
                max={16}
                step={2}
                className="relative flex items-center select-none touch-none w-full h-5"
              >
                <Slider.Track className="bg-[#E0DED8] relative grow rounded-full h-1">
                  <Slider.Range className="absolute bg-[#2D7D78] rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-[#2D7D78] rounded-full hover:bg-[#F8F7F4] focus:outline-none focus:ring-2 focus:ring-[#2D7D78]" />
              </Slider.Root>
              <div className="text-xs font-mono text-[#1A1A1A] text-center">
                ±{timeWindow} weeks
              </div>
            </div>
          </div>

          {/* Tiers */}
          <div className="space-y-2">
            <label className="text-xs text-[#6B6B6B]">Tier</label>
            <div className="flex gap-2 flex-wrap">
              <Toggle.Root
                pressed={allTiersSelected}
                onPressedChange={handleSelectAllTiers}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  allTiersSelected
                    ? "bg-[#2D7D78] text-white border-[#2D7D78]"
                    : "bg-white text-[#1A1A1A] border-[#E0DED8] hover:border-[#C4C2BA]"
                }`}
              >
                All
              </Toggle.Root>
              {TIER_OPTIONS.map((tier) => {
                const isSelected = !allTiersSelected && tiers.includes(tier);
                return (
                  <Toggle.Root
                    key={tier}
                    pressed={isSelected}
                    onPressedChange={() => {
                      if (allTiersSelected) {
                        onTiersChange([tier]);
                      } else {
                        handleTierToggle(tier);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      isSelected
                        ? "bg-[#2D7D78] text-white border-[#2D7D78]"
                        : "bg-white text-[#1A1A1A] border-[#E0DED8] hover:border-[#C4C2BA]"
                    }`}
                  >
                    {tier}
                  </Toggle.Root>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs text-[#6B6B6B]">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_OPTIONS.map((cat) => (
                <Toggle.Root
                  key={cat}
                  pressed={category === cat}
                  onPressedChange={() => onCategoryChange(cat)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    category === cat
                      ? "bg-[#2D7D78] text-white border-[#2D7D78]"
                      : "bg-white text-[#1A1A1A] border-[#E0DED8] hover:border-[#C4C2BA]"
                  }`}
                >
                  {cat}
                </Toggle.Root>
              ))}
            </div>
          </div>

          {/* Content Type — only visible for Gross Adds metric */}
          {activeMetric === "grossAdds" && (
            <div className="space-y-2">
              <label className="text-xs text-[#6B6B6B]">Content type</label>
              <div className="flex gap-2 flex-wrap">
                {CONTENT_TYPE_OPTIONS.map((ct) => (
                  <Toggle.Root
                    key={ct}
                    pressed={contentType === ct}
                    onPressedChange={() => onContentTypeChange(ct)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      contentType === ct
                        ? "bg-[#2D7D78] text-white border-[#2D7D78]"
                        : "bg-white text-[#1A1A1A] border-[#E0DED8] hover:border-[#C4C2BA]"
                    }`}
                  >
                    {ct}
                  </Toggle.Root>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
