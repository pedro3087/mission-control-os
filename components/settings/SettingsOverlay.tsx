"use client";
import { useStore } from "@/lib/store";
import type { SettingsSection } from "@/lib/store";
import { ProjectsSettings } from "./ProjectsSettings";
import { ApiSettings } from "./ApiSettings";
import { cn } from "@/lib/utils";
import { X, Layers, Link, Info, RotateCcw } from "lucide-react";

const NAV: { key: SettingsSection; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "projects", label: "PROYECTOS", icon: <Layers className="w-3.5 h-3.5" />, desc: "Agrega y edita tu portfolio" },
  { key: "apis",     label: "CONEXIONES", icon: <Link className="w-3.5 h-3.5" />,   desc: "Vercel API, GitHub, tokens" },
  { key: "about",    label: "ACERCA DE",  icon: <Info className="w-3.5 h-3.5" />,   desc: "SaaS Factory OS v5.0" },
];

export function SettingsOverlay() {
  const { isSettingsOpen, setSettingsOpen, settingsSection, setSettingsSection, projects } = useStore();

  if (!isSettingsOpen) return null;

  return (
    <div className="absolute inset-0 bg-[#070b0f] flex flex-col z-20 fade-in">
      {/* Settings header */}
      <div className="h-9 bg-[#0d1117] border-b border-[#1a2332] flex items-center px-3 gap-3 shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-[#6e7b8b] font-mono">CONFIGURACIÓN</span>
        <div className="w-px h-4 bg-[#1a2332]" />
        <span className="text-[9px] text-[#6e7b8b] font-mono">{projects.length} proyectos configurados</span>
        <div className="flex-1" />
        <button
          onClick={() => setSettingsOpen(false)}
          className="flex items-center gap-1.5 text-[9px] font-mono text-[#6e7b8b] hover:text-[#c9d1d9] border border-[#1a2332] hover:border-[#1f3044] px-2 py-0.5 rounded transition-colors"
        >
          <X className="w-3 h-3" /> CERRAR
        </button>
      </div>

      {/* Body: nav + content */}
      <div className="flex flex-1 min-h-0">
        {/* Left nav */}
        <nav className="w-44 border-r border-[#1a2332] flex flex-col shrink-0 bg-[#070b0f]">
          <div className="flex-1 p-2 space-y-0.5">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setSettingsSection(item.key)}
                className={cn(
                  "w-full flex items-start gap-2.5 px-2.5 py-2 rounded text-left transition-colors",
                  settingsSection === item.key
                    ? "bg-[#0d1117] border border-[#1a2332]"
                    : "hover:bg-[#0d1117]/50 border border-transparent"
                )}
              >
                <span className={cn("mt-0.5 shrink-0", settingsSection === item.key ? "text-[#58a6ff]" : "text-[#6e7b8b]")}>
                  {item.icon}
                </span>
                <div>
                  <div className={cn(
                    "text-[10px] font-bold font-mono tracking-wider",
                    settingsSection === item.key ? "text-[#c9d1d9]" : "text-[#6e7b8b]"
                  )}>
                    {item.label}
                  </div>
                  <div className="text-[9px] text-[#3a4452] font-mono">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Reset to demo */}
          <div className="p-2 border-t border-[#1a2332]">
            <ResetButton />
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          {settingsSection === "projects" && <ProjectsSettings />}
          {settingsSection === "apis" && <ApiSettings />}
          {settingsSection === "about" && <AboutSection />}
        </div>
      </div>
    </div>
  );
}

function ResetButton() {
  const { resetProjects } = useStore();

  function handleReset() {
    if (!confirm("¿Restaurar proyectos de demo? Se perderán los cambios.")) return;
    resetProjects();
  }

  return (
    <button
      onClick={handleReset}
      className="w-full flex items-center gap-1.5 text-[9px] font-mono text-[#3a4452] hover:text-[#6e7b8b] transition-colors px-1 py-1"
    >
      <RotateCcw className="w-2.5 h-2.5" /> RESTAURAR DEMO
    </button>
  );
}

function AboutSection() {
  return (
    <div className="p-5 space-y-4">
      <div>
        <div className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono mb-2 pb-1 border-b border-[#1a2332]">
          ACERCA DE
        </div>
        <div className="space-y-3">
          <InfoRow label="NOMBRE" value="Mission Control" />
          <InfoRow label="VERSIÓN" value="1.0.0" />
          <InfoRow label="FRAMEWORK" value="SaaS Factory OS v5.0" />
          <InfoRow label="STACK" value="Next.js 16 · React 19 · Zustand · Tailwind" />
          <InfoRow label="CONSTRUIDO POR" value="La fábrica misma ◆" valueColor="text-[#bc8cff]" />
        </div>
      </div>

      <div>
        <div className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono mb-2 pb-1 border-b border-[#1a2332]">
          PANELES
        </div>
        <div className="space-y-1.5 text-[10px] font-mono text-[#6e7b8b]">
          <div><span className="text-[#c9d1d9]">PORTFOLIO</span> — Estado en tiempo real de todos tus proyectos</div>
          <div><span className="text-[#c9d1d9]">FACTORY BRAIN</span> — Patrones aprendidos entre proyectos con evidencia</div>
          <div><span className="text-[#c9d1d9]">GUARDIAN</span> — Alertas en vivo y auto-fix con aprobación humana</div>
        </div>
      </div>

      <div>
        <div className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono mb-2 pb-1 border-b border-[#1a2332]">
          FILOSOFÍA V5
        </div>
        <p className="text-[10px] font-mono text-[#6e7b8b] leading-relaxed">
          La fábrica no termina en "deployado". El loop cierra cuando tienes usuarios reales,
          revenue medible, y el brain global aprende de cada proyecto para hacer el siguiente
          más inteligente. <span className="text-[#c9d1d9]">Cada negocio que parís deja al siguiente más listo.</span>
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-mono text-[#6e7b8b]">{label}</span>
      <span className={cn("text-[10px] font-mono font-bold", valueColor ?? "text-[#c9d1d9]")}>{value}</span>
    </div>
  );
}
