import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, Loader2, Plus, Calendar, FlaskConical,
  TrendingUp, Users, LineChart as LineChartIcon, BarChart3, ArrowLeft,
} from "lucide-react";
import { EventCard } from "./components/EventCard";
import { SearchableSelect } from "./components/SearchableSelect";
import { ControlGroupSelector } from "./components/ControlGroupSelector";
import { FilterSection } from "./components/FilterSection";
import { KPIChip } from "./components/KPIChip";
import { CounterfactualChart } from "./components/CounterfactualChart";
import { MarketComparisonTable } from "./components/MarketComparisonTable";
import { ElasticityChart } from "./components/ElasticityChart";
import { Tooltip } from "./components/Tooltip";
import { ModelSelector } from "./components/ModelSelector";
import { PrismLogo } from "./components/PrismLogo";
import { DevPanel } from "./components/DevPanel";
import { ChatBox } from "./components/ChatBox";
import { useMode } from "./contexts/ModeContext";
import {
  MOCK_EVENTS,
  MOCK_MARKETS,
  MOCK_CONTROL_BUNDLES,
  MOCK_MODEL_DATA,
} from "@/data/mock";
import type { ModelType, ModelData } from "@/data/types";
import type { Tier, Category, ContentType } from "./components/FilterSection";

const DEFAULT_TIME_WINDOW = 12;
const DEFAULT_TIERS: Tier[] = ["Ad-lite", "Ad-free", "Ultimate Ad-free"];
const DEFAULT_CATEGORY: Category = "Both";
const DEFAULT_CONTENT_TYPE: ContentType = "Both";

const TABS = [
  { id: "counterfactual", label: "Counterfactual Pricing Analysis", icon: FlaskConical, active: true },
  { id: "elasticity", label: "Demand-Price Elasticity", icon: LineChartIcon, active: false },
  { id: "churn", label: "Subscriber Churn Analytics", icon: Users, active: false },
  { id: "market-insights", label: "Market Insights", icon: TrendingUp, active: false },
  { id: "promo-impact", label: "Promotional Impact Analysis", icon: BarChart3, active: false },
];

