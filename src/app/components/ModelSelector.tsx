import { Users, UserMinus, ToggleLeft } from "lucide-react";
import type { ModelType } from "@/data/types";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onChange: (model: ModelType) => void;
}

const models = [
  { id: "gross_adds" as const, name: "Gross Additions", description: "New subscriber acquisitions", icon: Users, color: "#9B51E0" },
  { id: "churn" as const, name: "Churn Prediction", description: "Subscriber cancellations", icon: UserMinus, color: "#E94560" },
  { id: "auto_renewal" as const, name: "Auto-Renewal Off", description: "Users turning off auto-renewal", icon: ToggleLeft, color: "#F59E0B" },
];

export function ModelSelector({ selectedModel, onChange }: ModelSelectorProps) {
  return (
    <div className="bg-white border border-[#E8E4F0] rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm text-[#1E1B3A] font-medium mb-4">Select Model Type</h3>
      <div className="grid grid-cols-3 gap-4">
        {models.map((model) => {
          const Icon = model.icon;
          const isSelected = selectedModel === model.id;
          return (
            <button key={model.id} type="button" onClick={() => onChange(model.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-[#9B51E0] bg-[#F5F0FF] shadow-md shadow-[#9B51E0]/10"
                  : "border-[#E8E4F0] bg-white hover:border-[#9B51E0]/30 hover:shadow-sm"
              }`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isSelected ? `${model.color}15` : "#F0EDF8" }}>
                  <Icon className="w-5 h-5" style={{ color: isSelected ? model.color : "#7B7694" }} />
                </div>
              </div>
              <h4 className="text-sm text-[#1E1B3A] font-medium mb-1">{model.name}</h4>
              <p className="text-xs text-[#7B7694] leading-relaxed">{model.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
