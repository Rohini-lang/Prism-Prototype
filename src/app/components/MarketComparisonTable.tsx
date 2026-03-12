import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { MarketComparison } from "@/data/types";

interface MarketComparisonTableProps {
  markets: MarketComparison[];
}

type SortKey = keyof MarketComparison;
type SortDirection = "asc" | "desc";

export function MarketComparisonTable({ markets }: MarketComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("similarity");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedMarkets = [...markets].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (typeof aVal === "string") {
      return aVal.localeCompare(bVal as string) * modifier;
    }
    return ((aVal as number) - (bVal as number)) * modifier;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-[#C4C2BA]" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#2D7D78]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#2D7D78]" />
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm text-[#1A1A1A]">Market Comparison</h3>
      <div className="bg-white border border-[#E0DED8] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E0DED8] bg-[#F8F7F4]">
                {[
                  { key: "name" as SortKey, label: "Market", align: "text-left" },
                  { key: "actual" as SortKey, label: "Actual", align: "text-right" },
                  { key: "counterfactual" as SortKey, label: "Counterfactual", align: "text-right" },
                  { key: "delta" as SortKey, label: "Delta (%)", align: "text-right" },
                  { key: "similarity" as SortKey, label: "Similarity Score", align: "text-left" },
                ].map((col) => (
                  <th key={col.key} className={`px-4 py-3 ${col.align}`}>
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className={`flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors ${
                        col.align === "text-right" ? "ml-auto" : ""
                      }`}
                    >
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedMarkets.map((market, index) => (
                <tr
                  key={market.name}
                  className={`border-b border-[#E0DED8] last:border-b-0 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F8F7F4]/30"
                  }`}
                  style={{
                    borderLeft: `3px solid ${market.delta > 0 ? "#2D7D78" : "#C95D63"}`,
                  }}
                >
                  <td className="px-4 py-3 text-xs text-[#1A1A1A]">{market.name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#1A1A1A] text-right">
                    ${market.actual.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-[#1A1A1A] text-right">
                    ${market.counterfactual.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-right">
                    <span className={market.delta > 0 ? "text-[#2D7D78]" : "text-[#C95D63]"}>
                      {market.delta > 0 ? "+" : ""}{market.delta.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-32 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#E0DED8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2D7D78] rounded-full transition-all"
                          style={{ width: `${market.similarity}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[#6B6B6B] w-10 text-right">
                        {market.similarity}%
                      </span>
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