export default function App() {
  const { isDev, mode, toggleMode } = useMode();

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [treatmentMarket, setTreatmentMarket] = useState<string | null>(null);
  const [selectedControlGroup, setSelectedControlGroup] = useState<string | null>("europe-high-gdp");
  const [selectedModel, setSelectedModel] = useState<ModelType>("gross_adds");
  const [timeWindow, setTimeWindow] = useState(DEFAULT_TIME_WINDOW);
  const [tiers, setTiers] = useState<Tier[]>([...DEFAULT_TIERS]);
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [contentType, setContentType] = useState<ContentType>(DEFAULT_CONTENT_TYPE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [configChanged, setConfigChanged] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ModelData | null>(null);

  const selectedEventData = MOCK_EVENTS.find((e) => e.id === selectedEvent);
  const selectedBundle = MOCK_CONTROL_BUNDLES.find((b) => b.id === selectedControlGroup);
  const showSidebar = activeTab === "counterfactual";

  const hasDefaultFilters =
    timeWindow === DEFAULT_TIME_WINDOW &&
    tiers.length === DEFAULT_TIERS.length &&
    category === DEFAULT_CATEGORY &&
    contentType === DEFAULT_CONTENT_TYPE;

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setConfigChanged(false);
    setTimeout(() => {
      setAnalysisResult(MOCK_MODEL_DATA[selectedModel]);
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1500);
  };

  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model);
    if (hasAnalyzed) {
      setAnalysisResult(MOCK_MODEL_DATA[model]);
    }
    handleConfigChange();
  };

  const handleConfigChange = () => {
    setConfigChanged(true);
  };

  const handleResetFilters = () => {
    setTimeWindow(DEFAULT_TIME_WINDOW);
    setTiers([...DEFAULT_TIERS]);
    setCategory(DEFAULT_CATEGORY);
    setContentType(DEFAULT_CONTENT_TYPE);
    handleConfigChange();
  };

  const filterState = {
    selectedEvent,
    treatmentMarket,
    selectedControlGroup,
    timeWindow,
    tiers,
    category,
    contentType,
  };

  const modeToggle = (
    <div className="flex items-center gap-1 bg-white border border-[#E8E4F0] rounded-full p-1 shadow-sm">
      <button type="button" onClick={() => { if (mode !== "dev") toggleMode(); }}
        className={`px-3 py-1 text-xs rounded-full transition-all ${isDev ? "bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white shadow-sm" : "text-[#7B7694] hover:text-[#1E1B3A]"}`}>
        Dev
      </button>
      <button type="button" onClick={() => { if (mode !== "user") toggleMode(); }}
        className={`px-3 py-1 text-xs rounded-full transition-all ${!isDev ? "bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white shadow-sm" : "text-[#7B7694] hover:text-[#1E1B3A]"}`}>
        User
      </button>
    </div>
  );

  // ─── Home view ───
  if (!activeTab) {
    return (
      <div className="min-h-screen bg-[#FAFAFF] flex flex-col items-center justify-center p-8">
        <div className="fixed top-6 right-6 z-20">{modeToggle}</div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <PrismLogo size={36} />
            <h1 className="font-display text-4xl text-[#1E1B3A] tracking-tight">
              Good {getTimeOfDay()},
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] ml-2">
                Rohini
              </span>
            </h1>
          </div>

          <div className="mb-10">
            <ChatBox />
          </div>

          {/* Section divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8E4F0] to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B5B0C8] font-medium">Explore dashboards</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8E4F0] to-transparent" />
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-5 gap-3">
            {TABS.map((tab, i) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * i }}
                  onClick={() => { if (tab.active) setActiveTab(tab.id); }}
                  className={`group relative flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl border transition-all ${
                    tab.active
                      ? "border-[#E8E4F0] bg-white hover:border-[#9B51E0]/40 hover:shadow-lg hover:shadow-[#9B51E0]/8 cursor-pointer shadow-sm"
                      : "border-transparent bg-[#F5F3FA] cursor-default opacity-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    tab.active
                      ? "bg-[#F0EDF8] group-hover:bg-[#9B51E0]/15"
                      : "bg-[#EDEAF5]"
                  }`}>
                    <Icon className={`w-4 h-4 ${tab.active ? "text-[#9B51E0]" : "text-[#B5B0C8]"}`} />
                  </div>
                  <span className={`text-[11px] leading-tight text-center font-medium ${
                    tab.active ? "text-[#1E1B3A] group-hover:text-[#9B51E0]" : "text-[#B5B0C8]"
                  }`}>
                    {tab.label}
                  </span>
                  {!tab.active && (
                    <span className="absolute top-2 right-2 text-[8px] text-[#B5B0C8] font-mono">Soon</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Dummy tab placeholder ───
  if (activeTab !== "counterfactual") {
    return (
      <div className="min-h-screen bg-[#FAFAFF] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-6 w-16 h-16 mx-auto rounded-2xl bg-white border border-[#E8E4F0] flex items-center justify-center shadow-sm">
            <BarChart3 className="w-7 h-7 text-[#7B7694]" />
          </div>
          <h2 className="font-display text-2xl text-[#1E1B3A] mb-3">Coming Soon</h2>
          <p className="text-sm text-[#7B7694] mb-6">This dashboard is under development.</p>
          <button type="button" onClick={() => setActiveTab(null)}
            className="px-4 py-2 rounded-xl text-sm bg-white border border-[#E8E4F0] text-[#1E1B3A] hover:border-[#9B51E0] hover:shadow-sm transition-all">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ─── Counterfactual Pricing Analysis ───
  return (
    <div className="min-h-screen bg-[#FAFAFF] flex">
      {/* Left Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -340, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[340px] border-r border-[#E8E4F0] bg-[#F5F3FA] overflow-y-auto fixed left-0 top-0 bottom-0 z-10"
          >
            <div className="p-6 space-y-8">
              <div className="pb-6 border-b border-[#E8E4F0]">
                <button type="button" onClick={() => setActiveTab(null)}
                  className="flex items-center gap-2.5 group mb-2">
                  <ArrowLeft className="w-4 h-4 text-[#7B7694] group-hover:text-[#9B51E0] transition-colors" />
                  <PrismLogo size={24} />
                  <h1 className="font-display text-xl text-[#1E1B3A] tracking-tight group-hover:opacity-70 transition-opacity">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B51E0] to-[#7B68EE]">
                      Prism
                    </span>
                  </h1>
                </button>
                <p className="text-xs text-[#7B7694] pl-[26px]">Counterfactual Pricing Analysis</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm text-[#1E1B3A] font-medium">What event do you want to explore?</label>
                <div className="space-y-3">
                  {MOCK_EVENTS.map((event) => (
                    <EventCard key={event.id} event={event} isSelected={selectedEvent === event.id}
                      onClick={() => { setSelectedEvent(event.id); handleConfigChange(); }} />
                  ))}
                  <button type="button"
                    className="w-full p-4 text-left rounded-xl border-2 border-dashed border-[#E8E4F0] bg-white hover:border-[#9B51E0]/40 hover:bg-[#F0EDF8] transition-all flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shrink-0 group-hover:shadow-md group-hover:shadow-[#9B51E0]/20 transition-shadow">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-[#1E1B3A] group-hover:text-[#9B51E0] transition-colors">Analyze an upcoming event</span>
                  </button>
                  <button type="button"
                    className="w-full p-4 text-left rounded-xl border-2 border-dashed border-[#E8E4F0] bg-white hover:border-[#9B51E0]/40 hover:bg-[#F0EDF8] transition-all flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shrink-0 group-hover:shadow-md group-hover:shadow-[#9B51E0]/20 transition-shadow">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-[#1E1B3A] group-hover:text-[#9B51E0] transition-colors">Create a new event</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  <label className="block text-sm text-[#1E1B3A] font-medium">Where did the price change happen?</label>
                  <Tooltip content="The treatment market is where the pricing event occurred." />
                </div>
                <SearchableSelect options={MOCK_MARKETS} value={treatmentMarket}
                  onChange={(v) => { setTreatmentMarket(v); handleConfigChange(); }} placeholder="Select a market..." />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  <label className="block text-sm text-[#1E1B3A] font-medium">Compare against which markets?</label>
                  <Tooltip content="Control markets help us understand what would have happened without the change." />
                </div>
                <ControlGroupSelector bundles={MOCK_CONTROL_BUNDLES} selectedBundle={selectedControlGroup}
                  onBundleChange={(id) => { setSelectedControlGroup(id); handleConfigChange(); }} />
              </div>

              <FilterSection
                timeWindow={timeWindow} onTimeWindowChange={(v) => { setTimeWindow(v); handleConfigChange(); }}
                tiers={tiers} onTiersChange={(v) => { setTiers(v); handleConfigChange(); }}
                category={category} onCategoryChange={(v) => { setCategory(v); handleConfigChange(); }}
                contentType={contentType} onContentTypeChange={(v) => { setContentType(v); handleConfigChange(); }}
                selectedModel={selectedModel} onReset={handleResetFilters} hasChanges={!hasDefaultFilters}
              />
            </div>

            <div className="sticky bottom-0 p-6 bg-[#EDEAF5] border-t border-[#E8E4F0]">
              <button type="button" onClick={handleRunAnalysis}
                disabled={isAnalyzing || !treatmentMarket || !selectedControlGroup}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isAnalyzing || !treatmentMarket || !selectedControlGroup
                    ? "bg-[#E8E4F0] text-[#B5B0C8] cursor-not-allowed"
                    : configChanged
                    ? "bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white shadow-lg shadow-[#9B51E0]/30 animate-pulse"
                    : "bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white hover:shadow-lg hover:shadow-[#9B51E0]/30"
                }`}>
                {isAnalyzing ? (<><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</>) : "Run Analysis"}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Canvas */}
      <main className={`flex-1 p-8 transition-all duration-300 ${showSidebar ? "ml-[340px]" : ""}`}>
        <div className="flex justify-end mb-4">{modeToggle}</div>

        {!hasAnalyzed || !analysisResult ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
            <div className="text-center max-w-lg">
              <div className="mb-6 w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shadow-lg shadow-[#9B51E0]/20">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-display text-2xl text-[#1E1B3A] mb-3 tracking-tight">
                Get started
              </h2>
              <p className="text-sm text-[#7B7694] leading-relaxed max-w-sm mx-auto">
                Select a pricing event, choose your treatment market and control group from the panel on the left, then hit <strong className="text-[#9B51E0]">Run Analysis</strong> to generate results.
              </p>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="space-y-8 max-w-[1400px]">

            {/* Search bar + Export */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <ChatBox hidePrompts />
              </div>
              <button type="button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E4F0] text-[#1E1B3A] hover:border-[#9B51E0]/40 hover:shadow-sm transition-all group shrink-0">
                <Download className="w-4 h-4 text-[#9B51E0] group-hover:text-[#7B68EE]" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>

            <ModelSelector selectedModel={selectedModel} onChange={handleModelChange} />

            <div className="bg-gradient-to-br from-[#9B51E0]/8 to-[#7B68EE]/4 border border-[#E8E4F0] rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="font-display text-3xl text-[#1E1B3A] mb-2 tracking-tight">
                  {selectedEventData?.name ?? "Analysis Results"}
                </h2>
                <p className="text-sm font-mono text-[#7B7694]">{selectedEventData?.dateRange}</p>
              </div>
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#7B7694]">Treatment:</span>
                  <span className="text-[#1E1B3A] font-medium">{MOCK_MARKETS.find((m) => m.value === treatmentMarket)?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#7B7694]">Control Group:</span>
                  <span className="text-[#1E1B3A] font-medium">{selectedBundle?.name} ({selectedBundle?.markets.length} markets)</span>
                </div>
              </div>
              <div className="flex gap-4">
                <KPIChip {...analysisResult.kpis.primary} />
                <KPIChip {...analysisResult.kpis.secondary} />
                <KPIChip {...analysisResult.kpis.tertiary} />
              </div>
            </div>

            <CounterfactualChart data={analysisResult.chartData} eventStartWeek={5} />

            <div className="grid grid-cols-2 gap-8">
              <MarketComparisonTable markets={analysisResult.marketComparison} />
              <ElasticityChart data={analysisResult.elasticityData} />
            </div>

            {isDev && <DevPanel modelType={selectedModel} analysisResult={analysisResult} filterState={filterState} />}
          </motion.div>
        )}
      </main>
    </div>
  );
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
