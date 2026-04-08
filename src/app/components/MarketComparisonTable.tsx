import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { MarketComparison } from "@/data/types";

interface MarketComparisonTableProps { markets: MarketComparison[]; }
type SortKey = keyof MarketComparison;
type SortDirection = "asc" | "desc";

export function MarketComparisonTable({ markets }: MarketComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("similarity");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDirection("desc"); }
  };

  const sortedMarkets = [...markets].sort((a, b) => {
    const aVal = a[sortKey]; const bVal = b[sortKey];
    const mod = sortDirection === "asc" ? 1 : -1;
    if (typeof aVal === "string") return aVal.localeCompare(bVal as string) * mod;
    return ((aVal as number) - (bVal as number)) * mod;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="w-3.5 h-3.5 text-[#DDD8ED]" />;
    return sortDirection === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-[#9B51E0]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#9B51E0]" />;
  };

  const formatNum = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(2);

  return (
    <div className="space-y-3">
      <h3 className="text-sm text-[#1E1B3A] font-display">Market Comparison</h3>
      <div className="bg-white border border-[#E8E4F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E4F0] bg-[#FAFAFF]">
                {[
                  { key: "name" as SortKey, label: "Market", align: "text-left" },
                  { key: "actual" as SortKey, label: "Actual", align: "text-right" },
                  { key: "counterfactual" as SortKey, label: "Counterfactual", align: "text-right" },
                  { key: "delta" as SortKey, label: "Delta (%)", align: "text-right" },
                  { key: "similarity" as SortKey, label: "Similarity Score", align: "text-left" },
                ].map((col) => (
                  <th key={col.key} className={`px-4 py-3 ${col.align}`}>
                    <button type="button" onClick={() => handleSort(col.key)}
                      className={`flex items-center gap-1.5 text-xs text-[#7B7694] hover:text-[#1E1B3A] transition-colors ${col.align === "text-right" ? "ml-auto" : ""}`}>
                      {col.label}<SortIcon columnKey={col.key} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedMarkets.map((market, index) => (
                <tr key={market.name}
                  className={`border-b border-[#E8E4F0] last:border-b-0 ${index % 2 === 0 ? "bg-white" : "bg-[#FAFAFF]"}`}
                  style={{ borderLeft: `3px solid ${market.delta > 0 ? "#10B981" : "#E94560"}` }}>
                  <td className="px-4 py-3 text-xs text-[#1E1B3A]">{market.name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#1E1B3A] text-right">{formatNum(market.actual)}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#1E1B3A] text-right">{formatNum(market.counterfactual)}</td>
                  <td className="px-4 py-3 text-xs font-mono text-right">
                    <span className={market.delta > 0 ? "text-[#10B981]" : "text-[#E94560]"}>
                      {market.delta > 0 ? "+" : ""}{market.delta.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-32 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#E8E4F0] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] rounded-full transition-all" style={{ width: `${market.similarity}%` }} />
                      </div>
                      <span className="text-xs font-mono text-[#7B7694] w-10 text-right">{market.similarity}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
