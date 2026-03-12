"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Search, Download, Flame, CheckCircle2, Users, XCircle, TrendingUp, RefreshCw, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ANALISTAS, PAISES, STATUS_LIST, TIERS, SEGMENTOS,
  type Creator, type Status,
} from "@/types/creator";
import { NovaProspeccaoForm } from "./nova-prospeccao-form";
import { CreatorsTable } from "./creators-table";

/* ── Tipos ─────────────────────────────────────────────────────── */
interface Props { creators: Creator[] }
type Period = "hoje" | "7d" | "15d" | "30d" | "tudo";
const ACTIVE_STATUSES: Status[] = ["Interessa", "Negociando"];

/* ── Número animado ─────────────────────────────────────────────── */
function AnimatedNumber({ value, color, size = "xl" }: { value: number; color: string; size?: "xl" | "lg" }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    const ctrl = animate(mv, value, { duration: 0.5, ease: [0, 0, 0.2, 1] });
    rounded.on("change", setDisplay);
    prev.current = value;
    return ctrl.stop;
  }, [value, mv, rounded]);

  return (
    <span
      className={`font-bold leading-none tabular-nums ${size === "xl" ? "text-[36px]" : "text-[28px]"}`}
      style={{ color }}
    >
      {display}
    </span>
  );
}

/* ── KPI Card ───────────────────────────────────────────────────── */
function KpiCard({
  label, value, icon, color, delay, sub,
}: {
  label: string; value: number; icon: React.ReactNode;
  color: string; delay: number; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0, 0, 0.2, 1], delay }}
      className="rounded-[20px] bg-white p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px]" style={{ backgroundColor: color + "15" }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <AnimatedNumber value={value} color={color} />
      {sub && <p className="mt-1 text-[11px] font-semibold text-[#A08E7E]">{sub}</p>}
    </motion.div>
  );
}

/* ── Pill de filtro — sistema de cores correto ──────────────────── */
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ backgroundColor: active ? "#23201F" : "rgba(0,0,0,0)", color: active ? "#FFFFFF" : "#A08E7E" }}
      whileHover={!active ? { backgroundColor: "rgba(213,203,192,0.4)", color: "#23201F" } : undefined}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-[20px] px-3.5 py-1.5 text-[13px] font-bold"
    >
      {label}
    </motion.button>
  );
}

