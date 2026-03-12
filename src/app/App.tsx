import { useState } from "react";
import { motion } from "motion/react";
import { Download, Loader2 } from "lucide-react";
import { EventCard } from "./components/EventCard";
import { SearchableSelect } from "./components/SearchableSelect";
import { ControlGroupSelector } from "./components/ControlGroupSelector";
import { FilterSection } from "./components/FilterSection";
import { KPIChip } from "./components/KPIChip";
import { CounterfactualChart } from "./components/CounterfactualChart";
import { MarketComparisonTable } from "./components/MarketComparisonTable";
import { ElasticityChart } from "./components/ElasticityChart";
import { Tooltip } from "./components/Tooltip";
import {
  MOCK_EVENTS,
  MOCK_MARKETS,
  MOCK_CONTROL_BUNDLES,
  MOCK_ANALYSIS_RESULT,
} from "@/data/mock";
import type { AnalysisResult } from "@/data/types";
import type { Tier, Category, ContentType } from "./components/FilterSection";
import type { Metric } from "./components/CounterfactualChart";

const DEFAULT_TIME_WINDOW = 12;
const DEFAULT_TIERS: Tier[] = ["Ad-lite", "Ad-free", "Ultimate Ad-free"];
const DEFAULT_CATEGORY: Category = "Both";
const DEFAULT_CONTENT_TYPE: ContentType = "Both";

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(MOCK_EVENTS[0].id);
  const [treatmentMarket, setTreatmentMarket] = useState<string | null>("chicago");
  const [controlBundle, setControlBundle] = useState<string | null>("midwest");
  const [timeWindow, setTimeWindow] = useState(DEFAULT_TIME_WINDOW);
  const [tiers, setTiers] = useState<Tier[]>([...DEFAULT_TIERS]);
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [contentType, setContentType] = useState<ContentType>(DEFAULT_CONTENT_TYPE);
  const [metric, setMetric] = useState<Metric>("price");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [configChanged, setConfigChanged] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const selectedEventData = MOCK_EVENTS.find((e) => e.id === selectedEvent);
  const selectedBundle = MOCK_CONTROL_BUNDLES.find((b) => b.id === controlBundle);

  const hasDefaultFilters =
    timeWindow === DEFAULT_TIME_WINDOW &&
    tiers.length === DEFAULT_TIERS.length &&
    category === DEFAULT_CATEGORY &&
    contentType === DEFAULT_CONTENT_TYPE;

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setConfigChanged(false);

    // TODO: Replace with real API call when data layer is ready.
    // The parameters you'd send: selectedEvent, treatmentMarket,
    // controlBundle, timeWindow, tiers, category, contentType, metric
    setTimeout(() => {
      setAnalysisResult(MOCK_ANALYSIS_RESULT);
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1500);
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

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E0DED8] z-50 px-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-[#1A1A1A]">Pricing Impact</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#6B6B6B]">
            Last updated: {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#1A1A1A] hover:text-[#2D7D78] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      <div className="pt-16 flex">
        <aside className="w-[280px] h-[calc(100vh-4rem)] sticky top-16 bg-white border-r border-[#E0DED8] overflow-y-auto">
          <div className="p-6 space-y-8">
            <div className="space-y-3">
              <label className="block text-sm text-[#1A1A1A]">
                What event do you want to explore?
              </label>
              <div className="space-y-2">
                {MOCK_EVENTS.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isSelected={selectedEvent === event.id}
                    onClick={() => {
                      setSelectedEvent(event.id);
                      handleConfigChange();
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <label className="block text-sm text-[#1A1A1A]">
                  Where did the price change happen?
                </label>
                <Tooltip content="The treatment market is where the pricing event occurred. This is the market we're analyzing." />
              </div>
              <SearchableSelect
                options={MOCK_MARKETS}
                value={treatmentMarket}
                onChange={(value) => {
                  setTreatmentMarket(value);
                  handleConfigChange();
                }}
                placeholder="Select a market..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <label className="block text-sm text-[#1A1A1A]">
                  Compare against which markets?
                </label>
                <Tooltip content="Control markets are similar markets that didn't experience the pricing event. They help us understand what would have happened without the change." />
              </div>
              <ControlGroupSelector
                bundles={MOCK_CONTROL_BUNDLES}
                selectedBundle={controlBundle}
                onBundleChange={(bundleId) => {
                  setControlBundle(bundleId);
                  handleConfigChange();
                }}
              />
            </div>

            <FilterSection
              timeWindow={timeWindow}
              onTimeWindowChange={(value) => {
                setTimeWindow(value);
                handleConfigChange();
              }}
              tiers={tiers}
              onTiersChange={(values) => {
                setTiers(values);
                handleConfigChange();
              }}
              category={category}
              onCategoryChange={(value) => {
                setCategory(value);
                handleConfigChange();
              }}
              contentType={contentType}
              onContentTypeChange={(value) => {
                setContentType(value);
                handleConfigChange();
              }}
              activeMetric={metric}
              onReset={handleResetFilters}
              hasChanges={!hasDefaultFilters}
            />
          </div>

          <div className="sticky bottom-0 p-6 bg-white border-t border-[#E0DED8]">
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !treatmentMarket || !controlBundle}
              className={`w-full py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
                isAnalyzing || !treatmentMarket || !controlBundle
                  ? "bg-[#C4C2BA] text-white cursor-not-allowed"
                  : configChanged
                  ? "bg-[#2D7D78] text-white shadow-lg animate-pulse"
                  : "bg-[#2D7D78] text-white hover:bg-[#266D69]"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Run Analysis"
              )}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {!hasAnalyzed || !analysisResult ? (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
              <div className="text-center max-w-md">
                <div className="mb-4 text-4xl">📊</div>
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">
                  Select an event to get started →
                </h2>
                <p className="text-sm text-[#6B6B6B]">
                  Configure your analysis using the controls on the left, then click
                  "Run Analysis" to see the results.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 max-w-[1400px]"
            >
              <div className="bg-gradient-to-br from-[#2D7D78]/5 to-[#8BA8A6]/5 border border-[#E0DED8] rounded-xl p-8">
                <div className="mb-6">
                  <h2 className="font-serif text-3xl text-[#1A1A1A] mb-2">
                    {selectedEventData?.name}
                  </h2>
                  <p className="text-sm font-mono text-[#6B6B6B]">
                    {selectedEventData?.dateRange}
                  </p>
                </div>
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B6B6B]">Treatment:</span>
                    <span className="text-[#1A1A1A]">
                      {MOCK_MARKETS.find((m) => m.value === treatmentMarket)?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B6B6B]">Control Group:</span>
                    <span className="text-[#1A1A1A]">
                      {selectedBundle?.name} ({selectedBundle?.markets.length} markets)
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  {analysisResult.kpis.map((kpi) => (
                    <KPIChip key={kpi.label} {...kpi} />
                  ))}
                </div>
              </div>

              <CounterfactualChart
                data={analysisResult.chartData}
                eventStartWeek={analysisResult.eventStartWeek}
                metric={metric}
                onMetricChange={setMetric}
              />

              <div className="grid grid-cols-2 gap-8">
                <MarketComparisonTable markets={analysisResult.marketComparison} />
                <ElasticityChart data={analysisResult.elasticityData} />
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
