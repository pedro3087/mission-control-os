"use client";
import { ProjectCard } from "./ProjectCard";
import { ProjectDrawer } from "./ProjectDrawer";
import { useStore } from "@/lib/store";
import { formatRevenue } from "@/lib/utils";

export function PortfolioPanel() {
  const { selectedProjectId, projects } = useStore();

  const totalMRR = projects.reduce((s, p) => s + p.revenueCents, 0);
  const totalUsers = projects.reduce((s, p) => s + p.activeUsers, 0);
  const healthyCount = projects.filter((p) => p.status === "healthy").length;
  const downCount = projects.filter((p) => p.status === "down").length;

  return (
    <div className="flex flex-col h-full relative">
      {/* Panel header */}
      <div className="p-3 border-b border-[#1a2332] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#6e7b8b] font-mono">PORTFOLIO</span>
          <span className="text-[10px] text-[#6e7b8b] font-mono">{projects.length} apps</span>
        </div>
        {/* Aggregate stats */}
        <div className="grid grid-cols-2 gap-1.5">
          <AggregateStat label="TOTAL MRR" value={formatRevenue(totalMRR)} color="text-[#39d353]" />
          <AggregateStat label="USUARIOS" value={totalUsers.toLocaleString()} color="text-[#58a6ff]" />
          <AggregateStat label="ESTABLES" value={`${healthyCount}/${projects.length}`} color="text-[#39d353]" />
          <AggregateStat
            label="DOWN"
            value={downCount.toString()}
            color={downCount > 0 ? "text-[#f85149]" : "text-[#6e7b8b]"}
          />
        </div>
      </div>

      {/* Project list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {/* Drawer overlay */}
      {selectedProjectId && <ProjectDrawer />}
    </div>
  );
}

function AggregateStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#070b0f] rounded p-1.5">
      <div className="text-[9px] text-[#6e7b8b] font-mono tracking-wider mb-0.5">{label}</div>
      <div className={`text-sm font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}
