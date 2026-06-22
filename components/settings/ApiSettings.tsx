"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Save, ExternalLink } from "lucide-react";

export function ApiSettings() {
  const { apiTokens, setApiTokens, isDemo, setDemo } = useStore();
  const [showTokens, setShowTokens] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...apiTokens });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function handleSave() {
    setApiTokens(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const hasTokens = form.vercelToken || form.githubToken;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">

      {/* Mode toggle */}
      <div>
        <div className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono mb-2 pb-1 border-b border-[#1a2332]">
          MODO DE OPERACIÓN
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ModeCard
            active={isDemo}
            onClick={() => setDemo(true)}
            title="MODO DEMO"
            desc="Datos de ejemplo. Sin APIs. Ideal para presentaciones."
            color="text-[#f0c000]"
            activeBg="bg-[#6b5500]/20 border-[#f0c000]/40"
          />
          <ModeCard
            active={!isDemo}
            onClick={() => setDemo(false)}
            title="MODO LIVE"
            desc="Datos reales desde Vercel API y GitHub. Requiere tokens."
            color="text-[#39d353]"
            activeBg="bg-[#1a6630]/20 border-[#39d353]/40"
            disabled={!hasTokens}
          />
        </div>
        {!hasTokens && (
          <p className="text-[9px] text-[#f0c000] font-mono mt-1.5">
            ⚠ Agrega al menos el Vercel Token para activar modo LIVE
          </p>
        )}
      </div>

      {/* Vercel */}
      <div>
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#1a2332]">
          <span className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono">VERCEL</span>
          <a
            href="https://vercel.com/account/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[9px] text-[#58a6ff] font-mono hover:underline"
          >
            Obtener token <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        <TokenField
          label="VERCEL API TOKEN"
          value={form.vercelToken}
          onChange={(v) => set("vercelToken", v)}
          placeholder="VTxxxxxxxxxxxxxxxxxx"
          show={showTokens}
          hint="Proyectos, deployment status, uptime"
        />
      </div>

      {/* GitHub */}
      <div>
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#1a2332]">
          <span className="text-[9px] font-bold tracking-widest text-[#6e7b8b] font-mono">GITHUB</span>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[9px] text-[#58a6ff] font-mono hover:underline"
          >
            Obtener token <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        <div className="space-y-2">
          <TokenField
            label="GITHUB TOKEN"
            value={form.githubToken}
            onChange={(v) => set("githubToken", v)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            show={showTokens}
            hint="PRs de Guardian y auto-fix"
          />
          <div>
            <label className="text-[9px] font-bold tracking-wider text-[#6e7b8b] font-mono mb-1 block">
              GITHUB USERNAME / ORG
            </label>
            <input
              type="text"
              value={form.githubOwner}
              onChange={(e) => set("githubOwner", e.target.value)}
              placeholder="pedro2g"
              className="w-full bg-[#070b0f] border border-[#1a2332] rounded px-2 py-1.5 text-[11px] text-[#c9d1d9] font-mono placeholder:text-[#3a4452] focus:outline-none focus:border-[#58a6ff] transition-colors"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold tracking-wider text-[#6e7b8b] font-mono mb-1 block">
              REPOS A MONITOREAR (separados por coma)
            </label>
            <input
              type="text"
              value={form.githubRepos}
              onChange={(e) => set("githubRepos", e.target.value)}
              placeholder="nuestraoferta, ridepg, fractals-os"
              className="w-full bg-[#070b0f] border border-[#1a2332] rounded px-2 py-1.5 text-[11px] text-[#c9d1d9] font-mono placeholder:text-[#3a4452] focus:outline-none focus:border-[#58a6ff] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#1a2332]">
        <button
          onClick={() => setShowTokens(!showTokens)}
          className="flex items-center gap-1.5 text-[10px] font-mono text-[#6e7b8b] hover:text-[#c9d1d9] transition-colors"
        >
          {showTokens ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showTokens ? "OCULTAR TOKENS" : "MOSTRAR TOKENS"}
        </button>
        <div className="flex-1" />
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1.5 border rounded transition-all",
            saved
              ? "border-[#39d353]/60 text-[#39d353] bg-[#1a6630]/20"
              : "border-[#58a6ff]/40 text-[#58a6ff] hover:bg-[#1a3a5c]/30"
          )}
        >
          <Save className="w-3 h-3" /> {saved ? "GUARDADO ✓" : "GUARDAR CONFIGURACIÓN"}
        </button>
      </div>

      <div className="text-[9px] text-[#3a4452] font-mono">
        Los tokens se guardan en localStorage de tu navegador. Nunca se envían a ningún servidor externo.
      </div>
    </div>
  );
}

function ModeCard({
  active, onClick, title, desc, color, activeBg, disabled,
}: {
  active: boolean; onClick: () => void; title: string; desc: string;
  color: string; activeBg: string; disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={!!disabled}
      className={cn(
        "p-2.5 rounded border text-left transition-all",
        active ? activeBg : "bg-[#070b0f] border-[#1a2332] hover:border-[#1f3044]",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <div className={cn("text-[10px] font-bold font-mono tracking-widest mb-1", active ? color : "text-[#6e7b8b]")}>
        {active && "▶ "}{title}
      </div>
      <div className="text-[9px] text-[#6e7b8b] font-mono leading-relaxed">{desc}</div>
    </button>
  );
}

function TokenField({
  label, value, onChange, placeholder, show, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; show: boolean; hint: string;
}) {
  return (
    <div>
      <label className="text-[9px] font-bold tracking-wider text-[#6e7b8b] font-mono mb-1 block">{label}</label>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#070b0f] border border-[#1a2332] rounded px-2 py-1.5 text-[11px] text-[#c9d1d9] font-mono placeholder:text-[#3a4452] focus:outline-none focus:border-[#58a6ff] transition-colors"
      />
      <p className="text-[9px] text-[#3a4452] font-mono mt-0.5">{hint}</p>
    </div>
  );
}
