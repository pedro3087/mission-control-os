"use client";
import { DEMO_PATTERNS } from "@/lib/fixtures";
import { PatternCard } from "./PatternCard";
import { useStore } from "@/lib/store";
import type { PatternCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: { key: PatternCategory | "all"; label: string }[] = [
  { key: "all",         label: "TODO" },
  { key: "design",      label: "DESIGN" },
  { key: "stack",       label: "STACK" },
  { key: "feature",     label: "FEATURE" },
  { key: "acquisition", label: "ADQUISICIÓN" },
  { key: "pricing",     label: "PRICING" },
];

export function BrainPanel() {
  const { brainFilter, setBrainFilter } = useStore();

  const filtered = brainFilter === "all"
    ? DEMO_PATTERNS
    : DEMO_PATTERNS.filter((p) => p.category === brainFilter);

  const provenCount = DEMO_PATTERNS.filter((p) => p.confidence === "proven").length;
  const avgConfidence = Math.round(DEMO_PATTERNS.reduce((s, p) => s + p.confidencePct, 0) / DEMO_PATTERNS.length);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-[#1a2332] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#6e7b8b] font-mono">FACTORY BRAIN</span>
          <span className="text-[10px] text-[#6e7b8b] font-mono">{DEMO_PATTERNS.length} patrones</span>
        </div>

        {/* Brain stats */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <BrainStat label="PATRONES" value={DEMO_PATTERNS.length.toString()} color="text-[#bc8cff]" />
          <BrainStat label="PROBADOS" value={provenCount.toString()} color="text-[#39d353]" />
          <BrainStat label="CONF. PROM" value={`${avgConfidence}%`} color="text-[#f0c000]" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map((f) => {
            const count = f.key === "all"
              ? DEMO_PATTERNS.length
              : DEMO_PATTERNS.filter((p) => p.category === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setBrainFilter(f.key)}
                className={cn(
                  "text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider transition-colors",
                  brainFilter === f.key
                    ? "bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/40"
                    : "bg-[#1a2332] text-[#6e7b8b] border border-transparent hover:border-[#1f3044]"
                )}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.map((p) => (
          <PatternCard key={p.id} pattern={p} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-[#6e7b8b] text-[11px] font-mono mt-8">
            Aún no hay patrones en esta categoría.
            <br />Lanza más proyectos para alimentar el brain.
          </div>
        )}
      </div>
    </div>
  );
}

function BrainStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#070b0f] rounded p-1.5 text-center">
      <div className="text-[9px] text-[#6e7b8b] font-mono tracking-wider mb-0.5">{label}</div>
      <div className={`text-sm font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}
