"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Save, Trash2, Plus } from "lucide-react";

const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
  { value: "healthy",   label: "ESTABLE",    color: "text-[#39d353]" },
  { value: "degraded",  label: "DEGRADADO",  color: "text-[#f0c000]" },
  { value: "deploying", label: "DEPLOYANDO", color: "text-[#58a6ff]" },
  { value: "down",      label: "CAÍDO",      color: "text-[#f85149]" },
];

const DESIGN_SYSTEMS = ["gradient-mesh", "neobrutalism", "liquid-glass", "bento-grid", "neumorphism", "dark-os", "otro"];

function genId() {
  return "p-" + Math.random().toString(36).slice(2, 8);
}

function blankProject(): Project {
  return {
    id: genId(),
    name: "",
    slug: "",
    description: "",
    status: "healthy",
    url: "",
    repoUrl: "",
    stack: [],
    designSystem: "gradient-mesh",
    uptimeSeconds: 0,
    uptimePct: 99.9,
    revenueCents: 0,
    revenueGrowthPct: 0,
    activeUsers: 0,
    conversionPct: 0,
    deployedAt: new Date(),
    lastCommit: "",
    lastCommitAt: new Date(),
    guardianEnabled: false,
    errorsLast24h: 0,
    p95LatencyMs: 0,
  };
}

