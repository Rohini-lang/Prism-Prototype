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

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-[#E0DED8] rounded-md hover:border-[#C4C2BA] transition-colors text-sm"
          >
            <span className={selectedOption ? "text-[#1A1A1A]" : "text-[#6B6B6B]"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="w-4 h-4 text-[#6B6B6B]" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-[var(--radix-popover-trigger-width)] bg-white border border-[#E0DED8] rounded-md shadow-lg z-50 max-h-[300px] overflow-hidden"
            sideOffset={4}
          >
            <div className="p-2 border-b border-[#E0DED8]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#6B6B6B]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search markets..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#F8F7F4] border border-[#E0DED8] rounded focus:outline-none focus:ring-2 focus:ring-[#2D7D78]"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[240px]">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-[#F8F7F4] transition-colors text-left"
                >
                  <span className="text-[#1A1A1A]">{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-[#2D7D78]" />
                  )}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-[#6B6B6B]">
                  No markets found
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {selectedOption && (
        <div className="flex items-center gap-2 px-2 py-1.5 bg-[#F8F7F4] rounded-md text-sm w-fit">
          <span className="text-[#1A1A1A]">{selectedOption.label}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-1 text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
