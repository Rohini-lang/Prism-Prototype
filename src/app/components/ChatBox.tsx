import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTED_QUERIES = [
  "Show churn trends for Q4",
  "Compare US vs UK subscriber lift",
  "What drove the Black Friday spike?",
  "Summarize model confidence across regions",
  "Which control group best fits LATAM?",
];

const MOCK_RESPONSES: Record<string, string> = {
  "Show churn trends for Q4":
    "Churn rates decreased by 31.6% in the treatment market during Q4, with the strongest reduction seen in weeks 5-8 post-event. The counterfactual baseline projected a steady increase to 2,750, but actual churn held at 1,880.",
  "Compare US vs UK subscriber lift":
    "The US market showed a +16.1% subscriber lift (5,400 vs 4,650 counterfactual), while the UK saw +10.9% (5,100 vs 4,600). The US outperformed by 5.2 percentage points, likely due to higher promotional visibility.",
  "What drove the Black Friday spike?":
    "The primary driver was a 18.2% subscriber lift in gross additions, concentrated in the first 3 weeks post-event. Ad-lite tier saw the highest conversion rate, with DTC retail channels contributing 62% of new sign-ups.",
  "Summarize model confidence across regions":
    "Model confidence is strong across all regions: Gross Adds at 97%, Churn at 94%, and Auto-Renewal Off at 96%. The English-Speaking Markets control group consistently produces the tightest confidence intervals.",
  "Which control group best fits LATAM?":
    "The Latin America Cluster (8 markets) provides the highest similarity scores for LATAM events, with an average of 89%. The Emerging Markets group is a secondary option at 82% similarity.",
  "Forecast gross adds for next quarter":
    "Based on current trends and the Black Friday promotional effect, projected gross adds for Q1 2026 range from 4,800-5,200 (with 95% confidence). This assumes similar promotional intensity and no major pricing changes.",
};

interface ChatBoxProps {
  hidePrompts?: boolean;
}

export function ChatBox({ hidePrompts = false }: ChatBoxProps) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setConversation((prev) => [...prev, { role: "user", text: userMsg }]);
    setQuery("");
    setIsTyping(true);

    const response =
      MOCK_RESPONSES[userMsg] ??
      `Based on the current analysis data, here's what I found regarding "${userMsg}": The treatment market shows significant deviation from the counterfactual baseline, with a 95% confidence interval. I'd recommend drilling into the market comparison table for more granular insights.`;

    setTimeout(() => {
      setIsTyping(false);
      setConversation((prev) => [...prev, { role: "assistant", text: response }]);
    }, 1200);
  };

  const hasMessages = conversation.length > 0;

  return (
    <div className={`${hasMessages ? "mt-8" : "mt-0"}`}>
      {hasMessages && (
        <div className="mb-4 space-y-3 max-h-[300px] overflow-y-auto rounded-2xl bg-white border border-[#E8E4F0] p-4 shadow-sm">
          {conversation.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white"
                    : "bg-[#F5F3FA] border border-[#E8E4F0] text-[#1E1B3A] border-l-2 border-l-[#9B51E0]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-xl bg-[#F5F3FA] border border-[#E8E4F0] flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-[#9B51E0] animate-spin" />
                <span className="text-xs text-[#7B7694]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={conversationEndRef} />
        </div>
      )}

      {/* Input — 56px min height, updated placeholder & border */}
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
            disabled={!query.trim() || isTyping}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shrink-0 disabled:opacity-30 hover:shadow-md hover:shadow-[#9B51E0]/20 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Chips — 12px below the input, no label */}
      <AnimatePresence>
        {!hasMessages && !hidePrompts && (
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
