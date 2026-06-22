"use client";
import { useEffect, useState } from "react";
import { OSHeader } from "@/components/OSHeader";
import { PortfolioPanel } from "@/components/PortfolioPanel";
import { BrainPanel } from "@/components/BrainPanel";
import { GuardianFeed } from "@/components/GuardianFeed";
import { ChatBubble } from "@/components/ChatBubble";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { TasksOverlay } from "@/components/TasksOverlay";
import { StoreHydrator } from "@/components/StoreHydrator";
import { useStore } from "@/lib/store";
import type { DashboardView } from "@/lib/store";

const VIEW_WIDTHS: Record<DashboardView, { portfolio: string; brain: string; guardian: string }> = {
  standard:  { portfolio: "w-[340px]", brain: "flex-1",    guardian: "w-[320px]" },
  portfolio: { portfolio: "flex-1",    brain: "w-[280px]", guardian: "w-[240px]" },
  brain:     { portfolio: "w-[220px]", brain: "flex-1",    guardian: "w-[220px]" },
  ops:       { portfolio: "w-[220px]", brain: "w-[280px]", guardian: "flex-1"    },
};

const VIEW_LABELS: Record<DashboardView, { portfolio: string; brain: string; guardian: string }> = {
  standard:  { portfolio: "PORTFOLIO",         brain: "FACTORY BRAIN",     guardian: "GUARDIAN · EN VIVO" },
  portfolio: { portfolio: "PORTFOLIO · FOCUS", brain: "FACTORY BRAIN",     guardian: "GUARDIAN" },
  brain:     { portfolio: "PORTFOLIO",         brain: "FACTORY BRAIN · FOCUS", guardian: "GUARDIAN" },
  ops:       { portfolio: "PORTFOLIO",         brain: "FACTORY BRAIN",     guardian: "GUARDIAN · FOCUS" },
};

export default function MissionControl() {
  const dashboardViewFromStore = useStore((s) => s.dashboardView);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  // Use default until client-side store has hydrated to avoid SSR mismatch
  const dashboardView: DashboardView = mounted ? dashboardViewFromStore : "standard";
  const widths = VIEW_WIDTHS[dashboardView];
  const labels = VIEW_LABELS[dashboardView];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#070b0f]">
      <StoreHydrator />
      <OSHeader />

      {/* 3-panel OS layout + overlays */}
      <div className="flex flex-1 min-h-0 relative">
        <SettingsOverlay />
        <TasksOverlay />

        <PanelWrapper label={labels.portfolio} width={widths.portfolio} borderRight>
          <PortfolioPanel />
        </PanelWrapper>

        <PanelWrapper label={labels.brain} width={widths.brain} borderRight>
          <BrainPanel />
        </PanelWrapper>

        <PanelWrapper label={labels.guardian} width={widths.guardian}>
          <GuardianFeed />
        </PanelWrapper>
      </div>

      <ChatBubble />

      {/* OS status bar */}
      <footer className="h-5 bg-[#0d1117] border-t border-[#1a2332] flex items-center px-3 gap-4 shrink-0">
        <span className="text-[9px] font-mono text-[#6e7b8b]">SaaS Factory OS v5.0</span>
        <span className="text-[9px] font-mono text-[#6e7b8b]">·</span>
        <span className="text-[9px] font-mono text-[#6e7b8b]">8 proyectos · 3,257 usuarios · $1,323 MRR</span>
        <span className="flex-1" />
        <span className="text-[9px] font-mono text-[#6e7b8b]">guardian activo · auto-fix ON · brain aprendiendo</span>
      </footer>
    </div>
  );
}

function PanelWrapper({
  label, width, borderRight, children,
}: {
  label: string;
  width: string;
  borderRight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${width} flex flex-col min-h-0 ${borderRight ? "border-r border-[#1a2332]" : ""} transition-all duration-300`}>
      <div className="h-6 flex items-center px-3 border-b border-[#1a2332] bg-[#070b0f] shrink-0">
        <span className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono">{label}</span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
