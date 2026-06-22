"use client";
import { useState } from "react";
import { DEMO_AGENT_FULL_CONFIGS } from "@/lib/fixtures";
import type { AgentFullConfig, AgentTool, AgentAction, AgentSkillRef, TaskAgent } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Shield, Brain, TrendingUp, BarChart3, Scale,
  Wrench, Zap, BookOpen, Database, Cpu,
  ToggleLeft, ToggleRight, AlertTriangle, ChevronDown, ChevronRight,
} from "lucide-react";

// ── Agent sidebar meta ───────────────────────────────────────────
const AGENT_ICONS: Record<TaskAgent, { Icon: React.ElementType; color: string }> = {
  guardian:    { Icon: Shield,    color: "#f85149" },
  brain:       { Icon: Brain,     color: "#bc8cff" },
  acquisition: { Icon: TrendingUp, color: "#39d353" },
  portfolio:   { Icon: BarChart3,  color: "#58a6ff" },
  compliance:  { Icon: Scale,      color: "#f0c000" },
};

const TOOL_CATEGORY_COLOR: Record<AgentTool["category"], string> = {
  read:     "#58a6ff",
  write:    "#bc8cff",
  external: "#39d353",
  ai:       "#f0c000",
};

// ── Toggle ───────────────────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="shrink-0 transition-colors"
      style={{ color: enabled ? "#39d353" : "#3a4452" }}
    >
      {enabled
        ? <ToggleRight className="w-5 h-5" />
        : <ToggleLeft  className="w-5 h-5" />
      }
    </button>
  );
}