/* ── Dropdown de filtro — charcoal quando ativo ─────────────────── */
function FilterDropdown({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        initial={false}
        animate={{ backgroundColor: value ? "#23201F" : "rgba(0,0,0,0)", color: value ? "#FFFFFF" : "#A08E7E" }}
        whileHover={!value ? { backgroundColor: "rgba(213,203,192,0.4)", color: "#23201F" } : undefined}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-1.5 rounded-[20px] px-3.5 py-1.5 text-[13px] font-bold"
      >
        {value || label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={12} className="opacity-60" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: [0, 0, 0.2, 1] }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-[12px] bg-white py-1.5"
            style={{ border: "1px solid rgba(35,32,31,0.08)" }}
          >
            <motion.button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              whileHover={{ backgroundColor: "#F4EEE5" }}
              transition={{ duration: 0.1 }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] font-semibold text-[#A08E7E]"
            >
              <span className="w-4 shrink-0">{!value && <Check size={12} className="text-primary-500" />}</span>
              Todos
            </motion.button>
            {options.map((opt) => (
              <motion.button
                key={opt}
                type="button"
                onClick={() => { onChange(opt === value ? "" : opt); setOpen(false); }}
                whileHover={{ backgroundColor: "#F4EEE5" }}
                transition={{ duration: 0.1 }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] font-semibold text-ink-500"
              >
                <span className="w-4 shrink-0">{opt === value && <Check size={12} className="text-primary-500" />}</span>
                {opt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────────── */
function exportCSV(creators: Creator[]) {
  const headers = ["Canal","País","Analista","Nome","Tier","Segmento","Perfil/Link","Contato","Respondido","Status","OBS","Data"];
  const rows = creators.map((c) => [
    c.canal, c.pais, c.analista ?? "", c.nome ?? "",
    c.tier, c.segmento, c.perfil_handle,
    c.contato ? "SIM" : "NÃO", c.respondido ? "SIM" : "NÃO",
    c.status, c.obs ?? "", new Date(c.created_at).toLocaleDateString("pt-BR"),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `prospeccao-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function inPeriod(dateStr: string, period: Period): boolean {
  if (period === "tudo") return true;
  const date = new Date(dateStr); const now = new Date();
  const days = period === "hoje" ? 0 : period === "7d" ? 7 : period === "15d" ? 15 : 30;
  if (days === 0) return date.toDateString() === now.toDateString();
  const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

const PERIODS: { label: string; value: Period }[] = [
  { label: "Hoje", value: "hoje" }, { label: "7 dias", value: "7d" },
  { label: "15 dias", value: "15d" }, { label: "30 dias", value: "30d" },
  { label: "Tudo", value: "tudo" },
];

/* ── Componente principal ───────────────────────────────────────── */
export function PlanilhaClient({ creators }: Props) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [search, setSearch] = useState("");
  const [analista, setAnalista] = useState("");
  const [pais, setPais] = useState("");
  const [status, setStatus] = useState("");
  const [tier, setTier] = useState("");
  const [segmento, setSegmento] = useState("");
  const [period, setPeriod] = useState<Period>("tudo");

  /* Real-time polling a cada 60s */
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true);
      router.refresh();
      setTimeout(() => { setRefreshing(false); setLastUpdate(new Date()); }, 800);
    }, 60_000);
    return () => clearInterval(interval);
  }, [router]);

  const filtered = useMemo(() => creators.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.perfil_handle.toLowerCase().includes(q) && !(c.nome ?? "").toLowerCase().includes(q)) return false;
    }
    if (analista && c.analista !== analista) return false;
    if (pais && c.pais !== pais) return false;
    if (status && c.status !== status) return false;
    if (tier && c.tier !== tier) return false;
    if (segmento && c.segmento !== segmento) return false;
    if (!inPeriod(c.created_at, period)) return false;
    return true;
  }), [creators, search, analista, pais, status, tier, segmento, period]);

  const kpis = useMemo(() => ({
    total: creators.length,
    ativos: creators.filter((c) => ACTIVE_STATUSES.includes(c.status)).length,
    ativados: creators.filter((c) => c.status === "Ativou").length,
    perdidos: creators.filter((c) => c.status === "Não quis" || c.status === "Já tem conta").length,
    taxa: creators.length > 0 ? Math.round((creators.filter((c) => c.status === "Ativou").length / creators.length) * 100) : 0,
  }), [creators]);

  const hasFilters = search || analista || pais || status || tier || segmento || period !== "tudo";

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-ink-500">Prospecção</h1>
          <p className="mt-0.5 text-[14px] font-semibold text-[#A08E7E]">Gestão de creators prospectados</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#A08E7E]">
            <motion.span
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 0.6, ease: "linear", repeat: refreshing ? Infinity : 0 }}
            >
              <RefreshCw size={12} />
            </motion.span>
            <span>{lastUpdate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          {/* Export CSV — ação secundária, visual discreto */}
          <motion.button
            type="button"
            onClick={() => exportCSV(filtered)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex items-center gap-2 rounded-[14px] bg-white px-4 py-2.5 text-[13px] font-bold text-ink-500"
          >
            <Download size={13} />
            Exportar CSV
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3">
        <KpiCard label="Total" value={kpis.total} icon={<Users size={14} />} color="#23201F" delay={0} />
        <KpiCard label="Ativas" value={kpis.ativos} icon={<Flame size={14} />} color="#F68D3D" delay={0.05} sub="Interessa + Negociando" />
        <KpiCard label="Ativadas" value={kpis.ativados} icon={<CheckCircle2 size={14} />} color="#16A34A" delay={0.1} />
        <KpiCard label="Perdidas" value={kpis.perdidos} icon={<XCircle size={14} />} color="#A08E7E" delay={0.15} />
        <KpiCard label="Conversão" value={kpis.taxa} icon={<TrendingUp size={14} />} color="#6D28D9" delay={0.2} sub="% de ativadas" />
      </div>

      {/* Formulário */}
      <NovaProspeccaoForm />

      {/* Barra de filtros */}
      <div className="rounded-[20px] bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Busca */}
          <div className="flex items-center gap-2 rounded-[14px] bg-base-200 px-3 py-2">
            <Search size={13} className="text-[#A08E7E] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="@ ou nome..."
              className="w-36 bg-transparent text-[13px] font-semibold text-ink-500 placeholder:text-[#A08E7E] outline-none"
            />
          </div>

          <div className="h-5 w-px" style={{ background: "rgba(35,32,31,0.08)" }} />

          {/* Pills de analista */}
          <div className="flex items-center gap-0.5 rounded-[16px] bg-base-200 px-1.5 py-1">
            <FilterPill label={`Todos (${creators.length})`} active={!analista} onClick={() => setAnalista("")} />
            {ANALISTAS.map((a) => (
              <FilterPill key={a} label={`${a} (${creators.filter((c) => c.analista === a).length})`} active={analista === a} onClick={() => setAnalista(analista === a ? "" : a)} />
            ))}
          </div>

          <div className="h-5 w-px" style={{ background: "rgba(35,32,31,0.08)" }} />

          {/* Dropdowns de filtro */}
          <FilterDropdown label="Todos países" options={PAISES} value={pais} onChange={setPais} />
          <FilterDropdown label="Todos status" options={STATUS_LIST} value={status} onChange={setStatus} />
          <FilterDropdown label="Todos tiers" options={TIERS.filter((t) => t !== "—")} value={tier} onChange={setTier} />
          <FilterDropdown label="Todos segmentos" options={SEGMENTOS.filter((s) => s !== "—")} value={segmento} onChange={setSegmento} />

          {/* Limpar */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={() => { setSearch(""); setAnalista(""); setPais(""); setStatus(""); setTier(""); setSegmento(""); setPeriod("tudo"); }}
                whileHover={{ color: "#23201F" }}
                className="ml-auto text-[12px] font-bold text-[#A08E7E] underline underline-offset-2"
              >
                Limpar
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Período na segunda linha */}
        <div className="mt-2 flex items-center gap-2 border-t pt-2" style={{ borderColor: "rgba(35,32,31,0.05)" }}>
          <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">Período:</span>
          <div className="flex items-center gap-0.5 rounded-[16px] bg-base-200 px-1.5 py-1">
            {PERIODS.map(({ label, value }) => (
              <FilterPill key={value} label={label} active={period === value} onClick={() => setPeriod(value)} />
            ))}
          </div>
          <span className="ml-auto text-[12px] font-semibold text-[#A08E7E]">
            {filtered.length} de {creators.length}
          </span>
        </div>
      </div>

      {/* Tabela */}
      <CreatorsTable creators={filtered} />
    </div>
  );
}
