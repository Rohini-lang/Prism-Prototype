import { CheckCircle2, AlertTriangle } from "lucide-react";

interface QualityChecksAlertProps {
  passed: boolean;
  summary: string;
}

export function QualityChecksAlert({ passed, summary }: QualityChecksAlertProps) {
  const Icon = passed ? CheckCircle2 : AlertTriangle;
  const title = passed ? "Quality checks passed" : "Quality checks failed";

  // Subtle tinted callout — green for pass, amber for fail.
  const containerCls = passed
    ? "bg-[#0F2A22] border-[#1E5944]"
    : "bg-[#2A1F0F] border-[#594B1E]";
  const iconCls = passed ? "text-[#34D399]" : "text-[#FBBF24]";
  const titleCls = passed ? "text-[#34D399]" : "text-[#FBBF24]";

  return (
    <div className={`rounded-xl border ${containerCls} px-5 py-4 flex items-start gap-3`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconCls}`} />
      <div className="min-w-0">
        <p className={`text-sm font-semibold mb-0.5 ${titleCls}`}>{title}</p>
        <p className="text-[12px] text-[#A39DB8] leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
