"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import type { DashboardView } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Terminal, Cpu, Activity, Settings, Zap } from "lucide-react";

// ── View layout icons (mini visual del layout) ───────────────────
const VIEW_PRESETS: {
  key: DashboardView;
  label: string;
  title: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "standard",
    label: "OS",
    title: "Vista estándar — Portfolio | Brain | Guardian",
    icon: (
      <div className="flex gap-px items-stretch h-3 w-7">
        <div className="w-[7px] rounded-[1px] bg-current opacity-60" />
        <div className="flex-1 rounded-[1px] bg-current" />
        <div className="w-[6px] rounded-[1px] bg-current opacity-60" />
      </div>
    ),
  },
  {
    key: "portfolio",
    label: "PORT",
    title: "Portfolio al frente — Panel principal expandido",
    icon: (
      <div className="flex gap-px items-stretch h-3 w-7">
        <div className="flex-1 rounded-[1px] bg-current" />
        <div className="w-[5px] rounded-[1px] bg-current opacity-50" />
        <div className="w-[5px] rounded-[1px] bg-current opacity-50" />
      </div>
    ),
  },
  {
    key: "brain",
    label: "BRAIN",
    title: "Brain al frente — Análisis expandido",
    icon: (
      <div className="flex gap-px items-stretch h-3 w-7">
        <div className="w-[4px] rounded-[1px] bg-current opacity-40" />
        <div className="flex-1 rounded-[1px] bg-current" />
        <div className="w-[4px] rounded-[1px] bg-current opacity-40" />
      </div>
    ),
  },
  {
    key: "ops",
    label: "OPS",
    title: "Guardian al frente — Operaciones expandidas",
    icon: (
      <div className="flex gap-px items-stretch h-3 w-7">
        <div className="w-[5px] rounded-[1px] bg-current opacity-50" />
        <div className="w-[5px] rounded-[1px] bg-current opacity-50" />
        <div className="flex-1 rounded-[1px] bg-current" />
      </div>
    ),
  },
];

