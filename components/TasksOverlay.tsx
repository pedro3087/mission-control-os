"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { DEMO_TASKS } from "@/lib/fixtures";
import type { AgentTask, TaskStatus, TaskAgent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AgentConfigView } from "@/components/AgentConfigView";
import {
  X, Shield, Brain, TrendingUp, BarChart3, Scale,
  CheckCircle, XCircle, Clock, Play, AlertTriangle,
  GitPullRequest, ExternalLink, ChevronRight, Settings2, ListTodo,
} from "lucide-react";

type OverlayTab = "tasks" | "config";

// ── Agent meta ───────────────────────────────────────────────────
const AGENT_META: Record<TaskAgent, { label: string; color: string; Icon: React.ElementType }> = {
  guardian:    { label: "GUARDIAN",    color: "#f85149", Icon: Shield },
  brain:       { label: "BRAIN",       color: "#bc8cff", Icon: Brain },
  acquisition: { label: "ACQUISITION", color: "#39d353", Icon: TrendingUp },
  portfolio:   { label: "PORTFOLIO",   color: "#58a6ff", Icon: BarChart3 },
  compliance:  { label: "COMPLIANCE",  color: "#f0c000", Icon: Scale },
};

const STATUS_META: Record<TaskStatus, { label: string; color: string; Icon: React.ElementType }> = {
  queued:           { label: "EN COLA",          color: "#6e7b8b", Icon: Clock },
  running:          { label: "EJECUTANDO",        color: "#58a6ff", Icon: Play },
  waiting_approval: { label: "ESPERA APROBACIÓN", color: "#f0c000", Icon: AlertTriangle },
  done:             { label: "COMPLETADO",         color: "#39d353", Icon: CheckCircle },
  failed:           { label: "FALLIDO",            color: "#f85149", Icon: XCircle },
};

type FilterKey = "all" | TaskStatus;
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",              label: "TODAS" },
  { key: "running",          label: "EJECUTANDO" },
  { key: "waiting_approval", label: "APROBACIÓN" },
  { key: "queued",           label: "EN COLA" },
  { key: "done",             label: "COMPLETADAS" },
];

