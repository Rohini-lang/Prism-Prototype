import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

interface TooltipProps { content: string; }

export function Tooltip({ content }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button type="button" className="inline-flex items-center justify-center ml-1 text-[#B5B0C8] hover:text-[#9B51E0] transition-colors" aria-label="More information">
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content className="max-w-xs px-4 py-3 text-sm bg-white text-[#1E1B3A] rounded-xl shadow-lg z-50 border border-[#E8E4F0] leading-relaxed" sideOffset={5}>
            {content}
            <TooltipPrimitive.Arrow className="fill-white" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
