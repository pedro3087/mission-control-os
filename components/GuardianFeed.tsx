"use client";
import { useEffect, useState } from "react";
import { DEMO_ALERTS } from "@/lib/fixtures";
import type { GuardianAlert, AlertSeverity } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, Info, GitPullRequest, ExternalLink, Zap } from "lucide-react";

const severityConfig: Record<AlertSeverity, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  critical: {
    icon: <AlertTriangle className="w-3 h-3" />,
    color: "text-[#f85149]",
    bg: "bg-[#5c1f1f]/20",
    border: "border-[#f85149]/30",
  },
  warning: {
    icon: <AlertTriangle className="w-3 h-3" />,
    color: "text-[#f0c000]",
    bg: "bg-[#6b5500]/20",
    border: "border-[#f0c000]/30",
  },
  info: {
    icon: <Info className="w-3 h-3" />,
    color: "text-[#58a6ff]",
    bg: "bg-[#1a3a5c]/20",
    border: "border-[#58a6ff]/30",
  },
};

const NEW_ALERT_TEMPLATES = [
  { severity: "info" as AlertSeverity, type: "deploy", project: "NuestraOferta", title: "Deploy succeeded in 47s", detail: "Build cache hit 94%. Zero regression errors detected." },
  { severity: "warning" as AlertSeverity, type: "conversion", project: "Pipe0.1", title: "Conversion drop detected", detail: "Signup conversion fell 1.2% in last 30min. Investigating checkout flow." },
  { severity: "info" as AlertSeverity, type: "revenue", project: "FractalOS", title: "New subscriber — $49/mo plan", detail: "Guardian logged first paid conversion since deploy 2h ago." },
  { severity: "critical" as AlertSeverity, type: "error_spike", project: "RidePG", title: "TypeError in /api/drivers", detail: "3 occurrences in 5min. Guardian branching fix now." },
];

export function GuardianFeed() {
  const [alerts, setAlerts] = useState<GuardianAlert[]>(DEMO_ALERTS);
  const [tick, setTick] = useState(0);

  // Simulate new alerts arriving
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (tick === 0) return;
    const template = NEW_ALERT_TEMPLATES[tick % NEW_ALERT_TEMPLATES.length];
    const newAlert: GuardianAlert = {
      id: `live-${tick}`,
      projectId: "p-live",
      projectName: template.project,
      severity: template.severity,
      type: template.type as GuardianAlert["type"],
      title: template.title,
      detail: template.detail,
      autoFixAvailable: template.severity === "critical",
      prUrl: template.severity === "critical" ? "https://github.com/pedro2g/example/pull/99" : null,
      prStatus: null,
      createdAt: new Date(),
      resolvedAt: null,
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 20));
  }, [tick]);

  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.resolvedAt).length;
  const warningCount = alerts.filter((a) => a.severity === "warning" && !a.resolvedAt).length;
  const autoFixCount = alerts.filter((a) => a.autoFixAvailable).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-[#1a2332] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-[#6e7b8b] font-mono">GUARDIAN · EN VIVO</span>
            <span className="flex items-center gap-1 text-[9px] text-[#39d353] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39d353] pulse-green inline-block" />
              ACTIVO
            </span>
          </div>
          <span className="text-[10px] text-[#6e7b8b] font-mono">auto-fix ACTIVO</span>
        </div>

        {/* Alert stats */}
        <div className="grid grid-cols-3 gap-1.5">
          <AlertStat label="CRÍTICO" value={criticalCount.toString()} color={criticalCount > 0 ? "text-[#f85149]" : "text-[#6e7b8b]"} />
          <AlertStat label="ALERTA" value={warningCount.toString()} color={warningCount > 0 ? "text-[#f0c000]" : "text-[#6e7b8b]"} />
          <AlertStat label="AUTO-FIX" value={autoFixCount.toString()} color="text-[#bc8cff]" />
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {alerts.map((alert, i) => (
          <AlertRow key={alert.id} alert={alert} isNew={i === 0 && tick > 0} />
        ))}
      </div>
    </div>
  );
}

function AlertRow({ alert, isNew }: { alert: GuardianAlert; isNew: boolean }) {
  const s = severityConfig[alert.severity];

  return (
    <div className={cn(
      "rounded border p-2.5 transition-all",
      s.bg, s.border,
      isNew && "slide-in",
      alert.resolvedAt && "opacity-50"
    )}>
      <div className="flex items-start gap-2">
        <span className={cn("mt-0.5 shrink-0", s.color)}>{s.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[11px] font-bold text-[#c9d1d9] truncate">{alert.title}</span>
            <span className="text-[9px] text-[#6e7b8b] font-mono shrink-0" suppressHydrationWarning>{timeAgo(alert.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className={cn("text-[9px] font-bold font-mono tracking-wider", s.color)}>{alert.projectName}</span>
            {alert.resolvedAt && <span className="text-[9px] text-[#39d353] font-mono">RESOLVED</span>}
          </div>
          <p className="text-[10px] text-[#6e7b8b] leading-relaxed">{alert.detail}</p>

          {/* Actions */}
          {(alert.autoFixAvailable || alert.prUrl) && (
            <div className="flex items-center gap-2 mt-1.5">
              {alert.autoFixAvailable && !alert.prUrl && (
                <span className="flex items-center gap-1 text-[9px] text-[#bc8cff] font-mono">
                  <Zap className="w-2.5 h-2.5" />
                  BRANCHING FIX...
                </span>
              )}
              {alert.prUrl && (
                <a href={alert.prUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[9px] font-mono hover:underline"
                  style={{ color: alert.prStatus === "merged" ? "#39d353" : "#58a6ff" }}
                >
                  <GitPullRequest className="w-2.5 h-2.5" />
                  PR {alert.prStatus === "merged" ? "MERGED" : alert.prStatus === "open" ? "ABIERTO — revisar" : "CLOSED"}
                  <ExternalLink className="w-2 h-2" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#070b0f] rounded p-1.5 text-center">
      <div className="text-[9px] text-[#6e7b8b] font-mono tracking-wider mb-0.5">{label}</div>
      <div className={`text-sm font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}
