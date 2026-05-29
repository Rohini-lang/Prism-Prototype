import { TrendingUp, TrendingDown, Zap, Bookmark, BookmarkCheck, X } from "lucide-react";
import type { ModelType } from "@/data/types";
import type { PinnedItem, PinnedTakeaway, TakeawayType } from "@/app/hooks/useWatchlist";
import { MARKET_CODE } from "@/app/hooks/useWatchlist";

function KeyInsightsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="14" height="13" rx="2.5" stroke="white" strokeWidth="1.5" fill="none" />
      <line x1="7" y1="10" x2="14" y2="10" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="13" x2="14" y2="13" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="10" cy="4" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
      <line x1="10" y1="6.5" x2="10" y2="9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="8" x2="11.5" y2="8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10" y1="9.5" x2="11.5" y2="9.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface Takeaway {
  type: TakeawayType;
  headline: string;
  detail: string;
  direction?: "positive" | "negative" | "neutral";
}

export const TYPE_CONFIG: Record<TakeawayType, { label: string; bg: string; text: string; border: string }> = {
  trend:      { label: "Trend",      bg: "#EDE9FC", text: "#6B5CE7", border: "#C4BAF5" },
  volatility: { label: "Volatility", bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" },
  anomaly:    { label: "Anomaly",    bg: "#FCE7F3", text: "#BE185D", border: "#F9A8D4" },
};

export const MODEL_LABELS: Record<ModelType, string> = {
  gross_adds:   "Gross Adds",
  churn:        "Churn",
  auto_renewal: "Auto-Renewal",
};

const TAKEAWAYS: Record<ModelType, Takeaway[]> = {
  gross_adds: [
    {
      type: "trend",
      direction: "positive",
      headline: "+18.2% subscriber lift held through Week 12",
      detail:
        "Actual gross adds stayed 950+ above the counterfactual baseline for the entire post-period — pointing to a new addressable segment opened by the discount, not just pull-forward demand.",
    },
    {
      type: "anomaly",
      direction: "positive",
      headline: "US outperformed peer markets by 5–10 pts",
      detail:
        "US (+16.1%) beat UK (+10.9%) and Australia (+6.1%) despite all markets showing similarity scores above 85%. The gap points to promotional visibility and channel mix differences worth isolating.",
    },
    {
      type: "volatility",
      direction: "neutral",
      headline: "Ad-lite volume concentrated in first 3 weeks — watch Week 4+ retention",
      detail:
        "DTC channels drove ~62% of new sign-ups, heavily front-loaded. The Week 4–6 window is critical: if these cohorts churn before auto-renewal, the headline lift overstates durable impact.",
    },
  ],
  churn: [
    {
      type: "trend",
      direction: "positive",
      headline: "Churn fell 31.6% vs. counterfactual by Week 12",
      detail:
        "Without the event, the model projected churn rising to 2,750. It held at 1,880. The divergence opened in Week 5 and widened steadily — a structural retention effect, not a one-off.",
    },
    {
      type: "volatility",
      direction: "neutral",
      headline: "Weeks 5–8 show the steepest rate of change — high sensitivity window",
      detail:
        "The gap between actual and counterfactual churn is accelerating fastest in this 4-week window. It coincides with promotional renewal deadlines — small cohort-level shifts here will materially swing the final metric.",
    },
    {
      type: "anomaly",
      direction: "negative",
      headline: "UK churn reduction lags US by 6.6 pts — structural outlier",
      detail:
        "US achieved −31.6% vs UK's −25.0%. Similarity scores are tight, so this gap likely reflects shorter UK promotional windows or lower content engagement. Weeks 13–20 will confirm whether it's timing or a market-level difference.",
    },
  ],
  auto_renewal: [
    {
      type: "trend",
      direction: "positive",
      headline: "Auto-renewal off-rates down 40.5% — compounding through Week 12",
      detail:
        "The reduction isn't plateauing: actual off-rates (1,250) are still widening from counterfactual (2,100) at Week 12. Subscribers enrolled at the promo price are becoming passive renewers, reducing active re-engagement cost.",
    },
    {
      type: "volatility",
      direction: "neutral",
      headline: "Back-half widening suggests habit formation, but cohort timing is tight",
      detail:
        "The gap accelerates in Weeks 8–12. This is encouraging but also means a policy change during this window — price step-up, content gaps — could trigger a sharp reversal that the model won't anticipate.",
    },
    {
      type: "anomaly",
      direction: "negative",
      headline: "ARPU dilution risk at renewal — LTV equation unconfirmed",
      detail:
        "The retention metric looks strong, but the promo cohort renews at a discounted rate. Without modelling the ARPU delta against the retention gain, the net LTV impact remains ambiguous before scaling to new markets.",
    },
  ],
};

export const directionIcon = (direction?: Takeaway["direction"], size = "w-3.5 h-3.5") => {
  if (direction === "positive") return <TrendingUp className={`${size} text-[#10B981]`} />;
  if (direction === "negative") return <TrendingDown className={`${size} text-[#E94560]`} />;
  return <Zap className={`${size} text-[#D97706]`} />;
};

interface KeyTakeawaysProps {
  modelType: ModelType;
  market?: string | null;
  pinned: PinnedItem[];
  isPinned: (key: string) => boolean;
  onToggle: (item: Omit<PinnedTakeaway, "pinnedAt">) => void;
  onUnpin: (key: string) => void;
}

const getKey = (mt: ModelType, i: number) => `${mt}-${i}`;

export function KeyTakeaways({ modelType, market, pinned, isPinned, onToggle, onUnpin }: KeyTakeawaysProps) {
  const takeaways = TAKEAWAYS[modelType];
  const localPinnedCount = pinned.filter((p) => p.kind === "takeaway" && p.modelType === modelType).length;

  return (
    <div className="rounded-2xl border border-[#E8E4F0] bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E8E4F0] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shadow-sm shrink-0">
          <KeyInsightsIcon />
        </div>
        <h3 className="text-sm font-semibold text-[#1E1B3A] flex-1">Key Takeaways</h3>
        {pinned.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE9FC] border border-[#C4BAF5]">
            <Bookmark className="w-3 h-3 text-[#6B5CE7] fill-[#6B5CE7]" />
            <span className="text-[11px] font-semibold text-[#6B5CE7]">
              {pinned.length} on watchlist
            </span>
          </div>
        )}
      </div>

      {/* Takeaway rows */}
      <div className="divide-y divide-[#F0EDF8]">
        {takeaways.map((t, i) => {
          const key    = getKey(modelType, i);
          const cfg    = TYPE_CONFIG[t.type];
          const pinned_ = isPinned(key);
          return (
            <div
              key={i}
              className={`px-6 py-4 flex gap-4 items-start group transition-colors ${
                pinned_ ? "bg-[#FAFAFF]" : "hover:bg-[#FAFAFF]"
              }`}
            >
              <div className="mt-0.5 shrink-0">{directionIcon(t.direction)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md border shrink-0"
                    style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                  >
                    {cfg.label}
                  </span>
                  <p className="text-sm font-semibold text-[#1E1B3A] leading-snug">{t.headline}</p>
                </div>
                <p className="text-xs text-[#7B7694] leading-relaxed">{t.detail}</p>
              </div>

              <button
                type="button"
                onClick={() => onToggle({ kind: "takeaway", key, modelType, type: t.type, direction: t.direction, headline: t.headline, market: market ?? undefined })}
                title={pinned_ ? "Remove from watchlist" : "Pin to watchlist"}
                className={`shrink-0 mt-0.5 p-1.5 rounded-lg transition-all ${
                  pinned_
                    ? "text-[#6B5CE7] bg-[#EDE9FC]"
                    : "text-[#B5B0C8] opacity-0 group-hover:opacity-100 hover:text-[#6B5CE7] hover:bg-[#EDE9FC]"
                }`}
              >
                {pinned_ ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Watchlist summary inside the card (shows current model's pins) */}
      {localPinnedCount > 0 && (
        <div className="border-t border-[#E8E4F0] bg-[#FAFAFF] px-6 py-4">
          <p className="text-[11px] font-semibold text-[#6B5CE7] uppercase tracking-wide mb-3">
            Watchlist · {pinned.length} item{pinned.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {pinned.filter((p): p is PinnedTakeaway => p.kind === "takeaway").map((item) => {
              const cfg = TYPE_CONFIG[item.type];
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-2.5 bg-white border border-[#E8E4F0] rounded-xl px-3 py-2.5"
                >
                  <div className="shrink-0">{directionIcon(item.direction)}</div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border"
                      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-[#B5B0C8]">{MODEL_LABELS[item.modelType]}</span>
                  {item.market && (
                    <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F0EDF8] text-[#6B5CE7] border border-[#C4BAF5]">
                      {MARKET_CODE[item.market] ?? item.market.toUpperCase()}
                    </span>
                  )}
                  </div>
                  <p className="text-xs text-[#1E1B3A] font-medium flex-1 min-w-0 truncate">
                    {item.headline}
                  </p>
                  <button
                    type="button"
                    onClick={() => onUnpin(item.key)}
                    className="shrink-0 p-1 rounded-md text-[#B5B0C8] hover:text-[#E94560] hover:bg-[#FEE2E2] transition-all"
                    title="Remove from watchlist"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
