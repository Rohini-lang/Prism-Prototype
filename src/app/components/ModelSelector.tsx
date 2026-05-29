import { Users, UserMinus, ToggleLeft } from "lucide-react";
import type { ModelType } from "@/data/types";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onChange: (model: ModelType) => void;
}

const models = [
  { id: "gross_adds" as const, label: "Gross Additions", icon: Users },
  { id: "churn" as const, label: "Churn", icon: UserMinus },
  { id: "auto_renewal" as const, label: "Auto-Renewal Off", icon: ToggleLeft },
];

export function ModelSelector({ selectedModel, onChange }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-[#F0EDF8] p-1 rounded-xl border border-[#E8E4F0]">
      {models.map((model) => {
        const Icon = model.icon;
        const isSelected = selectedModel === model.id;
        return (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange(model.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? "bg-white text-[#1E1B3A] shadow-sm border border-[#E8E4F0]"
                : "text-[#7B7694] hover:text-[#1E1B3A]"
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#9B51E0]" : "text-[#B5B0C8]"}`}
            />
            {model.label}
          </button>
        );
      })}
    </div>
  );
}
