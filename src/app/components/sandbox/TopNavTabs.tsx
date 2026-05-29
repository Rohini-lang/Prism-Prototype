import { FlaskConical, LineChart as LineChartIcon, Users, TrendingUp, BarChart3, Check } from "lucide-react";
import { PrismLogo } from "../PrismLogo";

const TABS = [
  { id: "counterfactual",  label: "Counterfactual", icon: FlaskConical,   active: true  },
  { id: "elasticity",      label: "Elasticity",     icon: LineChartIcon,  active: false, badge: "new" },
  { id: "churn",           label: "Churn",          icon: Users,          active: false, badge: "new" },
  { id: "market-insights", label: "Market Insights",icon: TrendingUp,     active: false, badge: "new" },
  { id: "promo-impact",    label: "Promo Impact",   icon: BarChart3,      active: false, badge: "new" },
];

export function TopNavTabs() {
  return (
    <header className="sticky top-0 z-20 bg-[#000000]/85 backdrop-blur border-b border-[#262626]">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-center gap-8">
        <div className="flex items-center gap-2 shrink-0">
          <PrismLogo size={22} />
          <span className="font-display text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#B57AFF] to-[#9B7BFF]">
            Prism
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.active;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={!tab.active}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#1F1F1F] text-[#F2EFFF] border border-[#333333] shadow-sm"
                    : "text-[#6F6A85] hover:text-[#A39DB8] cursor-not-allowed"
                }`}
              >
                {isActive && (
                  <Check className="w-3 h-3 text-[#B57AFF]" />
                )}
                {!isActive && <Icon className="w-3.5 h-3.5 opacity-70" />}
                <span>{tab.label}</span>
                {!isActive && tab.badge && (
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#6F6A85] bg-[#262626] border border-[#262626] px-1 py-0.5 rounded">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
