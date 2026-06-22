export type ProjectStatus = "healthy" | "degraded" | "down" | "deploying";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  url: string;
  repoUrl: string;
  stack: string[];
  designSystem: string;
  uptimeSeconds: number;
  uptimePct: number;
  revenueCents: number;
  revenueGrowthPct: number;
  activeUsers: number;
  conversionPct: number;
  deployedAt: Date;
  lastCommit: string;
  lastCommitAt: Date;
  guardianEnabled: boolean;
  errorsLast24h: number;
  p95LatencyMs: number;
}

export type PatternCategory = "design" | "stack" | "feature" | "acquisition" | "pricing";
export type PatternConfidence = "proven" | "likely" | "experimental";

export interface BrainPattern {
  id: string;
  title: string;
  description: string;
  category: PatternCategory;
  confidence: PatternConfidence;
  confidencePct: number;
  evidence: string;
  projectCount: number;
  avgConversionPct: number | null;
  revenueImpact: string | null;
  tags: string[];
  discoveredAt: Date;
}

export type AlertSeverity = "critical" | "warning" | "info";
export type AlertType = "error_spike" | "build_failed" | "pr_opened" | "deploy" | "revenue" | "conversion";

export interface GuardianAlert {
  id: string;
  projectId: string;
  projectName: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  detail: string;
  autoFixAvailable: boolean;
  prUrl: string | null;
  prStatus: "open" | "merged" | "closed" | null;
  createdAt: Date;
  resolvedAt: Date | null;
}

export interface DemoStore {
  isDemo: boolean;
  setDemo: (v: boolean) => void;
  selectedProjectId: string | null;
  setSelectedProject: (id: string | null) => void;
  brainFilter: PatternCategory | "all";
  setBrainFilter: (f: PatternCategory | "all") => void;
}

// ── Task Runner / Agent Harness ─────────────────────────────────
export type TaskStatus = "queued" | "running" | "waiting_approval" | "done" | "failed";
export type TaskAgent = "guardian" | "brain" | "acquisition" | "portfolio" | "compliance";

export interface AgentTask {
  id: string;
  agent: TaskAgent;
  title: string;
  detail: string;
  status: TaskStatus;
  projectId?: string;
  projectName?: string;
  progress?: number;       // 0-100
  startedAt?: Date;
  completedAt?: Date;
  approvalRequired: boolean;
  approvalPrompt?: string;
  result?: string;
  prUrl?: string;
}

// ── Agent Full Config ────────────────────────────────────────────
export interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: "read" | "write" | "external" | "ai";
  enabled: boolean;
  dangerous?: boolean;
}

export interface AgentAction {
  id: string;
  name: string;
  description: string;
  requiresApproval: boolean;
  enabled: boolean;
}

export interface AgentSkillRef {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface AgentMemory {
  contextWindow: number;
  retainHistory: boolean;
  historyDepth: number;
  crossProjectMemory: boolean;
  factoryBrainAccess: boolean;
}

export interface AgentFullConfig {
  agent: TaskAgent;
  label: string;
  model: string;
  maxTokens: number;
  systemPrompt: string;
  humanApprovalRequired: boolean;
  tools: AgentTool[];
  actions: AgentAction[];
  skills: AgentSkillRef[];
  memory: AgentMemory;
}

// ── Chat con Agentes ────────────────────────────────────────────
export type AgentType = "general" | "portfolio" | "guardian" | "brain" | "acquisition";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  agentType: AgentType;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface AgentConfig {
  type: AgentType;
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
}
