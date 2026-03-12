import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

interface TooltipProps {
  content: string;
}

export function Tooltip({ content }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="More information"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="max-w-xs px-3 py-2 text-sm bg-foreground text-background rounded-md shadow-lg z-50"
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-foreground" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
