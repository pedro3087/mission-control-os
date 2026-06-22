"use client";
import { useStore } from "@/lib/store";
import { ProjectForm } from "./ProjectForm";
import { StatusDot } from "@/components/StatusDot";
import { formatRevenue } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function ProjectsSettings() {
  const { projects, editingProjectId, setEditingProjectId } = useStore();

  return (
    <div className="flex h-full min-h-0">
      {/* Project list */}
      <div className="w-56 border-r border-[#1a2332] flex flex-col shrink-0">
        <div className="p-2 border-b border-[#1a2332] flex items-center justify-between">
          <span className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono">
            {projects.length} PROYECTOS
          </span>
          <button
            onClick={() => setEditingProjectId("new")}
            className={cn(
              "flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors",
              editingProjectId === "new"
                ? "border-[#39d353]/60 text-[#39d353] bg-[#1a6630]/20"
                : "border-[#1a2332] text-[#6e7b8b] hover:border-[#58a6ff]/40 hover:text-[#58a6ff]"
            )}
          >
            <Plus className="w-2.5 h-2.5" /> NUEVO
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setEditingProjectId(p.id)}
              className={cn(
                "w-full text-left px-2.5 py-2 border-b border-[#1a2332] hover:bg-[#0d1117] transition-colors",
                editingProjectId === p.id && "bg-[#0d1117] border-l-2 border-l-[#58a6ff]"
              )}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <StatusDot status={p.status} />
                <span className="text-[11px] font-bold text-[#c9d1d9] truncate">{p.name}</span>
              </div>
              <div className="text-[9px] text-[#6e7b8b] font-mono flex items-center gap-2">
                <span>{formatRevenue(p.revenueCents)} MRR</span>
                <span>{p.activeUsers} users</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 min-w-0">
        {editingProjectId ? (
          <ProjectForm
            key={editingProjectId}
            projectId={editingProjectId}
            onClose={() => setEditingProjectId(null)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="text-[#6e7b8b] font-mono text-[11px]">
              Selecciona un proyecto para editar
              <br />
              o crea uno nuevo
            </div>
            <button
              onClick={() => setEditingProjectId("new")}
              className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#58a6ff] border border-[#58a6ff]/30 px-3 py-1.5 rounded hover:bg-[#1a3a5c]/30 transition-colors"
            >
              <Plus className="w-3 h-3" /> NUEVO PROYECTO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
