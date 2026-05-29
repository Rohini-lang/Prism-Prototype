import { ArrowLeft } from "lucide-react";
import { PrismLogo } from "../PrismLogo";
import type { SandboxEvent } from "@/data/sandbox";

interface EventSidebarProps {
  events: SandboxEvent[];
  selectedId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function EventSidebar({ events, selectedId, onSelect, onBack }: EventSidebarProps) {
  return (
    <aside className="w-[280px] shrink-0 bg-[#0A0A0A] border-r border-[#1F1F1F] flex flex-col h-[calc(100vh-56px)] sticky top-[56px]">
      <div className="px-5 pt-5 pb-4 border-b border-[#1F1F1F]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 group mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#6F6A85] group-hover:text-[#B57AFF] transition-colors" />
          <PrismLogo size={20} />
          <span className="font-display text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#B57AFF] to-[#9B7BFF] group-hover:opacity-75 transition-opacity">
            Prism
          </span>
        </button>
        <p className="text-[11px] text-[#6F6A85] pl-[26px]">Counterfactual Pricing Analysis</p>
      </div>

      <div className="px-5 pt-4 pb-2">
        <p className="text-xs text-[#A39DB8] font-medium">What event do you want to explore?</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {events.map((event) => {
          const isSelected = event.id === selectedId;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event.id)}
              className={`w-full text-left p-3 rounded-lg transition-all border ${
                isSelected
                  ? "bg-[#1F1F1F] border-[#333333] shadow-[0_0_0_1px_rgba(181,122,255,0.2)]"
                  : "bg-[#141414] border-transparent hover:bg-[#1A1A1A] hover:border-[#262626]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[12px] font-semibold text-[#F2EFFF] leading-snug">{event.name}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#3A1A2E] text-[#F87171] border border-[#5A2540] shrink-0">
                  {event.typeLabel}
                </span>
              </div>
              <p className="text-[10px] text-[#6F6A85] font-mono">{event.dateRange}</p>
            </button>
          );
        })}
      </div>

      <div className="px-5 py-4 border-t border-[#1F1F1F] bg-[#0A0A0A]">
        <button
          type="button"
          disabled
          className="w-full py-2 rounded-lg text-xs font-medium text-[#6F6A85] bg-[#141414] border border-[#262626] cursor-not-allowed"
        >
          Results load automatically
        </button>
        <p className="text-[10px] text-[#6F6A85] text-center mt-2">Click any event card above to view results</p>
      </div>
    </aside>
  );
}