export function ProjectForm({ projectId, onClose }: { projectId: string | "new"; onClose: () => void }) {
  const { projects, updateProject, addProject, deleteProject } = useStore();
  const isNew = projectId === "new";
  const source = isNew ? blankProject() : (projects.find((p) => p.id === projectId) ?? blankProject());

  const [form, setForm] = useState<Project>({ ...source });
  const [stackInput, setStackInput] = useState(source.stack.join(", "));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = isNew ? blankProject() : (projects.find((p) => p.id === projectId) ?? blankProject());
    setForm({ ...p });
    setStackInput(p.stack.join(", "));
    setSaved(false);
  }, [projectId]);

  const set = (field: keyof Project, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  function handleSave() {
    const final: Project = {
      ...form,
      stack: stackInput.split(",").map((s) => s.trim()).filter(Boolean),
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
    };
    if (isNew) {
      addProject(final);
    } else {
      updateProject(form.id, final);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (isNew) onClose();
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar "${form.name}"?`)) return;
    deleteProject(form.id);
    onClose();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Form header */}
      <div className="flex items-center justify-between p-3 border-b border-[#1a2332] shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-[#6e7b8b] font-mono">
          {isNew ? "NUEVO PROYECTO" : "EDITAR PROYECTO"}
        </span>
        <div className="flex items-center gap-2">
          {!isNew && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-[9px] font-mono text-[#f85149] hover:text-[#ff6b6b] px-2 py-1 border border-[#f85149]/30 rounded hover:border-[#f85149]/60 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> ELIMINAR
            </button>
          )}
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1 text-[9px] font-mono px-2 py-1 border rounded transition-all",
              saved
                ? "border-[#39d353]/60 text-[#39d353] bg-[#1a6630]/20"
                : "border-[#58a6ff]/40 text-[#58a6ff] hover:bg-[#1a3a5c]/30"
            )}
          >
            <Save className="w-3 h-3" /> {saved ? "GUARDADO ✓" : "GUARDAR"}
          </button>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">

        {/* Identificación */}
        <Section title="IDENTIFICACIÓN">
          <div className="grid grid-cols-2 gap-2">
            <Field label="NOMBRE">
              <Input value={form.name} onChange={(v) => set("name", v)} placeholder="Mi App" />
            </Field>
            <Field label="SLUG">
              <Input value={form.slug} onChange={(v) => set("slug", v)} placeholder="mi-app" />
            </Field>
          </div>
          <Field label="DESCRIPCIÓN">
            <Input value={form.description} onChange={(v) => set("description", v)} placeholder="Qué hace esta app" />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="URL LIVE">
              <Input value={form.url} onChange={(v) => set("url", v)} placeholder="https://miapp.com" />
            </Field>
            <Field label="REPO URL">
              <Input value={form.repoUrl} onChange={(v) => set("repoUrl", v)} placeholder="https://github.com/..." />
            </Field>
          </div>
          <Field label="STATUS">
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => set("status", s.value)}
                  className={cn(
                    "text-[9px] font-bold font-mono px-2 py-1 rounded border transition-colors tracking-wider",
                    form.status === s.value
                      ? `${s.color} border-current bg-current/10`
                      : "text-[#6e7b8b] border-[#1a2332] hover:border-[#1f3044]"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* Stack */}
        <Section title="STACK">
          <Field label="TECNOLOGÍAS (separadas por coma)">
            <Input
              value={stackInput}
              onChange={setStackInput}
              placeholder="Next.js, Supabase, Polar"
            />
          </Field>
          <Field label="DESIGN SYSTEM">
            <select
              value={form.designSystem}
              onChange={(e) => set("designSystem", e.target.value)}
              className="w-full bg-[#070b0f] border border-[#1a2332] rounded px-2 py-1.5 text-[11px] text-[#c9d1d9] font-mono focus:outline-none focus:border-[#58a6ff] transition-colors"
            >
              {DESIGN_SYSTEMS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>
        </Section>

        {/* Métricas de negocio */}
        <Section title="MÉTRICAS DE NEGOCIO">
          <div className="grid grid-cols-2 gap-2">
            <Field label="MRR (USD)">
              <NumInput
                value={form.revenueCents / 100}
                onChange={(v) => set("revenueCents", Math.round(v * 100))}
                placeholder="0"
                prefix="$"
              />
            </Field>
            <Field label="CRECIMIENTO MoM (%)">
              <NumInput value={form.revenueGrowthPct} onChange={(v) => set("revenueGrowthPct", v)} placeholder="0" suffix="%" />
            </Field>
            <Field label="USUARIOS ACTIVOS">
              <NumInput value={form.activeUsers} onChange={(v) => set("activeUsers", v)} placeholder="0" />
            </Field>
            <Field label="CONVERSIÓN (%)">
              <NumInput value={form.conversionPct} onChange={(v) => set("conversionPct", v)} placeholder="0.0" step={0.1} suffix="%" />
            </Field>
          </div>
        </Section>

        {/* Confiabilidad */}
        <Section title="CONFIABILIDAD">
          <div className="grid grid-cols-2 gap-2">
            <Field label="UPTIME (%)">
              <NumInput value={form.uptimePct} onChange={(v) => set("uptimePct", v)} placeholder="99.9" step={0.01} suffix="%" />
            </Field>
            <Field label="P95 LATENCIA (ms)">
              <NumInput value={form.p95LatencyMs} onChange={(v) => set("p95LatencyMs", v)} placeholder="200" suffix="ms" />
            </Field>
            <Field label="ERRORES ÚLTIMAS 24H">
              <NumInput value={form.errorsLast24h} onChange={(v) => set("errorsLast24h", v)} placeholder="0" />
            </Field>
            <Field label="UPTIME ACUMULADO (segundos)">
              <NumInput value={form.uptimeSeconds} onChange={(v) => set("uptimeSeconds", v)} placeholder="0" />
            </Field>
          </div>
        </Section>

        {/* Operaciones */}
        <Section title="OPERACIONES">
          <Field label="ÚLTIMO COMMIT">
            <Input value={form.lastCommit} onChange={(v) => set("lastCommit", v)} placeholder="feat: nueva funcionalidad" />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="FECHA DEPLOY">
              <DateInput value={form.deployedAt} onChange={(v) => set("deployedAt", v)} />
            </Field>
            <Field label="FECHA ÚLTIMO COMMIT">
              <DateInput value={form.lastCommitAt} onChange={(v) => set("lastCommitAt", v)} />
            </Field>
          </div>
          <div
            onClick={() => set("guardianEnabled", !form.guardianEnabled)}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded border cursor-pointer transition-colors",
              form.guardianEnabled
                ? "bg-[#1a6630]/20 border-[#39d353]/30 hover:bg-[#1a6630]/30"
                : "bg-[#070b0f] border-[#1a2332] hover:border-[#1f3044]"
            )}
          >
            <div className={cn(
              "w-8 h-4 rounded-full relative transition-colors shrink-0",
              form.guardianEnabled ? "bg-[#39d353]" : "bg-[#1a2332]"
            )}>
              <div className={cn(
                "absolute top-0.5 w-3 h-3 rounded-full bg-[#0d1117] transition-transform",
                form.guardianEnabled ? "translate-x-4" : "translate-x-0.5"
              )} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#c9d1d9] font-mono">GUARDIAN ACTIVO</div>
              <div className="text-[9px] text-[#6e7b8b] font-mono">
                {form.guardianEnabled ? "Monitoreando y auto-fix habilitado" : "Sin monitoreo automático"}
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono mb-2 pb-1 border-b border-[#1a2332]">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[9px] font-bold tracking-wider text-[#6e7b8b] font-mono mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#070b0f] border border-[#1a2332] rounded px-2 py-1.5 text-[11px] text-[#c9d1d9] font-mono placeholder:text-[#3a4452] focus:outline-none focus:border-[#58a6ff] transition-colors"
    />
  );
}

function NumInput({
  value, onChange, placeholder, prefix, suffix, step,
}: {
  value: number; onChange: (v: number) => void; placeholder?: string; prefix?: string; suffix?: string; step?: number;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-2 text-[11px] text-[#6e7b8b] font-mono pointer-events-none">{prefix}</span>}
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        step={step ?? 1}
        className={cn(
          "w-full bg-[#070b0f] border border-[#1a2332] rounded py-1.5 text-[11px] text-[#c9d1d9] font-mono placeholder:text-[#3a4452] focus:outline-none focus:border-[#58a6ff] transition-colors",
          prefix ? "pl-5 pr-2" : suffix ? "pl-2 pr-7" : "px-2"
        )}
      />
      {suffix && <span className="absolute right-2 text-[11px] text-[#6e7b8b] font-mono pointer-events-none">{suffix}</span>}
    </div>
  );
}

function DateInput({ value, onChange }: { value: Date; onChange: (v: Date) => void }) {
  const iso = value instanceof Date && !isNaN(value.getTime())
    ? value.toISOString().slice(0, 16)
    : "";
  return (
    <input
      type="datetime-local"
      value={iso}
      onChange={(e) => onChange(new Date(e.target.value))}
      className="w-full bg-[#070b0f] border border-[#1a2332] rounded px-2 py-1.5 text-[11px] text-[#c9d1d9] font-mono focus:outline-none focus:border-[#58a6ff] transition-colors"
    />
  );
}
