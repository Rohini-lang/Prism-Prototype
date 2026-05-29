import { useState } from "react";
import { motion } from "motion/react";
import { TopNavTabs } from "../components/sandbox/TopNavTabs";
import { EventSidebar } from "../components/sandbox/EventSidebar";
import { StatCard } from "../components/sandbox/StatCard";
import { QualityChecksAlert } from "../components/sandbox/QualityChecksAlert";
import { DailyCounterfactualChart } from "../components/sandbox/DailyCounterfactualChart";
import { ControlEnsembleTable } from "../components/sandbox/ControlEnsembleTable";
import { SANDBOX_EVENTS, ARGENTINA_SCENARIO } from "@/data/sandbox";

interface CounterfactualSandboxProps {
  onExit: () => void;
}

export function CounterfactualSandbox({ onExit }: CounterfactualSandboxProps) {
  const [selectedEventId, setSelectedEventId] = useState(ARGENTINA_SCENARIO.id);

  // For the sandbox we only have one fully-baked scenario; everything else
  // shows the Argentina view as a stand-in. This keeps the sandbox visually
  // complete without forcing us to mock 10 separate datasets.
  const scenario = ARGENTINA_SCENARIO;

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2EFFF]">
      <TopNavTabs />

      <div className="flex">
        <EventSidebar
          events={SANDBOX_EVENTS}
          selectedId={selectedEventId}
          onSelect={setSelectedEventId}
          onBack={onExit}
        />

        <main className="flex-1 min-w-0 px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-[1120px] space-y-6"
          >
            {/* Event header */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <h1 className="font-display text-[28px] tracking-tight text-[#F2EFFF] mb-1.5">
                {scenario.name}
              </h1>
              <p className="text-xs font-mono text-[#A39DB8] mb-4">{scenario.dateRange}</p>

              <div className="flex items-center gap-6 mb-5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#6F6A85]">Treatment:</span>
                  <span className="text-[#F2EFFF] font-semibold">{scenario.treatmentMarket}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6F6A85]">Control Group:</span>
                  <span className="text-[#F2EFFF] font-semibold font-mono">{scenario.controlGroupLabel}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {scenario.kpis.map((kpi) => (
                  <StatCard key={kpi.label} kpi={kpi} />
                ))}
              </div>
            </div>

            <QualityChecksAlert passed={scenario.qualityPassed} summary={scenario.qualitySummary} />

            <DailyCounterfactualChart data={scenario.chart} eventStartDate={scenario.eventStartDate} />

            <ControlEnsembleTable rows={scenario.ensemble} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
