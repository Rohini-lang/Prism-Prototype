import { useState } from "react";
import { ChevronDown, ChevronRight, Code2, Database, Bug } from "lucide-react";
import type { ModelData, ModelType } from "@/data/types";

interface DevPanelProps { modelType: ModelType; analysisResult: ModelData | null; filterState: Record<string, unknown>; }
interface SectionProps { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; }

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#E8E4F0] rounded-xl overflow-hidden shadow-sm">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[#FAFAFF] hover:bg-[#F0EDF8] transition-colors text-left">
        {open ? <ChevronDown className="w-4 h-4 text-[#9B51E0]" /> : <ChevronRight className="w-4 h-4 text-[#7B7694]" />}
        <span className="text-[#9B51E0]">{icon}</span>
        <span className="text-sm text-[#1E1B3A] font-medium">{title}</span>
      </button>
      {open && <div className="p-4 bg-white border-t border-[#E8E4F0] overflow-x-auto">{children}</div>}
    </div>
  );
}

export function DevPanel({ modelType, analysisResult, filterState }: DevPanelProps) {
  const dataPointCount = analysisResult?.chartData.length ?? 0;
  const marketCount = analysisResult?.marketComparison.length ?? 0;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-[#9B51E0] animate-pulse" />
        <span className="text-xs font-mono text-[#9B51E0] uppercase tracking-wider">Dev Tools</span>
      </div>

      <Section title="Model Configuration" icon={<Code2 className="w-4 h-4" />} defaultOpen>
        <pre className="text-xs font-mono text-[#7B7694] leading-relaxed whitespace-pre-wrap">
          {JSON.stringify({ modelType, ...filterState }, null, 2)}
        </pre>
      </Section>

      <Section title="Raw Data Preview" icon={<Database className="w-4 h-4" />}>
        {analysisResult ? (
          <div className="space-y-3">
            <p className="text-xs text-[#7B7694] font-mono mb-2">chartData ({dataPointCount} points) — first 5 rows:</p>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-[#7B7694] border-b border-[#E8E4F0]">
                  <th className="text-left py-1 pr-4">week</th><th className="text-right py-1 pr-4">actual</th>
                  <th className="text-right py-1 pr-4">counterfactual</th><th className="text-right py-1">delta</th>
                </tr>
              </thead>
              <tbody>
                {analysisResult.chartData.slice(0, 5).map((d) => (
                  <tr key={d.week} className="text-[#1E1B3A] border-b border-[#E8E4F0]/50">
                    <td className="py-1 pr-4">{d.week}</td>
                    <td className="text-right py-1 pr-4">{d.actual}</td>
                    <td className="text-right py-1 pr-4">{d.counterfactual}</td>
                    <td className="text-right py-1">
                      <span className={d.actual - d.counterfactual > 0 ? "text-[#10B981]" : "text-[#E94560]"}>
                        {((d.actual - d.counterfactual) / d.counterfactual * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#7B7694]">No analysis data available. Run an analysis first.</p>
        )}
      </Section>

      <Section title="Debug Info" icon={<Bug className="w-4 h-4" />}>
        <div className="space-y-2 text-xs font-mono">
          {[
            ["Active Model", modelType], ["Chart Data Points", String(dataPointCount)],
            ["Market Comparisons", String(marketCount)], ["Elasticity Points", String(analysisResult?.elasticityData.length ?? 0)],
            ["Render Timestamp", new Date().toISOString()], ["React Mode", "Development"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#7B7694]">{label}</span>
              <span className="text-[#1E1B3A]">{value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
