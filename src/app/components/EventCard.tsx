import { motion } from "motion/react";
import type { PricingEvent } from "@/data/types";

interface EventCardProps {
  event: PricingEvent;
  isSelected: boolean;
  onClick: () => void;
}

const typeColors: Record<string, string> = {
  surge: "bg-[#2D7D78] text-white",
  promo: "bg-[#C95D63] text-white",
  structural: "bg-[#6B6B6B] text-white",
};

export function EventCard({ event, isSelected, onClick }: EventCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
        isSelected
          ? "border-[#2D7D78] bg-white shadow-sm"
          : "border-[#E0DED8] bg-white hover:border-[#C4C2BA] hover:shadow-sm"
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-serif text-base text-[#1A1A1A]">{event.name}</h3>
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-mono shrink-0 ${
            typeColors[event.type]
          }`}
        >
          {event.typeLabel}
        </span>
      </div>
      <p className="text-sm font-mono text-[#6B6B6B]">{event.dateRange}</p>
    </motion.button>
  );
}