export function OSHeader() {
  const {
    isDemo, setDemo,
    isSettingsOpen, setSettingsOpen,
    isTasksOpen, setTasksOpen,
    dashboardView, setDashboardView,
    projects,
  } = useStore();

  const [time, setTime] = useState("");
  const [cpuPct, setCpuPct] = useState<number | null>(null);

  useEffect(() => {
    setCpuPct(Math.floor(Math.random() * 30) + 12);
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const healthyCount  = projects.filter((p) => p.status === "healthy").length;
  const downCount     = projects.filter((p) => p.status === "down").length;
  const criticalCount = projects.filter((p) => p.status === "down" || p.status === "degraded").length;

  return (
    <header className="h-9 bg-[#0d1117] border-b border-[#1a2332] flex items-center px-3 gap-3 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <Terminal className="w-3.5 h-3.5 text-[#39d353]" />
        <span className="text-[11px] font-bold font-mono text-[#39d353] tracking-wider">MISSION CONTROL</span>
        <span className="text-[9px] font-mono text-[#6e7b8b]">v1.0</span>
      </div>

      <div className="w-px h-4 bg-[#1a2332] shrink-0" />

      {/* Status summary */}
      <div className="flex items-center gap-3 text-[9px] font-mono shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39d353] pulse-green inline-block" />
          <span className="text-[#6e7b8b]">{healthyCount} estables</span>
        </span>
        {criticalCount > 0 && (
          <span className="flex items-center gap-1">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full inline-block",
              downCount > 0 ? "bg-[#f85149] pulse-red" : "bg-[#f0c000] pulse-yellow"
            )} />
            <span className={downCount > 0 ? "text-[#f85149]" : "text-[#f0c000]"}>
              {criticalCount} con alertas
            </span>
          </span>
        )}
      </div>

      <div className="w-px h-4 bg-[#1a2332] shrink-0" />

      {/* ── View switcher ── */}
      <div className="flex items-center shrink-0">
        <span className="text-[8px] font-mono text-[#3a4452] tracking-widest mr-1.5">VISTA</span>
        <div className="flex items-center border border-[#1a2332] rounded overflow-hidden">
          {VIEW_PRESETS.map((v, i) => {
            const active = dashboardView === v.key;
            return (
              <button
                key={v.key}
                onClick={() => setDashboardView(v.key)}
                title={v.title}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 transition-all text-[8px] font-mono font-bold tracking-wider",
                  i > 0 && "border-l border-[#1a2332]",
                  active
                    ? "bg-[#1a2332] text-[#c9d1d9]"
                    : "text-[#3a4452] hover:text-[#6e7b8b] hover:bg-[#0d1117]"
                )}
              >
                {v.icon}
                <span className="hidden xl:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />

      {/* Right side controls */}
      <div className="flex items-center gap-2.5 text-[9px] font-mono text-[#6e7b8b] shrink-0">
        {cpuPct !== null && (
          <span className="flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5" />
            {cpuPct}%
          </span>
        )}
        <span className="flex items-center gap-1">
          <Activity className="w-2.5 h-2.5" />
          {projects.length} apps
        </span>

        <div className="w-px h-4 bg-[#1a2332]" />

        {/* Demo/Live toggle */}
        <button
          onClick={() => setDemo(!isDemo)}
          className={cn(
            "px-2 py-0.5 rounded text-[9px] font-bold tracking-wider border transition-colors font-mono",
            isDemo
              ? "border-[#f0c000]/40 text-[#f0c000] bg-[#6b5500]/20 hover:bg-[#6b5500]/30"
              : "border-[#39d353]/40 text-[#39d353] bg-[#1a6630]/20 hover:bg-[#1a6630]/30"
          )}
        >
          {isDemo ? "MODO DEMO" : "MODO LIVE"}
        </button>

        <div className="w-px h-4 bg-[#1a2332]" />

        <span className="text-[#c9d1d9] tabular-nums">{time}</span>
        <span className="blink text-[#39d353]">_</span>

        <div className="w-px h-4 bg-[#1a2332]" />

        {/* Tasks */}
        <button
          onClick={() => { setTasksOpen(!isTasksOpen); if (isSettingsOpen) setSettingsOpen(false); }}
          title="OPS Center — tareas de agentes"
          className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors font-mono text-[9px] font-bold tracking-wider",
            isTasksOpen
              ? "border-[#f0c000]/60 text-[#f0c000] bg-[#6b5500]/30"
              : "border-[#1a2332] text-[#6e7b8b] hover:border-[#f0c000]/40 hover:text-[#f0c000]"
          )}
        >
          <Zap className="w-3 h-3" />
          TASKS
          <span className="w-3.5 h-3.5 rounded-full bg-[#f0c000] text-[#070b0f] text-[7px] font-black flex items-center justify-center">
            2
          </span>
        </button>

        <div className="w-px h-4 bg-[#1a2332]" />

        {/* Settings */}
        <button
          onClick={() => { setSettingsOpen(!isSettingsOpen); if (isTasksOpen) setTasksOpen(false); }}
          title="Configuración"
          className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors font-mono text-[9px] font-bold tracking-wider",
            isSettingsOpen
              ? "border-[#58a6ff]/60 text-[#58a6ff] bg-[#1a3a5c]/40"
              : "border-[#1a2332] text-[#6e7b8b] hover:border-[#58a6ff]/40 hover:text-[#58a6ff]"
          )}
        >
          <Settings className="w-3 h-3" />
          CONFIG
        </button>
      </div>

      {/* Meta badge */}
      <div className="hidden xl:flex items-center gap-1 text-[9px] font-mono text-[#6e7b8b] border border-[#1a2332] rounded px-2 py-0.5 shrink-0">
        <span className="text-[#bc8cff]">◆</span>
        <span>Construido por la fábrica</span>
      </div>
    </header>
  );
}
