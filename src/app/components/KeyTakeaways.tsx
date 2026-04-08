import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import type { ModelType } from "@/data/types";

interface Takeaway {
  Icon: typeof Lightbulb;
  color: string;
  headline: string;
  detail: string;
}

const TAKEAWAYS: Record<ModelType, Takeaway[]> = {
  gross_adds: [
    {
      Icon: TrendingUp,
      color: "#9B51E0",
      headline: "Promotional pricing drove a sustained acquisition surge",
      detail:
        "The +18.2% subscriber lift isn't a launch-week pop — actual gross adds stayed 950+ ahead of the counterfactual baseline through Week 12. That persistence suggests the discount opened a new addressable segment rather than simply pulling forward existing demand.",
    },
    {
      Icon: Lightbulb,
      color: "#6C63FF",
      headline: "Ad-lite captured the bulk of incremental volume",
      detail:
        "DTC-heavy channels contributed ~62% of new sign-ups. The entry-tier price point lowered friction for price-sensitive cohorts who wouldn't have converted at standard rates — widening the funnel, not cannibalising premium tiers.",
    },
    {
      Icon: AlertCircle,
      color: "#00B4D8",
      headline: "US outperformed peer markets — a scalability signal worth testing",
      detail:
        "US (+16.1% delta) beat UK (+10.9%) and Australia (+6.1%) by a meaningful margin. Similarity scores hold above 85% across all markets, so the gap points to promotional visibility and channel mix differences, not control-group misfit.",
    },
  ],
  churn: [
    {
      Icon: TrendingUp,
      color: "#9B51E0",
      headline: "The pricing change reversed a structural churn trend",
      detail:
        "Without the event the model projected churn rising to 2,750 by Week 12. Instead it held at 1,880 — a 31.6% reduction. The divergence opened in Week 5 and widened steadily, pointing to a retention mechanism rather than a one-time anomaly.",
    },
    {
      Icon: Lightbulb,
      color: "#6C63FF",
      headline: "Weeks 5–8 show the strongest lock-in effect post-event",
      detail:
        "The sharpest gap between actual and counterfactual churn sits in the 4-week window immediately after the event. This aligns with promotional renewal windows — subscribers who signed up at the promo price are re-committing before standard rates kick in.",
    },
    {
      Icon: AlertCircle,
      color: "#00B4D8",
      headline: "UK churn reduction lags the US — watch the mid-term cohort",
      detail:
        "US achieved -31.6% vs UK's -25.0%. The 6.6 pt gap could reflect shorter promotional windows or lower content engagement. Track Weeks 13–20 to see whether UK cohorts catch up as they reach their first full renewal cycle.",
    },
  ],
  auto_renewal: [
    {
      Icon: TrendingUp,
      color: "#9B51E0",
      headline: "Auto-renewal opt-out rates dropped sharply at the price step-down",
      detail:
        "The 40.5% reduction in auto-renewal off-rates reflects that subscribers who enrolled during the promotional window are more likely to let their subscription run passively at a lower price — the discount reduces the psychological friction of staying.",
    },
    {
      Icon: Lightbulb,
      color: "#6C63FF",
      headline: "The gap widens in the back half — a compounding retention signal",
      detail:
        "By Week 12, actual auto-renewal off-rates (1,250) are running 41% below counterfactual (2,100). The widening trajectory suggests subscribers aren't just staying — they're becoming habitual, reducing the need for active re-engagement spend.",
    },
    {
      Icon: AlertCircle,
      color: "#00B4D8",
      headline: "Monitor margin dilution as the promo cohort normalises",
      detail:
        "The metric looks strong now, but subscribers acquired at the discount will renew at the promotional rate. Model the ARPU delta against the retention gain to confirm the LTV equation is net positive before expanding to additional markets.",
    },
  ],
};

interface KeyTakeawaysProps {
  modelType: ModelType;
}

export function KeyTakeaways({ modelType }: KeyTakeawaysProps) {
  const takeaways = TAKEAWAYS[modelType];

  return (
    <div className="rounded-2xl border border-[#E8E4F0] bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8E4F0] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shadow-sm shrink-0">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1E1B3A]">Key Takeaways</h3>
          <p className="text-[11px] text-[#7B7694]">The why behind every number</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {takeaways.map((t, i) => {
          const Icon = t.Icon;
          return (
            <div key={i} className="flex gap-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${t.color}16` }}
              >
                <Icon className="w-4 h-4" style={{ color: t.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1E1B3A] leading-snug mb-1">
                  {t.headline}
                </p>
                <p className="text-xs text-[#7B7694] leading-relaxed">{t.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
