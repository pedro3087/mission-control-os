"use client";
import { StatusDot } from "./StatusDot";
import { formatRevenue, formatUptime } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, Zap } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  const { selectedProjectId, setSelectedProject } = useStore();
  const isSelected = selectedProjectId === project.id;

  return (
    <button
      onClick={() => setSelectedProject(isSelected ? null : project.id)}
      className={cn(
        "w-full text-left p-3 rounded border transition-all duration-150 group",
        "bg-[#0d1117] hover:bg-[#111820]",
        isSelected
          ? "border-[#58a6ff] shadow-[0_0_12px_rgba(88,166,255,0.15)]"
          : "border-[#1a2332] hover:border-[#1f3044]"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusDot status={project.status} />
          <span className="font-bold text-[#c9d1d9] truncate text-sm">{project.name}</span>
        </div>
        <StatusDot status={project.status} showLabel />
      </div>

      <p className="text-[11px] text-[#6e7b8b] mb-3 line-clamp-1">{project.description}</p>

      <div className="grid grid-cols-2 gap-2">
        <Metric
          icon={<span className="text-[10px]">$</span>}
          label="MRR"
          value={formatRevenue(project.revenueCents)}
          sub={
            project.revenueGrowthPct > 0
              ? <><TrendingUp className="w-2.5 h-2.5" /><span className="text-[#39d353]">+{project.revenueGrowthPct}%</span></>
              : <><TrendingDown className="w-2.5 h-2.5 text-[#f85149]" /><span className="text-[#f85149]">{project.revenueGrowthPct}%</span></>
          }
        />
        <Metric
          icon={<Users className="w-2.5 h-2.5" />}
          label="USUARIOS"
          value={project.activeUsers.toLocaleString('en-US')}
          sub={<span className="text-[#6e7b8b]">{project.conversionPct}% conv</span>}
        />
        <Metric
          icon={<Zap className="w-2.5 h-2.5" />}
          label="UPTIME"
          value={`${project.uptimePct}%`}
          sub={<span className="text-[#6e7b8b]">{formatUptime(project.uptimeSeconds)}</span>}
        />
        <Metric
          icon={<span className="text-[10px]">⚡</span>}
          label="P95"
          value={project.status === "down" ? "—" : `${project.p95LatencyMs}ms`}
          sub={
            project.errorsLast24h > 0
              ? <span className={project.errorsLast24h > 10 ? "text-[#f85149]" : "text-[#f0c000]"}>{project.errorsLast24h} err/24h</span>
              : <span className="text-[#39d353]">0 errors</span>
          }
        />
      </div>

      <div className="mt-2 pt-2 border-t border-[#1a2332] flex items-center gap-1.5 overflow-hidden">
        {project.stack.map((s) => (
          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-[#1a2332] text-[#6e7b8b] font-mono shrink-0">{s}</span>
        ))}
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1a3a5c] text-[#58a6ff] font-mono shrink-0">{project.designSystem}</span>
      </div>
    </button>
  );
}

function Metric({ icon, label, value, sub }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: React.ReactNode;
}) {
  return (
    <div className="bg-[#070b0f] rounded p-1.5">
      <div className="flex items-center gap-1 text-[9px] text-[#6e7b8b] mb-0.5 font-mono tracking-wider">
        {icon}{label}
      </div>
      <div className="text-sm font-bold text-[#c9d1d9] font-mono">{value}</div>
      <div className="flex items-center gap-0.5 text-[9px] font-mono mt-0.5">{sub}</div>
    </div>
  );
}
