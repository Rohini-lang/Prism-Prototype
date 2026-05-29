import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Slider from "@radix-ui/react-slider";
import { ChevronDown, RotateCcw, Bookmark, BookmarkCheck, Search, Check } from "lucide-react";
import type { ScenarioInput, Tier } from "@/data/types";
import { TIER_META, HORIZON_OPTIONS, getElasticityModel, getMarketLabel } from "@/data/elasticity";
import { MOCK_MARKETS } from "@/data/mock";

interface ScenarioBuilderProps {
  scenario: ScenarioInput;
  onChange: (next: ScenarioInput) => void;
  onReset: () => void;
  onSave: () => void;
  isSaved: boolean;
}

function Token({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#E8E4F0] hover:border-[#9B51E0]/40 hover:shadow-sm transition-all text-[#1E1B3A] font-semibold text-base"
    >
      {children}
      <ChevronDown className="w-3.5 h-3.5 text-[#9B51E0]" />
    </button>
  );
}

// ── Tier picker ──────────────────────────────────────────────────────────────

function TierPicker({ tier, onChange }: { tier: Tier; onChange: (t: Tier) => void }) {
  const [open, setOpen] = useState(false);
  const current = TIER_META.find((t) => t.id === tier);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Token>{current?.label}</Token>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-white border border-[#E8E4F0] rounded-xl shadow-lg z-50 min-w-[200px] overflow-hidden" sideOffset={6} align="start">
          {TIER_META.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { onChange(t.id); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#F5F3FA] transition-colors text-left"
            >
              <span className="text-[#1E1B3A]">{t.label}</span>
              {t.id === tier && <Check className="w-4 h-4 text-[#9B51E0]" />}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ── Market picker (searchable) ───────────────────────────────────────────────

function MarketPicker({ market, onChange }: { market: string; onChange: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = MOCK_MARKETS.filter((m) => m.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Token>{getMarketLabel(market)}</Token>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-white border border-[#E8E4F0] rounded-xl shadow-lg z-50 w-[260px] max-h-[320px] overflow-hidden" sideOffset={6} align="start">
          <div className="p-3 border-b border-[#E8E4F0]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#B5B0C8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search markets..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFAFF] border border-[#E8E4F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B51E0] text-[#1E1B3A]"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[240px]">
            {filtered.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => { onChange(m.value); setOpen(false); setSearch(""); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#F5F3FA] transition-colors text-left"
              >
                <span className="text-[#1E1B3A]">{m.label}</span>
                {m.value === market && <Check className="w-4 h-4 text-[#9B51E0]" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-[#7B7694]">No markets found</div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ── Price-delta picker ───────────────────────────────────────────────────────

type DeltaUnit = "dollar" | "percent";

function PriceDeltaPicker({
  priceDelta,
  basePrice,
  onChange,
}: {
  priceDelta: number;
  basePrice: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<DeltaUnit>("dollar");

  const dollarMin = -basePrice * 0.4;
  const dollarMax =  basePrice * 0.4;

  const display = (() => {
    const sign = priceDelta >= 0 ? "+" : "−";
    const abs  = Math.abs(priceDelta);
    if (unit === "percent") {
      const pct = (priceDelta / basePrice) * 100;
      const psign = pct >= 0 ? "+" : "−";
      return `${psign}${Math.abs(pct).toFixed(1)}%`;
    }
    return `${sign}$${abs.toFixed(2)}`;
  })();

  const sliderValue = unit === "percent"
    ? (priceDelta / basePrice) * 100
    : priceDelta;
  const sliderMin = unit === "percent" ? -40 : dollarMin;
  const sliderMax = unit === "percent" ?  40 : dollarMax;
  const sliderStep = unit === "percent" ? 0.5 : 0.25;

  const handleSlider = (v: number[]) => {
    const raw = v[0];
    const dollars = unit === "percent" ? (raw / 100) * basePrice : raw;
    onChange(+dollars.toFixed(2));
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Token>{display}</Token>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-white border border-[#E8E4F0] rounded-xl shadow-lg z-50 w-[340px] p-5" sideOffset={6} align="start">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#7B7694] uppercase tracking-wide">Price change</span>
            <div className="flex items-center gap-1 bg-[#F0EDF8] p-0.5 rounded-md border border-[#E8E4F0]">
              {(["dollar", "percent"] as DeltaUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    unit === u ? "bg-white text-[#1E1B3A] shadow-sm" : "text-[#7B7694] hover:text-[#1E1B3A]"
                  }`}
                >
                  {u === "dollar" ? "$" : "%"}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="font-mono text-2xl text-[#1E1B3A] font-semibold">{display}</div>
            <div className="text-[11px] text-[#7B7694] mt-1">
              ${basePrice.toFixed(2)} → ${(basePrice + priceDelta).toFixed(2)}
            </div>
          </div>

          <Slider.Root
            value={[sliderValue]}
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            onValueChange={handleSlider}
            className="relative flex items-center select-none touch-none w-full h-5"
          >
            <Slider.Track className="bg-[#F0EDF8] relative grow rounded-full h-1.5">
              <Slider.Range className="absolute bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-[#9B51E0] rounded-full shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-[#9B51E0]/30" />
          </Slider.Root>

          <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-[#B5B0C8]">
            <span>{unit === "percent" ? "−40%" : `−$${(dollarMax * 1).toFixed(0)}`}</span>
            <span>0</span>
            <span>{unit === "percent" ? "+40%" : `+$${dollarMax.toFixed(0)}`}</span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E8E4F0]">
            <button
              type="button"
              onClick={() => onChange(0)}
              className="text-xs text-[#7B7694] hover:text-[#9B51E0] transition-colors"
            >
              Reset to current price
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white text-xs font-semibold hover:shadow-md transition-shadow"
            >
              Done
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ── Horizon picker ───────────────────────────────────────────────────────────

function HorizonPicker({ horizon, onChange }: { horizon: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  const current = HORIZON_OPTIONS.find((o) => o.value === horizon);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Token>{current?.label}</Token>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-white border border-[#E8E4F0] rounded-xl shadow-lg z-50 min-w-[160px] overflow-hidden" sideOffset={6} align="start">
          {HORIZON_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#F5F3FA] transition-colors text-left"
            >
              <span className="text-[#1E1B3A]">{o.label}</span>
              {o.value === horizon && <Check className="w-4 h-4 text-[#9B51E0]" />}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ── Main builder ─────────────────────────────────────────────────────────────

export function ScenarioBuilder({ scenario, onChange, onReset, onSave, isSaved }: ScenarioBuilderProps) {
  const model = getElasticityModel(scenario.tier, scenario.market);

  return (
    <div className="bg-gradient-to-br from-[#9B51E0]/8 to-[#7B68EE]/4 border border-[#E8E4F0] rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap text-base text-[#1E1B3A]">
          <span className="text-[#7B7694]">What if I change</span>
          <TierPicker tier={scenario.tier} onChange={(t) => onChange({ ...scenario, tier: t })} />
          <span className="text-[#7B7694]">in</span>
          <MarketPicker market={scenario.market} onChange={(m) => onChange({ ...scenario, market: m })} />
          <span className="text-[#7B7694]">by</span>
          <PriceDeltaPicker
            priceDelta={scenario.priceDelta}
            basePrice={model.basePrice}
            onChange={(v) => onChange({ ...scenario, priceDelta: v })}
          />
          <span className="text-[#7B7694]">over</span>
          <HorizonPicker
            horizon={scenario.horizonMonths}
            onChange={(v) => onChange({ ...scenario, horizonMonths: v })}
          />
          <span className="text-[#7B7694]">?</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#E8E4F0] text-[#7B7694] hover:text-[#1E1B3A] hover:border-[#9B51E0]/40 transition-all text-xs font-medium"
            title="Reset to default scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              isSaved
                ? "bg-[#EDE9FC] text-[#6B5CE7] border border-[#C4BAF5]"
                : "bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white hover:shadow-md"
            }`}
            title={isSaved ? "Remove from watchlist" : "Save scenario to watchlist"}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            {isSaved ? "Saved" : "Save scenario"}
          </button>
        </div>
      </div>
    </div>
  );
}
