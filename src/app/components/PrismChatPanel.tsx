import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Send, Loader2, MessageSquare } from "lucide-react";
import { PrismLogo } from "./PrismLogo";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface PrismChatPanelProps {
  open: boolean;
  onClose: () => void;
  conversation: ChatMessage[];
  isTyping: boolean;
  onSubmit: (text: string) => void;
}

export function PrismChatPanel({
  open,
  onClose,
  conversation,
  isTyping,
  onSubmit,
}: PrismChatPanelProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isTyping]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    onSubmit(input.trim());
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 400, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 32, stiffness: 280 }}
          className="shrink-0 sticky top-0 h-screen overflow-hidden bg-white border-l border-[#E8E4F0] shadow-2xl shadow-[#9B51E0]/10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8E4F0] bg-white shrink-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <PrismLogo size={22} />
              <span className="font-display text-base tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B51E0] to-[#7B68EE]">
                  Prism
                </span>
              </span>
              <span className="text-xs text-[#B5B0C8] truncate">· Analytics assistant</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7B7694] hover:text-[#1E1B3A] hover:bg-[#F5F3FA] transition-all shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {conversation.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9B51E0] to-[#7B68EE] flex items-center justify-center mb-4 shadow-lg shadow-[#9B51E0]/20">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-[#1E1B3A] mb-1">Ask Prism anything</p>
                <p className="text-xs text-[#7B7694] leading-relaxed max-w-[240px]">
                  Answers are grounded in the current analysis context and data on screen.
                </p>
              </div>
            )}

            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shrink-0 mt-1 mr-2 shadow-sm">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] text-white rounded-br-sm"
                      : "bg-[#F5F3FA] border border-[#E8E4F0] border-l-[3px] border-l-[#9B51E0] text-[#1E1B3A] rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shrink-0 mt-1 mr-2 shadow-sm">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[#F5F3FA] border border-[#E8E4F0] border-l-[3px] border-l-[#9B51E0] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-[#9B51E0] animate-spin" />
                  <span className="text-xs text-[#7B7694]">Thinking…</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-5 py-4 border-t border-[#E8E4F0] bg-[#FAFAFF]">
            <div className="flex items-center gap-3 bg-white border border-[#E8E4F0] rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#9B51E0] focus-within:shadow-md focus-within:shadow-[#9B51E0]/10 transition-all">
              <Sparkles className="w-4 h-4 text-[#9B51E0] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask a follow-up…"
                className="flex-1 bg-transparent text-sm text-[#1E1B3A] placeholder:text-[#B5B0C8] focus:outline-none min-w-0"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#9B51E0] to-[#7B68EE] flex items-center justify-center shrink-0 disabled:opacity-30 hover:shadow-md hover:shadow-[#9B51E0]/20 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
