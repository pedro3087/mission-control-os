"use client";
import { useState } from "react";
import { Bot, X, ChevronDown, Sparkles } from "lucide-react";
import { AgentChat } from "@/components/AgentChat";
import { cn } from "@/lib/utils";

export function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 w-[350px] h-[530px] bg-[#070b0f] border border-[#bc8cff]/30 rounded-xl flex flex-col overflow-hidden fade-in"
          style={{
            boxShadow:
              "0 0 0 1px rgba(188,140,255,0.1), 0 0 40px rgba(188,140,255,0.15), 0 16px 48px rgba(0,0,0,0.7)",
          }}
        >
          {/* Titlebar */}
          <div className="h-9 bg-[#0d1117] border-b border-[#bc8cff]/20 flex items-center px-3 gap-2 shrink-0">
            <Bot className="w-3.5 h-3.5 text-[#bc8cff]" />
            <span className="text-[10px] font-bold tracking-widest font-mono text-[#bc8cff]">
              AGENTE · CHAT
            </span>
            <span className="flex items-center gap-1 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39d353] pulse-green inline-block" />
              <span className="text-[8px] font-mono text-[#39d353]">ONLINE</span>
            </span>
            <div className="flex-1" />
            <button
              onClick={() => setOpen(false)}
              className="text-[#6e7b8b] hover:text-[#c9d1d9] transition-colors p-0.5"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <AgentChat />
          </div>
        </div>
      )}

      {/* ── Floating pill button ── */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {/* Ripple ring — solo cuando está cerrado */}
        {!open && (
          <span
            className="absolute right-0 bottom-0 w-14 h-14 rounded-full border border-[#bc8cff]/40 ring-expand"
            style={{ pointerEvents: "none" }}
          />
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "relative flex items-center gap-2 pl-3 pr-4 h-12 rounded-full font-mono font-bold text-[11px] tracking-wider",
            "border transition-all duration-300",
            open
              ? "border-[#bc8cff]/50 bg-[#1a0f2e] text-[#bc8cff]"
              : "border-[#bc8cff]/60 bg-[#12082a] text-[#bc8cff] glow-pulse-purple"
          )}
          style={
            open
              ? { boxShadow: "0 0 16px rgba(188,140,255,0.25)" }
              : undefined
          }
        >
          {open ? (
            <>
              <X className="w-4 h-4 shrink-0" />
              CERRAR
            </>
          ) : (
            <>
              <Bot className="w-4 h-4 shrink-0" />
              AGENTES
              <Sparkles className="w-3 h-3 opacity-70" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
