"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import { AGENT_CONFIGS, getAgentConfig } from "@/lib/agent-context";
import { matchDemoChatResponse, DEMO_GREETINGS } from "@/lib/fixtures";
import type { AgentType, ChatMessage, AgentConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Send, Bot } from "lucide-react";

// ── Markdown mínimo ──────────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-[#c9d1d9] font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-[#1a2332] text-[#58a6ff] px-1 rounded text-[10px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-1.5 items-start">
              <span className="text-[#6e7b8b] shrink-0 mt-px">·</span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-0.5" />;
        return <div key={i}>{renderInline(line)}</div>;
      })}
    </div>
  );
}

// ── Message bubble ───────────────────────────────────────────────
function MessageBubble({
  msg,
  agentConfig,
}: {
  msg: ChatMessage;
  agentConfig: AgentConfig;
}) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end fade-in">
        <div className="max-w-[88%] bg-[#1a2332] border border-[#1f3044] rounded px-2.5 py-2 text-[11px] text-[#c9d1d9] leading-relaxed font-mono">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start fade-in">
      <div className="max-w-[96%]">
        <div
          className="text-[8px] font-bold tracking-widest font-mono mb-1"
          style={{ color: agentConfig.color }}
        >
          {agentConfig.label}
        </div>
        <div className="text-[11px] text-[#c9d1d9] leading-relaxed font-mono">
          {renderMarkdown(msg.content)}
          {msg.isStreaming && (
            <span className="blink inline-block ml-0.5 text-[#6e7b8b]">▋</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export function AgentChat() {
  const { isDemo, projects } = useStore();
  const [activeAgent, setActiveAgent] = useState<AgentType>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup typewriter on unmount
  useEffect(() => {
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start typewriter for a message already in the list
  const startTypewriter = useCallback((msgId: string, fullText: string, onDone?: () => void) => {
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    let i = 0;
    typeTimerRef.current = setInterval(() => {
      i += 3; // 3 chars per tick — velocidad cómoda
      const slice = fullText.slice(0, i);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, content: slice, isStreaming: i < fullText.length }
            : m
        )
      );
      if (i >= fullText.length) {
        clearInterval(typeTimerRef.current!);
        typeTimerRef.current = null;
        setIsTyping(false);
        onDone?.();
      }
    }, 16);
  }, []);

  // Show greeting when agent changes
  useEffect(() => {
    if (typeTimerRef.current) {
      clearInterval(typeTimerRef.current);
      typeTimerRef.current = null;
    }

    const greetingText = DEMO_GREETINGS[activeAgent];
    const greetingMsg: ChatMessage = {
      id: `greeting-${activeAgent}-${Date.now()}`,
      role: "agent",
      agentType: activeAgent,
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages([greetingMsg]);
    setIsTyping(true);
    // small delay so the empty state renders first
    const delay = setTimeout(() => startTypewriter(greetingMsg.id, greetingText), 120);
    return () => clearTimeout(delay);
  }, [activeAgent, startTypewriter]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      agentType: activeAgent,
      content: text,
      timestamp: new Date(),
    };

    const agentMsgId = `agent-${Date.now() + 1}`;
    const placeholder: ChatMessage = {
      id: agentMsgId,
      role: "agent",
      agentType: activeAgent,
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, placeholder]);
    setIsTyping(true);

    if (isDemo) {
      // Demo: respuesta local, sin red
      await new Promise((r) => setTimeout(r, 350)); // simula latencia
      const responseText = matchDemoChatResponse(activeAgent, text);
      startTypewriter(agentMsgId, responseText);
    } else {
      // Real mode: llama a /api/chat
      try {
        const history = messages
          .filter((m) => !m.isStreaming)
          .concat(userMsg)
          .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            agentType: activeAgent,
            context: { projects },
          }),
        });

        if (!res.ok) throw new Error("API error");
        const data = (await res.json()) as { response: string };
        startTypewriter(agentMsgId, data.response);
      } catch {
        startTypewriter(agentMsgId, "Error de conexión. Activa MODO DEMO para usar respuestas de ejemplo.");
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    // Auto-expand textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 88)}px`;
  }

  const agentConfig = getAgentConfig(activeAgent);

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="p-3 border-b border-[#1a2332] shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Bot className="w-3.5 h-3.5" style={{ color: agentConfig.color }} />
            <span
              className="text-[10px] font-bold tracking-widest font-mono"
              style={{ color: agentConfig.color }}
            >
              {agentConfig.label}
            </span>
            <span className="flex items-center gap-1 text-[9px] text-[#39d353] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39d353] pulse-green inline-block" />
              ONLINE
            </span>
          </div>
          {isDemo && (
            <span className="text-[9px] font-mono text-[#f0c000] border border-[#f0c000]/30 bg-[#f0c000]/10 px-1.5 py-0.5 rounded">
              DEMO
            </span>
          )}
        </div>

        {/* Agent pills */}
        <div className="flex gap-1 flex-wrap">
          {AGENT_CONFIGS.map((cfg) => {
            const active = activeAgent === cfg.type;
            return (
              <button
                key={cfg.type}
                onClick={() => {
                  if (cfg.type !== activeAgent) setActiveAgent(cfg.type);
                }}
                title={cfg.description}
                className={cn(
                  "text-[8px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider transition-all border",
                  !active && "border-transparent bg-[#1a2332] text-[#6e7b8b] hover:text-[#c9d1d9] hover:bg-[#1f2d3d]"
                )}
                style={
                  active
                    ? {
                        color: cfg.color,
                        borderColor: `${cfg.color}55`,
                        backgroundColor: `${cfg.color}18`,
                      }
                    : {}
                }
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat history ── */}
      <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            agentConfig={getAgentConfig(msg.agentType)}
          />
        ))}

        {/* Typing indicator while waiting for first char */}
        {isTyping && messages[messages.length - 1]?.content === "" && (
          <div className="flex items-center gap-1.5 fade-in">
            <span className="text-[8px] font-mono font-bold" style={{ color: agentConfig.color }}>
              {agentConfig.label}
            </span>
            <span className="text-[#6e7b8b] text-[10px] font-mono">
              <span className="blink">▋</span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="border-t border-[#1a2332] p-2 shrink-0 bg-[#070b0f]">
        <div className="flex gap-1.5 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Pregunta al ${agentConfig.label}…`}
            disabled={isTyping}
            rows={1}
            className={cn(
              "flex-1 bg-[#0d1117] border border-[#1a2332] rounded px-2.5 py-1.5",
              "text-[11px] font-mono text-[#c9d1d9] placeholder-[#3a4452]",
              "resize-none focus:outline-none focus:border-[#1f3044] transition-colors leading-relaxed",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
            style={{ minHeight: "32px", maxHeight: "88px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            title="Enviar (Enter)"
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded border transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:brightness-125"
            style={{
              borderColor: `${agentConfig.color}55`,
              color: agentConfig.color,
              backgroundColor: `${agentConfig.color}18`,
            }}
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
        <div className="text-[8px] font-mono text-[#2a3340] mt-1 px-0.5">
          Enter envía · Shift+Enter nueva línea
        </div>
      </div>
    </div>
  );
}
