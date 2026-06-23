import { OS } from "./design-tokens";

export const PAIN_LINES = [
  { text: "8 proyectos SaaS en produccion.", color: OS.text, delayFrames: 30 },
  { text: "12 pestanas abiertas. Vercel. GitHub. Stripe. Analytics.", color: OS.yellow, delayFrames: 90 },
  { text: "Un error critico a las 2am.", color: OS.red, delayFrames: 150 },
  { text: "¿Cual proyecto? ¿Que lo causo?", color: OS.red, delayFrames: 210 },
];

export const PROBLEMS = [
  { title: "Sin visibilidad unificada", body: "El contexto se pierde al saltar entre herramientas.", borderColor: OS.red },
  { title: "El conocimiento no se acumula", body: "Lo que funciona en un producto queda en tu cabeza.", borderColor: OS.yellow },
  { title: "Respuesta manual y lenta", body: "Detectar, diagnosticar, fixear, abrir PR. No escala.", borderColor: OS.red },
];

export const KPIS = [
  { label: "MRR TOTAL", value: 13200, prefix: "$", suffix: "", color: OS.green, format: "currency" as const },
  { label: "USUARIOS ACTIVOS", value: 3257, prefix: "", suffix: "", color: OS.blue, format: "number" as const },
  { label: "PROYECTOS", value: 8, prefix: "", suffix: "", color: OS.purple, format: "integer" as const },
  { label: "UPTIME PROMEDIO", value: 99.9, prefix: "", suffix: "%", color: OS.green, format: "decimal" as const },
];

export const FEATURE_SLIDES = [
  { image: "screenshots/01-standard.png", title: "Vista unificada", body: "Revenue, usuarios, uptime, errores — todo en tiempo real." },
  { image: "screenshots/03-brain.png", title: "Factory Brain", body: "12 patrones aprendidos entre proyectos. El conocimiento se acumula." },
  { image: "screenshots/04-ops.png", title: "Guardian Auto-fix", body: "Detecta errores, genera el fix, abre el PR. Sin intervencion humana." },
  { image: "screenshots/05-chat.png", title: "5 agentes de IA", body: "OS · Portfolio · Guardian · Brain · Acquisition — con contexto real." },
];

export type AlertSeverity = "critical" | "warning" | "info" | "resolved";

export const GUARDIAN_ENTRIES: {
  severity: AlertSeverity;
  project: string;
  title: string;
  detail: string;
  prBadge?: { status: "open" | "merged"; delayFrames: number };
}[] = [
  { severity: "info", project: "NuestraOferta", title: "Deploy succeeded en 47s", detail: "Build cache hit 94%. Zero errors." },
  { severity: "warning", project: "Dental Mgmt", title: "P95 latency degraded a 1240ms", detail: "Missing index on clinic_id. Branching fix..." },
  { severity: "critical", project: "Meridian Real Estate", title: "Error rate 2400% above baseline", detail: "TypeError en /api/listings — 412 errors in 2h", prBadge: { status: "open", delayFrames: 30 } },
  { severity: "resolved", project: "RidePG", title: "Guardian auto-fix merged", detail: "null guard en driver.location — 0 errors since.", prBadge: { status: "merged", delayFrames: 0 } },
];

export const SCENE_FRAMES = {
  pain: 300,
  agitation: 210,
  reveal: 210,
  kpis: 300,
  features: 660,
  guardian: 300,
  cta: 270,
} as const;

export const TOTAL_FRAMES = Object.values(SCENE_FRAMES).reduce((a, b) => a + b, 0);

// ── Video 2: Agents ─────────────────────────────────────────────

export const AGENTS_SCENE_FRAMES = {
  intro: 240,
  incident: 300,
  autofix: 360,
  opsCenter: 300,
  agentConfig: 240,
  agentGrid: 210,
  cta: 150,
} as const;

export const AGENTS_TOTAL_FRAMES = Object.values(AGENTS_SCENE_FRAMES).reduce((a, b) => a + b, 0);

export const AUTOFIX_STEPS = [
  { agent: "GUARDIAN", text: "Analizando stack trace...", color: OS.red },
  { agent: "GUARDIAN", text: "Root cause: null check missing en listing.lat", color: OS.red },
  { agent: "GUARDIAN", text: "Branching fix en nueva rama...", color: OS.yellow },
  { agent: "GUARDIAN", text: 'Commit: "fix: add null guard on listing.lat"', color: OS.green },
  { agent: "GUARDIAN", text: "Pull Request #42 creado", color: OS.blue },
  { agent: "GUARDIAN", text: "Esperando aprobacion humana", color: OS.yellow },
];

export const AGENT_CARDS = [
  { label: "OS AGENT", color: OS.purple, description: "Orquesta todo el portafolio" },
  { label: "PORTFOLIO", color: OS.blue, description: "Revenue, KPIs, crecimiento" },
  { label: "GUARDIAN", color: OS.red, description: "Errores, auto-fix, PRs" },
  { label: "BRAIN", color: OS.purple, description: "Patrones entre proyectos" },
  { label: "ACQUISITION", color: OS.green, description: "Trafico, SEO, usuarios" },
];
