"use client";
import { useStore } from "@/lib/store";
import { StatusDot } from "./StatusDot";
import { formatRevenue, formatUptime, timeAgo } from "@/lib/utils";
import { X, ExternalLink, GitBranch, Shield, AlertTriangle } from "lucide-react";

export function ProjectDrawer() {
  const { selectedProjectId, setSelectedProject, projects } = useStore();
  const project = projects.find((p) => p.id === selectedProjectId);

  if (!project) return null;

  const uptimePctColor =
    project.uptimePct >= 99.9 ? "text-[#39d353]" :
    project.uptimePct >= 97 ? "text-[#f0c000]" : "text-[#f85149]";

  return (
    <div className="slide-in absolute inset-y-0 right-0 w-80 bg-[#0d1117] border-l border-[#1a2332] flex flex-col z-10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#1a2332]">
        <div className="flex items-center gap-2">
          <StatusDot status={project.status} />
          <span className="font-bold text-[#c9d1d9] text-sm">{project.name}</span>
        </div>
        <button
          onClick={() => setSelectedProject(null)}
          className="text-[#6e7b8b] hover:text-[#c9d1d9] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Description + links */}
        <div>
          <p className="text-[11px] text-[#6e7b8b] mb-2">{project.description}</p>
          <div className="flex gap-2">
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-[#58a6ff] hover:underline">
              <ExternalLink className="w-3 h-3" /> Ver app
            </a>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-[#58a6ff] hover:underline">
              <GitBranch className="w-3 h-3" /> Repo
            </a>
          </div>
        </div>

        {/* Revenue */}
        <Section title="INGRESOS">
          <BigStat label="MRR" value={formatRevenue(project.revenueCents)}
            sub={project.revenueGrowthPct > 0 ? `+${project.revenueGrowthPct}% MoM` : `${project.revenueGrowthPct}% MoM`}
            subColor={project.revenueGrowthPct > 0 ? "text-[#39d353]" : "text-[#f85149]"} />
          <BigStat label="CONVERSIÓN" value={`${project.conversionPct}%`} sub="visita→registro" subColor="text-[#6e7b8b]" />
          <BigStat label="USUARIOS" value={project.activeUsers.toLocaleString('en-US')} sub="últimos 30d" subColor="text-[#6e7b8b]" />
        </Section>

        {/* Reliability */}
        <Section title="CONFIABILIDAD">
          <BigStat label="UPTIME" value={`${project.uptimePct}%`}
            sub={formatUptime(project.uptimeSeconds)} subColor={uptimePctColor} />
          <BigStat label="P95 LATENCY" value={project.status === "down" ? "—" : `${project.p95LatencyMs}ms`}
            sub={project.p95LatencyMs < 300 ? "rápido" : project.p95LatencyMs < 1000 ? "lento" : "crítico"}
            subColor={project.p95LatencyMs < 300 ? "text-[#39d353]" : project.p95LatencyMs < 1000 ? "text-[#f0c000]" : "text-[#f85149]"} />
          <BigStat label="ERRORES/24H" value={project.errorsLast24h.toString()}
            sub={project.errorsLast24h === 0 ? "sin errores" : "requiere atención"}
            subColor={project.errorsLast24h === 0 ? "text-[#39d353]" : "text-[#f85149]"} />
        </Section>

        {/* Last commit */}
        <Section title="ÚLTIMO COMMIT">
          <div className="bg-[#070b0f] rounded p-2">
            <p className="text-[11px] text-[#c9d1d9] font-mono mb-1">{project.lastCommit}</p>
            <p className="text-[10px] text-[#6e7b8b]" suppressHydrationWarning>{timeAgo(project.lastCommitAt)}</p>
          </div>
        </Section>

        {/* Guardian */}
        <Section title="GUARDIAN">
          <div className={`flex items-center gap-2 p-2 rounded ${project.guardianEnabled ? "bg-[#1a6630]/20 border border-[#39d353]/20" : "bg-[#5c1f1f]/20 border border-[#f85149]/20"}`}>
            {project.guardianEnabled
              ? <><Shield className="w-3.5 h-3.5 text-[#39d353]" /><span className="text-[11px] text-[#39d353]">Activo — auto-fix habilitado</span></>
              : <><AlertTriangle className="w-3.5 h-3.5 text-[#f85149]" /><span className="text-[11px] text-[#f85149]">Deshabilitado — sin monitoreo</span></>
            }
          </div>
        </Section>

        {/* Stack */}
        <Section title="STACK">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-[#1a2332] text-[#6e7b8b] font-mono">{s}</span>
            ))}
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1a3a5c] text-[#58a6ff] font-mono">{project.designSystem}</span>
          </div>
        </Section>

        <div className="text-[10px] text-[#6e7b8b] pt-2 border-t border-[#1a2332]">
          <span suppressHydrationWarning>Deploy hace {timeAgo(project.deployedAt)}</span> · Construido por la fábrica
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] font-bold tracking-widest text-[#6e7b8b] mb-1.5 font-mono">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function BigStat({ label, value, sub, subColor }: { label: string; value: string; sub: string; subColor: string }) {
  return (
    <div className="flex items-center justify-between bg-[#070b0f] rounded p-2">
      <span className="text-[10px] text-[#6e7b8b] font-mono">{label}</span>
      <div className="text-right">
        <div className="text-sm font-bold text-[#c9d1d9] font-mono">{value}</div>
        <div className={`text-[9px] font-mono ${subColor}`}>{sub}</div>
      </div>
    </div>
  );
}
