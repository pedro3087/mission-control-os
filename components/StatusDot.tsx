"use client";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/types";

const config: Record<ProjectStatus, { dot: string; label: string; color: string }> = {
  healthy:   { dot: "pulse-green",  label: "ESTABLE",    color: "text-[#39d353]" },
  degraded:  { dot: "pulse-yellow", label: "DEGRADADO",  color: "text-[#f0c000]" },
  down:      { dot: "pulse-red",    label: "DOWN",       color: "text-[#f85149]" },
  deploying: { dot: "pulse-yellow", label: "DEPLOYING",  color: "text-[#58a6ff]" },
};

const dotColor: Record<ProjectStatus, string> = {
  healthy:   "bg-[#39d353]",
  degraded:  "bg-[#f0c000]",
  down:      "bg-[#f85149]",
  deploying: "bg-[#58a6ff]",
};

export function StatusDot({ status, showLabel = false }: { status: ProjectStatus; showLabel?: boolean }) {
  const c = config[status];
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full inline-block", dotColor[status], c.dot)} />
      {showLabel && <span className={cn("text-[10px] font-bold tracking-widest", c.color)}>{c.label}</span>}
    </span>
  );
}
