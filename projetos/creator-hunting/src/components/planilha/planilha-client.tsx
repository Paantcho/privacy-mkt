"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Download, Flame, CheckCircle2 } from "lucide-react";
import {
  ANALISTAS, PAISES, STATUS_LIST, TIERS, SEGMENTOS,
  type Creator, type Status,
} from "@/types/creator";
import { NovaProspeccaoForm } from "./nova-prospeccao-form";
import { CreatorsTable } from "./creators-table";

interface Props {
  creators: Creator[];
}

const ACTIVE_STATUSES: Status[] = ["Interessa", "Negociando"];
const PILL_BTN =
  "rounded-[20px] px-3.5 py-1.5 text-[13px] font-bold transition-colors duration-150";

type Period = "hoje" | "7d" | "15d" | "30d" | "tudo";

function exportCSV(creators: Creator[]) {
  const headers = [
    "Canal","País","Analista","Nome","Tier","Segmento",
    "Perfil/Link","Contato","Respondido","Status","OBS","Data",
  ];
  const rows = creators.map((c) => [
    c.canal, c.pais, c.analista ?? "", c.nome ?? "",
    c.tier, c.segmento, c.perfil_handle,
    c.contato ? "SIM" : "NÃO",
    c.respondido ? "SIM" : "NÃO",
    c.status, c.obs ?? "",
    new Date(c.created_at).toLocaleDateString("pt-BR"),
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `creator-hunting-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function inPeriod(dateStr: string, period: Period): boolean {
  if (period === "tudo") return true;
  const date = new Date(dateStr);
  const now = new Date();
  const days = period === "hoje" ? 0 : period === "7d" ? 7 : period === "15d" ? 15 : 30;
  if (days === 0) {
    return date.toDateString() === now.toDateString();
  }
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

export function PlanilhaClient({ creators }: Props) {
  const [search, setSearch] = useState("");
  const [analista, setAnalista] = useState<string>("");
  const [pais, setPais] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [tier, setTier] = useState<string>("");
  const [segmento, setSegmento] = useState<string>("");
  const [period, setPeriod] = useState<Period>("tudo");

  const filtered = useMemo(() => {
    return creators.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          c.perfil_handle.toLowerCase().includes(q) ||
          (c.nome ?? "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (analista && c.analista !== analista) return false;
      if (pais && c.pais !== pais) return false;
      if (status && c.status !== status) return false;
      if (tier && c.tier !== tier) return false;
      if (segmento && c.segmento !== segmento) return false;
      if (!inPeriod(c.created_at, period)) return false;
      return true;
    });
  }, [creators, search, analista, pais, status, tier, segmento, period]);

  const stats = useMemo(() => ({
    total: creators.length,
    ativos: creators.filter((c) => ACTIVE_STATUSES.includes(c.status)).length,
    ativados: creators.filter((c) => c.status === "Ativou").length,
  }), [creators]);

  const PERIODS: { label: string; value: Period }[] = [
    { label: "Hoje",   value: "hoje" },
    { label: "7 dias", value: "7d" },
    { label: "15 dias", value: "15d" },
    { label: "30 dias", value: "30d" },
    { label: "Tudo",   value: "tudo" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header stats */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">Total</p>
          <p className="text-[32px] font-bold leading-none text-ink-500">{stats.total}</p>
        </div>
        <div
          className="h-8 w-px"
          style={{ background: "rgba(35,32,31,0.08)" }}
        />
        <div>
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">
            <Flame size={11} className="text-primary-500" /> Ativas
          </p>
          <p className="text-[32px] font-bold leading-none text-primary-500">{stats.ativos}</p>
        </div>
        <div
          className="h-8 w-px"
          style={{ background: "rgba(35,32,31,0.08)" }}
        />
        <div>
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">
            <CheckCircle2 size={11} className="text-green-600" /> Ativadas
          </p>
          <p className="text-[32px] font-bold leading-none text-green-600">{stats.ativados}</p>
        </div>

        {/* Export CSV */}
        <div className="ml-auto">
          <motion.button
            type="button"
            onClick={() => exportCSV(filtered)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex items-center gap-2 rounded-[14px] bg-white px-4 py-2.5 text-[13px] font-bold text-ink-500"
          >
            <Download size={14} />
            Exportar CSV
          </motion.button>
        </div>
      </div>

      {/* Formulário nova prospecção */}
      <NovaProspeccaoForm />

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Busca */}
        <div className="flex items-center gap-2 rounded-[20px] bg-white px-3.5 py-2">
          <Search size={13} className="text-[#A08E7E] shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="@ ou nome..."
            className="w-36 bg-transparent text-[13px] font-semibold text-ink-500 placeholder:text-[#A08E7E] outline-none"
          />
        </div>

        {/* Pills de analista */}
        <div className="flex items-center gap-1 rounded-[20px] bg-white px-2 py-1">
          <motion.button
            type="button"
            onClick={() => setAnalista("")}
            whileHover={analista !== "" ? { backgroundColor: "rgba(213,203,192,0.4)" } : undefined}
            whileTap={{ scale: 0.97 }}
            className={PILL_BTN + (analista === "" ? " bg-primary-500 text-white" : " text-[#A08E7E]")}
          >
            Todos ({creators.length})
          </motion.button>
          {ANALISTAS.map((a) => {
            const count = creators.filter((c) => c.analista === a).length;
            return (
              <motion.button
                key={a}
                type="button"
                onClick={() => setAnalista(analista === a ? "" : a)}
                whileHover={analista !== a ? { backgroundColor: "rgba(213,203,192,0.4)" } : undefined}
                whileTap={{ scale: 0.97 }}
                className={PILL_BTN + (analista === a ? " bg-primary-500 text-white" : " text-[#A08E7E]")}
              >
                {a} ({count})
              </motion.button>
            );
          })}
        </div>

        {/* Filtro país */}
        <FilterDropdown
          label={pais || "Todos países"}
          options={PAISES}
          value={pais}
          onChange={setPais}
        />

        {/* Filtro status */}
        <FilterDropdown
          label={status || "Todos status"}
          options={STATUS_LIST}
          value={status}
          onChange={setStatus}
        />

        {/* Filtro tier */}
        <FilterDropdown
          label={tier || "Todos tiers"}
          options={TIERS.filter((t) => t !== "—")}
          value={tier}
          onChange={setTier}
        />

        {/* Filtro segmento */}
        <FilterDropdown
          label={segmento || "Todos segmentos"}
          options={SEGMENTOS.filter((s) => s !== "—")}
          value={segmento}
          onChange={setSegmento}
        />
      </div>

      {/* Período */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">
          Período:
        </span>
        <div className="flex items-center gap-1 rounded-[20px] bg-white px-2 py-1">
          {PERIODS.map(({ label, value }) => (
            <motion.button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              whileHover={period !== value ? { backgroundColor: "rgba(213,203,192,0.4)" } : undefined}
              whileTap={{ scale: 0.97 }}
              className={PILL_BTN + (period === value ? " bg-primary-500 text-white" : " text-[#A08E7E]")}
            >
              {label}
            </motion.button>
          ))}
        </div>

        <span className="ml-auto text-[12px] font-semibold text-[#A08E7E]">
          {filtered.length} de {creators.length}
        </span>
      </div>

      {/* Tabela */}
      <CreatorsTable creators={filtered} />
    </div>
  );
}

/* ── Dropdown de filtro reutilizável ───────────────────────────── */

import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
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
        whileHover={{ backgroundColor: "rgba(244,238,229,0.8)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
        className={`flex items-center gap-1.5 rounded-[20px] bg-white px-3.5 py-2 text-[13px] font-bold transition-colors ${
          value ? "text-primary-600" : "text-[#A08E7E]"
        }`}
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
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
              <span className="w-3.5 shrink-0">
                {!value && <span className="text-primary-500">✓</span>}
              </span>
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
                <span className="w-3.5 shrink-0">
                  {opt === value && <span className="text-primary-500">✓</span>}
                </span>
                {opt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
