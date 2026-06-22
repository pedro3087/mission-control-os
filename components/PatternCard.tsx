"use client";
import type { BrainPattern, PatternCategory, PatternConfidence } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

const categoryColors: Record<PatternCategory, string> = {
  design:      "bg-[#1a3a5c] text-[#58a6ff]",
  stack:       "bg-[#1a6630]/40 text-[#39d353]",
  feature:     "bg-[#6b5500]/40 text-[#f0c000]",
  acquisition: "bg-[#3d1f6b]/40 text-[#bc8cff]",
  pricing:     "bg-[#1a3a5c]/40 text-[#39c5cf]",
};

const confidenceConfig: Record<PatternConfidence, { label: string; bar: string }> = {
  proven:       { label: "PROBADO",      bar: "bg-[#39d353]" },
  likely:       { label: "PROBABLE",     bar: "bg-[#f0c000]" },
  experimental: { label: "EXPERIMENTAL", bar: "bg-[#6e7b8b]" },
};

export function PatternCard({ pattern }: { pattern: BrainPattern }) {
  const conf = confidenceConfig[pattern.confidence];

  return (
    <div className="bg-[#0d1117] border border-[#1a2332] rounded p-3 hover:border-[#1f3044] transition-colors fade-in">
      {/* Category + confidence badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded font-mono", categoryColors[pattern.category])}>
          {pattern.category.toUpperCase()}
        </span>
        <span className={cn("text-[9px] font-bold tracking-widest font-mono",
          pattern.confidence === "proven" ? "text-[#39d353]" :
          pattern.confidence === "likely" ? "text-[#f0c000]" : "text-[#6e7b8b]"
        )}>
          {conf.label}
        </span>
      </div>

      {/* Title */}
      <p className="text-[12px] font-bold text-[#c9d1d9] mb-1 leading-tight">{pattern.title}</p>
      <p className="text-[10px] text-[#6e7b8b] mb-2 leading-relaxed line-clamp-2">{pattern.description}</p>

      {/* Confidence bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-[#6e7b8b] font-mono">CONFIANZA</span>
          <span className="text-[9px] font-bold text-[#c9d1d9] font-mono">{pattern.confidencePct}%</span>
        </div>
        <div className="h-1 bg-[#1a2332] rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", conf.bar)}
            style={{ width: `${pattern.confidencePct}%` }}
          />
        </div>
      </div>

      {/* Evidence */}
      <div className="bg-[#070b0f] rounded p-2 mb-2">
        <div className="text-[9px] text-[#6e7b8b] font-mono tracking-wider mb-0.5">EVIDENCIA</div>
        <p className="text-[10px] text-[#c9d1d9] font-mono leading-relaxed">{pattern.evidence}</p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-[9px] font-mono text-[#6e7b8b]">
        <span>{pattern.projectCount} proyecto{pattern.projectCount !== 1 ? "s" : ""}</span>
        {pattern.avgConversionPct && <span className="text-[#39d353]">{pattern.avgConversionPct}% conv avg</span>}
        {pattern.revenueImpact && <span className="text-[#f0c000]">{pattern.revenueImpact}</span>}
        <span className="ml-auto">{timeAgo(pattern.discoveredAt)}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        {pattern.tags.map((t) => (
          <span key={t} className="text-[9px] px-1 py-0.5 bg-[#1a2332] text-[#6e7b8b] rounded font-mono">#{t}</span>
        ))}
      </div>
    </div>
  );
}
