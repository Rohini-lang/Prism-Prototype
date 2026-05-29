import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Download } from "lucide-react";
import { PrismLogo } from "../components/PrismLogo";
import { ChatBox } from "../components/ChatBox";
import { ScenarioBuilder } from "../components/elasticity/ScenarioBuilder";
import { ImpactHero } from "../components/elasticity/ImpactHero";
import { ElasticityCurveInteractive } from "../components/elasticity/ElasticityCurveInteractive";
import { SensitivityTornado } from "../components/elasticity/SensitivityTornado";
import { CrossMarketLens } from "../components/elasticity/CrossMarketLens";
import { ScenarioTray } from "../components/elasticity/ScenarioTray";
import { ConfidencePanel } from "../components/elasticity/ConfidencePanel";
import {
  computeScenarioImpact,
  computeCrossMarketResults,
  computeSensitivityFactors,
  getElasticityModel,
  DEFAULT_SCENARIO,
} from "@/data/elasticity";
import type { ScenarioInput } from "@/data/types";
import type { PinnedScenario, PinnedTakeaway } from "../hooks/useWatchlist";

interface ElasticityDashboardProps {
  initialScenario?: ScenarioInput;
  pinnedScenarios: PinnedScenario[];
  isPinned: (key: string) => boolean;
  onTogglePin: (item: Omit<PinnedTakeaway, "pinnedAt"> | Omit<PinnedScenario, "pinnedAt">) => void;
  onUnpin: (key: string) => void;
  onBack: () => void;
  onChatSubmit: (text: string) => void;
  modeToggle: React.ReactNode;
}

function scenarioKey(s: ScenarioInput): string {
  return `scenario:${s.tier}:${s.market}:${s.priceDelta.toFixed(2)}:${s.horizonMonths}`;
}

export function ElasticityDashboard({
  initialScenario,
  pinnedScenarios,
  isPinned,
  onTogglePin,
  onUnpin,
  onBack,
  onChatSubmit,
  modeToggle,
}: ElasticityDashboardProps) {
  const [scenario, setScenario] = useState<ScenarioInput>(initialScenario ?? DEFAULT_SCENARIO);

  // If the parent supplies a new initial scenario (e.g. user clicked a pinned
  // scenario from the home watchlist), sync it in.
  useEffect(() => {
    if (initialScenario) setScenario(initialScenario);
  }, [initialScenario]);

  const model    = useMemo(() => getElasticityModel(scenario.tier, scenario.market), [scenario.tier, scenario.market]);
  const impact   = useMemo(() => computeScenarioImpact(scenario), [scenario]);
  const peers    = useMemo(() => computeCrossMarketResults(scenario), [scenario]);
  const factors  = useMemo(() => computeSensitivityFactors(scenario), [scenario]);

  const proposedPrice = +(model.basePrice + scenario.priceDelta).toFixed(2);

  const handleCurveChange = (newPrice: number) => {
    setScenario((s) => ({ ...s, priceDelta: +(newPrice - model.basePrice).toFixed(2) }));
  };

  const handleSelectMarket = (market: string) => {
    setScenario((s) => ({ ...s, market }));
  };

  const currentKey = scenarioKey(scenario);
  const saved = isPinned(currentKey);

  const handleSave = () => {
    if (saved) {
      onUnpin(currentKey);
      return;
    }
    onTogglePin({
      kind: "scenario",
      key: currentKey,
      tier: scenario.tier,
      market: scenario.market,
      basePrice: impact.basePrice,
      newPrice: impact.newPrice,
      priceDelta: scenario.priceDelta,
      horizonMonths: scenario.horizonMonths,
      subsDeltaPct: impact.subsDeltaPct,
      revenueDeltaPct: impact.revenueDeltaPct,
      confidence: impact.confidence,
    });
  };

  const handleLoadSavedScenario = (s: PinnedScenario) => {
    setScenario({
      tier: s.tier,
      market: s.market,
      priceDelta: s.priceDelta,
      horizonMonths: s.horizonMonths,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFF]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#FAFAFF]/85 backdrop-blur border-b border-[#E8E4F0]">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2.5 group"
          >
            <ArrowLeft className="w-4 h-4 text-[#7B7694] group-hover:text-[#9B51E0] transition-colors" />
            <PrismLogo size={22} />
            <h1 className="font-display text-lg text-[#1E1B3A] tracking-tight group-hover:opacity-70 transition-opacity">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B51E0] to-[#7B68EE]">
                Prism
              </span>
            </h1>
            <span className="text-xs text-[#7B7694] pl-2 border-l border-[#E8E4F0] ml-1">Demand-Price Elasticity</span>
          </button>
          <div className="flex items-center gap-3">
            {modeToggle}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Search bar + Export */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <ChatBox hidePrompts onSubmit={onChatSubmit} />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E4F0] text-[#1E1B3A] hover:border-[#9B51E0]/40 hover:shadow-sm transition-all group shrink-0"
            >
              <Download className="w-4 h-4 text-[#9B51E0] group-hover:text-[#7B68EE]" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>

          {/* Scenario builder */}
          <ScenarioBuilder
            scenario={scenario}
            onChange={setScenario}
            onReset={() => setScenario(DEFAULT_SCENARIO)}
            onSave={handleSave}
            isSaved={saved}
          />

          {/* Pinned scenarios tray */}
          <ScenarioTray
            scenarios={pinnedScenarios}
            onUnpin={onUnpin}
            onLoad={handleLoadSavedScenario}
            activeKey={saved ? currentKey : undefined}
          />

          {/* Hero */}
          <ImpactHero scenario={scenario} impact={impact} />

          {/* Curve */}
          <ElasticityCurveInteractive
            model={model}
            proposedPrice={proposedPrice}
            onProposedPriceChange={handleCurveChange}
          />

          {/* Sensitivity */}
          <SensitivityTornado factors={factors} />

          {/* Cross-market lens */}
          <CrossMarketLens results={peers} onSelectMarket={handleSelectMarket} />

          {/* Provenance */}
          <ConfidencePanel model={model} />
        </motion.div>
      </main>
    </div>
  );
}