// ── Section wrapper ──────────────────────────────────────────────
function Section({
  icon: Icon, title, color, children,
}: {
  icon: React.ElementType; title: string; color: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-[#1a2332] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-[#0d1117] hover:bg-[#111820] transition-colors"
      >
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
        <span className="text-[10px] font-bold font-mono tracking-widest flex-1 text-left" style={{ color }}>
          {title}
        </span>
        {open
          ? <ChevronDown  className="w-3 h-3 text-[#3a4452]" />
          : <ChevronRight className="w-3 h-3 text-[#3a4452]" />
        }
      </button>
      {open && <div className="p-3 space-y-2 bg-[#070b0f]">{children}</div>}
    </div>
  );
}

// ── System Prompt section ────────────────────────────────────────
function SystemPromptSection({ cfg, onChange }: { cfg: AgentFullConfig; onChange: (v: string) => void }) {
  return (
    <Section icon={Cpu} title="SYSTEM PROMPT" color="#bc8cff">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-2 text-[9px] font-mono text-[#6e7b8b]">
          <span>MODELO</span>
          <span className="text-[#c9d1d9] font-bold">{cfg.model}</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-[#6e7b8b]">
          <span>MAX TOKENS</span>
          <span className="text-[#c9d1d9] font-bold">{cfg.maxTokens.toLocaleString('en-US')}</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-[#6e7b8b]">
          <span>APROBACIÓN HUMANA</span>
          <span className={cfg.humanApprovalRequired ? "text-[#f0c000] font-bold" : "text-[#6e7b8b]"}>
            {cfg.humanApprovalRequired ? "SÍ" : "NO"}
          </span>
        </div>
      </div>
      <textarea
        value={cfg.systemPrompt}
        onChange={(e) => onChange(e.target.value)}
        rows={9}
        className="w-full bg-[#0d1117] border border-[#1a2332] rounded px-2.5 py-2 text-[10px] font-mono text-[#c9d1d9] resize-y focus:outline-none focus:border-[#bc8cff]/40 transition-colors leading-relaxed placeholder-[#3a4452]"
      />
    </Section>
  );
}

// ── Tools section ────────────────────────────────────────────────
function ToolsSection({ tools, onToggle }: { tools: AgentTool[]; onToggle: (id: string, v: boolean) => void }) {
  return (
    <Section icon={Wrench} title="HERRAMIENTAS" color="#58a6ff">
      {["read", "write", "external", "ai"].map((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        if (!catTools.length) return null;
        return (
          <div key={cat}>
            <div
              className="text-[8px] font-mono font-bold tracking-widest mb-1.5 mt-1"
              style={{ color: TOOL_CATEGORY_COLOR[cat as AgentTool["category"]] }}
            >
              {cat.toUpperCase()}
            </div>
            <div className="space-y-1">
              {catTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-start gap-2 px-2 py-1.5 rounded border border-transparent hover:border-[#1a2332] hover:bg-[#0d1117] transition-colors"
                >
                  <Toggle enabled={tool.enabled} onChange={(v) => onToggle(tool.id, v)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#c9d1d9]">{tool.name}</span>
                      {tool.dangerous && (
                        <span className="flex items-center gap-0.5 text-[8px] font-mono text-[#f85149]">
                          <AlertTriangle className="w-2.5 h-2.5" /> peligroso
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] font-mono text-[#6e7b8b] leading-snug">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Section>
  );
}

// ── Actions section ──────────────────────────────────────────────
function ActionsSection({ actions, onToggle }: { actions: AgentAction[]; onToggle: (id: string, v: boolean) => void }) {
  return (
    <Section icon={Zap} title="ACCIONES" color="#f0c000">
      <div className="space-y-1">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-start gap-2 px-2 py-1.5 rounded border border-transparent hover:border-[#1a2332] hover:bg-[#0d1117] transition-colors"
          >
            <Toggle enabled={action.enabled} onChange={(v) => onToggle(action.id, v)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-[#c9d1d9]">{action.name}</span>
                <span className={cn(
                  "text-[8px] font-mono px-1 rounded border",
                  action.requiresApproval
                    ? "text-[#f0c000] border-[#f0c000]/30 bg-[#f0c000]/10"
                    : "text-[#6e7b8b] border-[#1a2332]"
                )}>
                  {action.requiresApproval ? "aprobación" : "autónomo"}
                </span>
              </div>
              <p className="text-[9px] font-mono text-[#6e7b8b] leading-snug">{action.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Skills section ───────────────────────────────────────────────
function SkillsSection({ skills, onToggle }: { skills: AgentSkillRef[]; onToggle: (id: string, v: boolean) => void }) {
  return (
    <Section icon={BookOpen} title="SKILLS" color="#39d353">
      <div className="space-y-1">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-start gap-2 px-2 py-1.5 rounded border border-transparent hover:border-[#1a2332] hover:bg-[#0d1117] transition-colors"
          >
            <Toggle enabled={skill.enabled} onChange={(v) => onToggle(skill.id, v)} />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono font-bold text-[#c9d1d9]">{skill.label}</span>
              <p className="text-[9px] font-mono text-[#6e7b8b] leading-snug">{skill.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Memory section ───────────────────────────────────────────────
function MemorySection({ cfg, onChange }: {
  cfg: AgentFullConfig;
  onChange: (key: keyof AgentFullConfig["memory"], value: boolean | number) => void;
}) {
  const m = cfg.memory;
  return (
    <Section icon={Database} title="MEMORIA" color="#39d353">
      <div className="grid grid-cols-2 gap-2 mb-3">
        <MemoryStat label="CONTEXT WINDOW" value={`${(m.contextWindow / 1000).toFixed(0)}k tokens`} />
        <MemoryStat label="HISTORIAL" value={m.retainHistory ? `${m.historyDepth} msgs` : "OFF"} />
      </div>
      <div className="space-y-1.5">
        {[
          { key: "retainHistory"      as const, label: "Retener historial de conversación", value: m.retainHistory },
          { key: "crossProjectMemory" as const, label: "Memoria cross-proyecto",             value: m.crossProjectMemory },
          { key: "factoryBrainAccess" as const, label: "Acceso a Factory Brain",             value: m.factoryBrainAccess },
        ].map(({ key, label, value }) => (
          <div key={key} className="flex items-center gap-2 px-2 py-1">
            <Toggle enabled={value} onChange={(v) => onChange(key, v)} />
            <span className="text-[10px] font-mono text-[#c9d1d9]">{label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function MemoryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0d1117] rounded p-2">
      <div className="text-[8px] font-mono text-[#3a4452] tracking-widest mb-0.5">{label}</div>
      <div className="text-[11px] font-mono font-bold text-[#c9d1d9]">{value}</div>
    </div>
  );
}

// ── Main view ────────────────────────────────────────────────────
export function AgentConfigView() {
  const [configs, setConfigs] = useState<AgentFullConfig[]>(DEMO_AGENT_FULL_CONFIGS);
  const [selectedAgent, setSelectedAgent] = useState<TaskAgent>("guardian");

  const cfg = configs.find((c) => c.agent === selectedAgent)!;

  function updateConfig(updater: (c: AgentFullConfig) => AgentFullConfig) {
    setConfigs((prev) => prev.map((c) => c.agent === selectedAgent ? updater(c) : c));
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* Agent selector sidebar */}
      <nav className="w-48 border-r border-[#1a2332] flex flex-col shrink-0 bg-[#070b0f]">
        <div className="text-[8px] font-mono font-bold tracking-widest text-[#3a4452] px-3 pt-3 pb-2">
          SELECCIONA AGENTE
        </div>
        <div className="flex-1 p-2 space-y-0.5">
          {configs.map((c) => {
            const meta = AGENT_ICONS[c.agent];
            const Icon = meta.Icon;
            const active = selectedAgent === c.agent;
            return (
              <button
                key={c.agent}
                onClick={() => setSelectedAgent(c.agent)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-colors border",
                  active
                    ? "bg-[#0d1117] border-[#1a2332]"
                    : "border-transparent hover:bg-[#0d1117]/50"
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: meta.color }} />
                <div>
                  <div
                    className="text-[10px] font-bold font-mono tracking-wider"
                    style={{ color: active ? meta.color : "#6e7b8b" }}
                  >
                    {c.label.toUpperCase()}
                  </div>
                  <div className="text-[8px] font-mono text-[#3a4452]">
                    {c.tools.filter((t) => t.enabled).length} tools ·{" "}
                    {c.actions.filter((a) => a.enabled).length} acciones
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Save hint */}
        <div className="p-3 border-t border-[#1a2332]">
          <div className="text-[8px] font-mono text-[#3a4452] leading-relaxed">
            Los cambios se aplican en la próxima ejecución del agente.
          </div>
        </div>
      </nav>

      {/* Config panels */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Agent header */}
          <div className="flex items-center gap-3 mb-1">
            {(() => {
              const meta = AGENT_ICONS[cfg.agent];
              const Icon = meta.Icon;
              return (
                <>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${meta.color}1a`, border: `1px solid ${meta.color}33` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold font-mono text-[#c9d1d9]">{cfg.label}</div>
                    <div className="text-[9px] font-mono text-[#6e7b8b]">
                      {cfg.model} · {cfg.humanApprovalRequired ? "aprobación humana requerida" : "ejecución autónoma"}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          <SystemPromptSection
            cfg={cfg}
            onChange={(v) => updateConfig((c) => ({ ...c, systemPrompt: v }))}
          />

          <ToolsSection
            tools={cfg.tools}
            onToggle={(id, v) =>
              updateConfig((c) => ({
                ...c,
                tools: c.tools.map((t) => t.id === id ? { ...t, enabled: v } : t),
              }))
            }
          />

          <ActionsSection
            actions={cfg.actions}
            onToggle={(id, v) =>
              updateConfig((c) => ({
                ...c,
                actions: c.actions.map((a) => a.id === id ? { ...a, enabled: v } : a),
              }))
            }
          />

          <SkillsSection
            skills={cfg.skills}
            onToggle={(id, v) =>
              updateConfig((c) => ({
                ...c,
                skills: c.skills.map((s) => s.id === id ? { ...s, enabled: v } : s),
              }))
            }
          />

          <MemorySection
            cfg={cfg}
            onChange={(key, value) =>
              updateConfig((c) => ({ ...c, memory: { ...c.memory, [key]: value } }))
            }
          />
        </div>
      </div>
    </div>
  );
}
