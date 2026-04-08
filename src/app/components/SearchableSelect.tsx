import { useState } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import type { Market } from "@/data/types";

interface SearchableSelectProps {
  options: Market[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Select..." }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button type="button"
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E8E4F0] rounded-xl hover:border-[#9B51E0]/30 transition-colors text-sm shadow-sm">
            <span className={selectedOption ? "text-[#1E1B3A]" : "text-[#B5B0C8]"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="w-4 h-4 text-[#7B7694]" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="w-[var(--radix-popover-trigger-width)] bg-white border border-[#E8E4F0] rounded-xl shadow-lg z-50 max-h-[300px] overflow-hidden" sideOffset={4}>
            <div className="p-3 border-b border-[#E8E4F0]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#B5B0C8]" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search markets..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFAFF] border border-[#E8E4F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B51E0] text-[#1E1B3A] placeholder:text-[#B5B0C8]" />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[240px]">
              {filteredOptions.map((option) => (
                <button key={option.value} type="button"
                  onClick={() => { onChange(option.value); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#F5F3FA] transition-colors text-left">
                  <span className="text-[#1E1B3A]">{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4 text-[#9B51E0]" />}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-[#7B7694]">No markets found</div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {selectedOption && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F3FA] border border-[#E8E4F0] rounded-lg text-sm w-fit">
          <span className="text-[#1E1B3A]">{selectedOption.label}</span>
          <button type="button" onClick={() => onChange(null)} className="ml-1 text-[#7B7694] hover:text-[#1E1B3A] p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
