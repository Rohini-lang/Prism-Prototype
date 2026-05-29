import type { EnsembleRow, EnsembleVerdict, EnsembleRole } from "@/data/sandbox";

interface ControlEnsembleTableProps {
  rows: EnsembleRow[];
}

const VERDICT_LABEL: Record<EnsembleVerdict, string> = {
  credible:    "Credible",
  provisional: "Provisionally credible",
  rejected:    "Rejected",
};

const VERDICT_PILL: Record<EnsembleVerdict, string> = {
  credible:    "bg-[#0F2A22] text-[#34D399] border-[#1E5944]",
  provisional: "bg-[#0F2A22] text-[#34D399] border-[#1E5944]",
  rejected:    "bg-[#2A1216] text-[#F87171] border-[#592024]",
};

const ROLE_LABEL: Record<EnsembleRole, string> = {
  in_pool:    "In pool",
  borderline: "Borderline",
  excluded:   "Excluded",
};

const ROLE_PILL: Record<EnsembleRole, string> = {
  in_pool:    "text-[#A39DB8] bg-[#1F1F1F] border-[#262626]",
  borderline: "text-[#FBBF24] bg-[#2A1F0F] border-[#594B1E]",
  excluded:   "text-[#6F6A85] bg-[#141414] border-[#262626]",
};

function fmtLift(v: number): string {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}${Math.abs(v).toFixed(1)}%`;
}

function liftColor(v: number): string {
  if (Math.abs(v) < 0.1) return "text-[#A39DB8]";
  return v < 0 ? "text-[#F87171]" : "text-[#34D399]";
}

export function ControlEnsembleTable({ rows }: ControlEnsembleTableProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[#F2EFFF]">Pooled ensemble of control candidates</h3>

      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F6A85]">Candidate</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F6A85]">Verdict</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F6A85]">Role</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F6A85] text-right">Lift %</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F6A85] text-right">β</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F6A85] text-right">SE(β)</th>
                <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#6F6A85] text-right">N obs</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.candidate}
                  className={`border-b border-[#1F1F1F] last:border-b-0 hover:bg-[#1A1A1A] transition-colors ${
                    i % 2 === 1 ? "bg-[#0D0D0D]/40" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#F2EFFF]">
                        {row.candidate} <span className="text-[#6F6A85] font-normal">({row.region})</span>
                      </span>
                      <span className="text-[10px] text-[#6F6A85] font-mono mt-0.5">{row.identifier}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${VERDICT_PILL[row.verdict]}`}>
                      {VERDICT_LABEL[row.verdict]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${ROLE_PILL[row.role]}`}>
                      {ROLE_LABEL[row.role]}
                    </span>
                  </td>
                  <td className={`px-5 py-3 text-right font-mono text-xs ${liftColor(row.liftPct)}`}>
                    {fmtLift(row.liftPct)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-[#A39DB8]">
                    {row.beta.toFixed(4)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-[#A39DB8]">
                    {row.standardError.toFixed(4)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-[#A39DB8]">
                    {row.observations}
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
