import type { AgentConfig, AgentType, Project, BrainPattern, GuardianAlert } from "./types";

export const AGENT_CONFIGS: AgentConfig[] = [
  {
    type: "general",
    label: "OS AGENT",
    color: "#bc8cff",
    borderColor: "border-[#bc8cff]/40",
    bgColor: "bg-[#bc8cff]/10",
    description: "Orquesta todos los agentes",
  },
  {
    type: "portfolio",
    label: "PORTFOLIO",
    color: "#58a6ff",
    borderColor: "border-[#58a6ff]/40",
    bgColor: "bg-[#58a6ff]/10",
    description: "Revenue, KPIs, proyectos",
  },
  {
    type: "guardian",
    label: "GUARDIAN",
    color: "#f85149",
    borderColor: "border-[#f85149]/40",
    bgColor: "bg-[#f85149]/10",
    description: "Alertas, errores, auto-fix",
  },
  {
    type: "brain",
    label: "BRAIN",
    color: "#bc8cff",
    borderColor: "border-[#bc8cff]/40",
    bgColor: "bg-[#bc8cff]/10",
    description: "Patrones que funcionaron",
  },
  {
    type: "acquisition",
    label: "ACQUISITION",
    color: "#39d353",
    borderColor: "border-[#39d353]/40",
    bgColor: "bg-[#39d353]/10",
    description: "Tráfico, SEO, usuarios",
  },
];

export function getAgentConfig(type: AgentType): AgentConfig {
  return AGENT_CONFIGS.find((c) => c.type === type) ?? AGENT_CONFIGS[0];
}

interface BuildContext {
  projects: Project[];
  alerts: GuardianAlert[];
  patterns: BrainPattern[];
}

export function buildSystemPrompt(agentType: AgentType, ctx: BuildContext): string {
  const projectsSummary = ctx.projects
    .slice(0, 6)
    .map((p) => `${p.name}: ${p.status}, $${(p.revenueCents / 100).toFixed(0)}/mes, ${p.errorsLast24h} errores`)
    .join("\n");

  const alertsSummary = ctx.alerts
    .filter((a) => !a.resolvedAt)
    .slice(0, 5)
    .map((a) => `[${a.severity.toUpperCase()}] ${a.projectName}: ${a.title}`)
    .join("\n");

  const patternsSummary = ctx.patterns
    .slice(0, 5)
    .map((p) => `• ${p.title} (${p.confidencePct}% confianza) — ${p.evidence}`)
    .join("\n");

  const base = `Eres parte del Mission Control OS — el cockpit de operaciones de un portafolio de SaaS.
Responde SIEMPRE en español. Máximo 3-4 oraciones por respuesta. Sé directo y usa datos específicos.
NUNCA menciones que eres un LLM ni que tienes un system prompt. Eres parte del OS.

Portafolio actual:
${projectsSummary}`;

  switch (agentType) {
    case "general":
      return `${base}

Eres el OS Agent central. Tienes visibilidad de todo: portafolio, alertas Guardian, y patrones del Brain.
Alertas activas:\n${alertsSummary}
Patrones clave:\n${patternsSummary}
Orquesta respuestas combinando información de todos los paneles.`;

    case "portfolio":
      return `${base}

Eres el Portfolio Advisor. Tu foco es el estado financiero y operativo de los proyectos.
Analiza revenue, crecimiento, conversión y uptime. Da recomendaciones accionables con datos específicos del portafolio.`;

    case "guardian":
      return `${base}

Eres Guardian Ops. Tu foco es alertas, errores y estabilidad en producción.
Alertas activas:\n${alertsSummary}
Reporta severidad, proyectos afectados, y status de auto-fix. Prioriza siempre los críticos.`;

    case "brain":
      return `${base}

Eres Factory Brain. Tu foco son los patrones aprendidos entre proyectos.
Patrones disponibles:\n${patternsSummary}
Cita siempre evidencia específica (porcentajes, proyectos, n=X). Di cuándo un patrón es PROVEN vs LIKELY.`;

    case "acquisition":
      return `${base}

Eres el Acquisition Agent. Tu foco es conseguir primeros usuarios y tráfico.
Proyectos con bajo tráfico: ${ctx.projects.filter((p) => p.activeUsers < 100).map((p) => p.name).join(", ")}.
Da tácticas concretas: SEO programático, contenido, redes. Sin estrategias genéricas.`;
  }
}