// ── Progress bar ─────────────────────────────────────────────────
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-0.5 w-full bg-[#1a2332] rounded-full overflow-hidden mt-2">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ── Task card ────────────────────────────────────────────────────
function TaskCard({ task }: { task: AgentTask }) {
  const [expanded, setExpanded] = useState(false);
  const [approved, setApproved] = useState<boolean | null>(null);

  const agent = AGENT_META[task.agent];
  const status = STATUS_META[task.status];
  const AgentIcon = agent.Icon;
  const StatusIcon = status.Icon;

  const showApproval =
    task.status === "waiting_approval" && task.approvalRequired && approved === null;

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden transition-all",
        task.status === "waiting_approval" && "border-[#f0c000]/40 bg-[#f0c000]/5",
        task.status === "running"          && "border-[#58a6ff]/30 bg-[#58a6ff]/5",
        task.status === "done"             && "border-[#1a2332] bg-[#0d1117]/60 opacity-70",
        task.status === "queued"           && "border-[#1a2332] bg-[#0d1117]/40",
        task.status === "failed"           && "border-[#f85149]/30 bg-[#f85149]/5",
      )}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 p-3 text-left"
      >
        {/* Agent icon */}
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${agent.color}1a`, border: `1px solid ${agent.color}33` }}
        >
          <AgentIcon className="w-3.5 h-3.5" style={{ color: agent.color }} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Agent + status badges */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[8px] font-bold font-mono tracking-wider" style={{ color: agent.color }}>
              {agent.label}
            </span>
            <span className="text-[#3a4452] text-[8px]">·</span>
            <span className="flex items-center gap-0.5 text-[8px] font-mono" style={{ color: status.color }}>
              <StatusIcon className="w-2.5 h-2.5" />
              {status.label}
            </span>
            {task.projectName && (
              <>
                <span className="text-[#3a4452] text-[8px]">·</span>
                <span className="text-[8px] font-mono text-[#6e7b8b]">{task.projectName}</span>
              </>
            )}
          </div>

          <div className="text-[11px] font-mono text-[#c9d1d9] leading-snug">{task.title}</div>

          {/* Progress bar for running tasks */}
          {task.status === "running" && task.progress !== undefined && (
            <ProgressBar pct={task.progress} color={agent.color} />
          )}
        </div>

        <ChevronRight
          className={cn("w-3 h-3 text-[#3a4452] shrink-0 mt-1 transition-transform", expanded && "rotate-90")}
        />
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2.5 border-t border-[#1a2332] pt-2.5 fade-in">
          <p className="text-[10px] font-mono text-[#6e7b8b] leading-relaxed">{task.detail}</p>

          {/* Result */}
          {task.result && (
            <div className="bg-[#39d353]/10 border border-[#39d353]/20 rounded p-2">
              <p className="text-[10px] font-mono text-[#39d353] leading-relaxed">{task.result}</p>
            </div>
          )}

          {/* PR link */}
          {task.prUrl && (
            <a
              href={task.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[9px] font-mono text-[#58a6ff] hover:underline"
            >
              <GitPullRequest className="w-3 h-3" />
              Ver Pull Request
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}

          {/* Approval controls */}
          {showApproval && task.approvalPrompt && (
            <div className="border border-[#f0c000]/30 bg-[#f0c000]/5 rounded p-2.5 space-y-2">
              <p className="text-[10px] font-mono text-[#f0c000] leading-relaxed">
                {task.approvalPrompt}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setApproved(true)}
                  className="flex items-center gap-1 text-[9px] font-mono font-bold px-2.5 py-1 rounded border border-[#39d353]/40 bg-[#39d353]/10 text-[#39d353] hover:bg-[#39d353]/20 transition-colors"
                >
                  <CheckCircle className="w-3 h-3" /> APROBAR
                </button>
                <button
                  onClick={() => setApproved(false)}
                  className="flex items-center gap-1 text-[9px] font-mono font-bold px-2.5 py-1 rounded border border-[#f85149]/40 bg-[#f85149]/10 text-[#f85149] hover:bg-[#f85149]/20 transition-colors"
                >
                  <XCircle className="w-3 h-3" /> RECHAZAR
                </button>
              </div>
            </div>
          )}

          {/* Post-approval feedback */}
          {approved === true && (
            <div className="text-[10px] font-mono text-[#39d353] fade-in">
              ✓ Aprobado — el agente ejecutará la acción.
            </div>
          )}
          {approved === false && (
            <div className="text-[10px] font-mono text-[#f85149] fade-in">
              ✗ Rechazado — la tarea fue cancelada.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main overlay ─────────────────────────────────────────────────
export function TasksOverlay() {
  const { isTasksOpen, setTasksOpen } = useStore();
  const [tab, setTab] = useState<OverlayTab>("tasks");
  const [filter, setFilter] = useState<FilterKey>("all");

  if (!isTasksOpen) return null;

  const tasks = filter === "all" ? DEMO_TASKS : DEMO_TASKS.filter((t) => t.status === filter);

  const runningCount  = DEMO_TASKS.filter((t) => t.status === "running").length;
  const approvalCount = DEMO_TASKS.filter((t) => t.status === "waiting_approval").length;
  const queuedCount   = DEMO_TASKS.filter((t) => t.status === "queued").length;
  const doneCount     = DEMO_TASKS.filter((t) => t.status === "done").length;

  return (
    <div className="absolute inset-0 bg-[#070b0f] flex flex-col z-20 fade-in">
      {/* Header */}
      <div className="h-10 bg-[#0d1117] border-b border-[#1a2332] flex items-center px-4 gap-3 shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-[#6e7b8b] font-mono">
          OPS CENTER
        </span>

        <div className="w-px h-4 bg-[#1a2332]" />

        {/* Tab switcher */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setTab("tasks")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider transition-colors",
              tab === "tasks"
                ? "bg-[#1a2332] text-[#c9d1d9]"
                : "text-[#6e7b8b] hover:text-[#c9d1d9]"
            )}
          >
            <ListTodo className="w-3 h-3" />
            TAREAS
            {approvalCount > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-[#f0c000] text-[#070b0f] text-[7px] font-black flex items-center justify-center">
                {approvalCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("config")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider transition-colors",
              tab === "config"
                ? "bg-[#1a2332] text-[#c9d1d9]"
                : "text-[#6e7b8b] hover:text-[#c9d1d9]"
            )}
          >
            <Settings2 className="w-3 h-3" />
            AGENTES
          </button>
        </div>

        {/* Live counters — solo en tab tareas */}
        {tab === "tasks" && (
          <div className="flex items-center gap-3 text-[9px] font-mono">
            {runningCount > 0 && (
              <span className="flex items-center gap-1 text-[#58a6ff]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] pulse-green inline-block" />
                {runningCount} ejecutando
              </span>
            )}
            {approvalCount > 0 && (
              <span className="flex items-center gap-1 text-[#f0c000]">
                <AlertTriangle className="w-2.5 h-2.5" />
                {approvalCount} esperan aprobación
              </span>
            )}
          </div>
        )}

        <div className="flex-1" />

        <button
          onClick={() => setTasksOpen(false)}
          className="flex items-center gap-1.5 text-[9px] font-mono text-[#6e7b8b] hover:text-[#c9d1d9] border border-[#1a2332] hover:border-[#1f3044] px-2 py-0.5 rounded transition-colors"
        >
          <X className="w-3 h-3" /> CERRAR
        </button>
      </div>

      {/* Body */}
      {tab === "config" && <AgentConfigView />}
      <div className={cn("flex flex-1 min-h-0", tab !== "tasks" && "hidden")}>
        {/* Left sidebar — stats + filters */}
        <nav className="w-48 border-r border-[#1a2332] flex flex-col shrink-0 bg-[#070b0f]">
          {/* Summary stats */}
          <div className="p-3 border-b border-[#1a2332] grid grid-cols-2 gap-1.5">
            <StatBox label="EJECUTANDO" value={runningCount} color="text-[#58a6ff]" />
            <StatBox label="APROBACIÓN" value={approvalCount} color="text-[#f0c000]" />
            <StatBox label="EN COLA"    value={queuedCount}   color="text-[#6e7b8b]" />
            <StatBox label="LISTAS"     value={doneCount}     color="text-[#39d353]" />
          </div>

          {/* Filter list */}
          <div className="p-2 space-y-0.5 flex-1">
            {FILTERS.map((f) => {
              const count = f.key === "all"
                ? DEMO_TASKS.length
                : DEMO_TASKS.filter((t) => t.status === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors text-[10px] font-mono",
                    filter === f.key
                      ? "bg-[#0d1117] border border-[#1a2332] text-[#c9d1d9]"
                      : "text-[#6e7b8b] hover:bg-[#0d1117]/50 border border-transparent"
                  )}
                >
                  <span>{f.label}</span>
                  <span className="text-[9px] text-[#3a4452]">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Agent legend */}
          <div className="p-3 border-t border-[#1a2332] space-y-1.5">
            <div className="text-[8px] font-mono text-[#3a4452] tracking-widest mb-2">AGENTES</div>
            {Object.entries(AGENT_META).map(([key, meta]) => {
              const Icon = meta.Icon;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <Icon className="w-2.5 h-2.5" style={{ color: meta.color }} />
                  <span className="text-[9px] font-mono" style={{ color: meta.color }}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Task list */}
        <div className="flex-1 min-w-0 overflow-y-auto p-4">
          {tasks.length === 0 ? (
            <div className="text-center text-[#6e7b8b] text-[11px] font-mono mt-16">
              No hay tareas en esta categoría.
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-2">
              {/* Section: needs action */}
              {filter === "all" && approvalCount > 0 && (
                <div className="mb-4">
                  <div className="text-[8px] font-mono font-bold tracking-widest text-[#f0c000] mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    REQUIEREN TU APROBACIÓN
                  </div>
                  <div className="space-y-2">
                    {tasks.filter((t) => t.status === "waiting_approval").map((t) => (
                      <TaskCard key={t.id} task={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Section: rest */}
              {filter === "all" && (
                <div>
                  <div className="text-[8px] font-mono font-bold tracking-widest text-[#6e7b8b] mb-2">
                    OTRAS TAREAS
                  </div>
                  <div className="space-y-2">
                    {tasks.filter((t) => t.status !== "waiting_approval").map((t) => (
                      <TaskCard key={t.id} task={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Filtered view */}
              {filter !== "all" && (
                <div className="space-y-2">
                  {tasks.map((t) => (
                    <TaskCard key={t.id} task={t} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#0d1117] rounded p-1.5 text-center">
      <div className="text-[8px] text-[#3a4452] font-mono tracking-wider mb-0.5">{label}</div>
      <div className={cn("text-sm font-bold font-mono", color)}>{value}</div>
    </div>
  );
}
