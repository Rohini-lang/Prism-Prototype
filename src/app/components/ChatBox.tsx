import { useState, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTED_QUERIES = [
  "Show churn trends for Q4",
  "Compare US vs UK subscriber lift",
  "What drove the Black Friday spike?",
  "Summarize model confidence across regions",
  "Which control group best fits LATAM?",
];

interface ChatBoxProps {
  hidePrompts?: boolean;
  onSubmit?: (text: string) => void;
}

export function ChatBox({ hidePrompts = false, onSubmit }: ChatBoxProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setQuery("");
  };

  return (
    <div>
      {/* Input */}
      <div className="relative">
        <div className="flex items-center gap-3 bg-white border border-[#E0E0E0] rounded-2xl px-5 min-h-[56px] focus-within:border-[#C8C8C8] focus-within:shadow-lg focus-within:shadow-black/[0.06] transition-all">
          <Sparkles className="w-4 h-4 text-[#9B51E0] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(query); }}
            placeholder="Ask Prism anything — e.g. What drove churn in LATAM Q3?"
            className="flex-1 bg-transparent text-sm font-medium text-[#1E1B3A] placeholder:text-[#B5B0C8] placeholder:font-normal focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSubmit(query)}
            disabled={!query.trim()}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shrink-0 disabled:opacity-30 hover:shadow-md hover:shadow-[#9B51E0]/20 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Chips */}
      <AnimatePresence>
        {!hidePrompts && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-wrap justify-center gap-2 mt-3"
          >
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSubmit(q)}
                className="px-3.5 py-1.5 text-[13px] font-medium rounded-full border border-[#DDDDE0] bg-white text-[#6B6B6B] hover:bg-[#F4F4F5] transition-colors"
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
