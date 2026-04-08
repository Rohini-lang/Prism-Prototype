import { motion } from "motion/react";
import type { PricingEvent } from "@/data/types";

interface EventCardProps {
  event: PricingEvent;
  isSelected: boolean;
  onClick: () => void;
}

const typeColors: Record<string, string> = {
  surge: "bg-[#9B51E0] text-white",
  promo: "bg-[#E94560] text-white",
  structural: "bg-[#6C63FF] text-white",
};

export function EventCard({ event, isSelected, onClick }: EventCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
        isSelected
          ? "border-[#9B51E0] bg-white shadow-md shadow-[#9B51E0]/10"
          : "border-[#E8E4F0] bg-white hover:border-[#9B51E0]/30 hover:shadow-sm"
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display text-sm text-[#1E1B3A] leading-snug">{event.name}</h3>
        <span className={`px-2.5 py-1 text-xs rounded-full font-mono shrink-0 ${typeColors[event.type]}`}>
          {event.typeLabel}
        </span>
      </div>
      <p className="text-xs font-mono text-[#7B7694]">{event.dateRange}</p>
    </motion.button>
  );
}
