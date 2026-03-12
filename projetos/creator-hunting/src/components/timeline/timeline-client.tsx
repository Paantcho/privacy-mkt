"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, X, ChevronDown, Check } from "lucide-react";
import { ANALISTAS, CANAIS, STATUS_LIST, STATUS_STYLE, type Creator } from "@/types/creator";

interface Props { creators: Creator[] }

/* ── Helpers ────────────────────────────────────────────────────── */
function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diffMs / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1)  return "agora mesmo";
  if (m < 60) return `há ${m} min`;
  if (h < 24) return `há ${h}h`;
  if (d === 1) return "ontem";
  if (d < 7)  return `há ${d} dias`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatDateLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

/* ── Dropdown de filtro — sobre fundo laranja ───────────────────── */
function FilterDropdown({
  label, options, value, onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = !!value;
  const displayLabel = value ? (options.find((o) => o.value === value)?.label ?? label) : label;

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Sobre laranja: branco sólido quando ativo, semi-transparente quando inativo */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        initial={false}
        animate={{
          backgroundColor: isActive ? "#FFFFFF" : "rgba(35,32,31,0.12)",
          color: "#23201F",
        }}
        whileHover={!isActive ? { backgroundColor: "rgba(255,255,255,0.30)" } : undefined}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-1.5 rounded-[20px] px-4 py-2 text-[13px] font-bold whitespace-nowrap"
      >
        {displayLabel}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          style={{ opacity: isActive ? 0.5 : 0.6 }}
        >
          <ChevronDown size={12} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: [0, 0, 0.2, 1] }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[170px] overflow-hidden rounded-[14px] bg-white py-1.5"
            style={{ border: "1px solid rgba(35,32,31,0.08)" }}
          >
            {/* "Todos" sempre visível */}
            <motion.button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              whileHover={{ backgroundColor: "#F4EEE5" }}
              transition={{ duration: 0.1 }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold"
              style={{ color: !value ? "#F68D3D" : "#A08E7E" }}
            >
              <span className="w-4 shrink-0">
                {!value && <Check size={12} />}
              </span>
              Todos
            </motion.button>
            <div className="mx-3 mb-1 h-px" style={{ background: "rgba(35,32,31,0.06)" }} />
            {options.map((opt) => (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value === value ? "" : opt.value); setOpen(false); }}
                whileHover={{ backgroundColor: "#F4EEE5" }}
                transition={{ duration: 0.1 }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold text-ink-500"
              >
                <span className="w-4 shrink-0" style={{ color: "#F68D3D" }}>
                  {opt.value === value && <Check size={12} />}
                </span>
                {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────── */
export function TimelineClient({ creators }: Props) {
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [canal, setCanal] = useState("");
  const [analista, setAnalista] = useState("");
  const [status, setStatus] = useState("");

  /* Anos disponíveis dinamicamente */
  const anosDisponiveis = useMemo(() => {
    const anos = [...new Set(creators.map((c) => String(new Date(c.created_at).getFullYear())))];
    return anos.sort((a, b) => Number(b) - Number(a));
  }, [creators]);

  /* Creators filtrados */
  const filtered = useMemo(() => {
    return creators.filter((c) => {
      const d = new Date(c.created_at);
      if (ano    && String(d.getFullYear())      !== ano)     return false;
      if (mes    && String(d.getMonth())          !== mes)     return false;
      if (canal  && c.canal                       !== canal)   return false;
      if (analista && c.analista                  !== analista) return false;
      if (status && c.status                      !== status)  return false;
      return true;
    });
  }, [creators, ano, mes, canal, analista, status]);

  /* Agrupado por dia */
  const grouped = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const groups: Record<string, Creator[]> = {};
    sorted.forEach((c) => {
      const key = new Date(c.created_at).toDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return Object.entries(groups).map(([key, items]) => ({
      key, label: formatDateLabel(items[0].created_at), items,
    }));
  }, [filtered]);

  const hasFilters = ano || mes || canal || analista || status;

  function clearAll() { setAno(""); setMes(""); setCanal(""); setAnalista(""); setStatus(""); }

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[28px] font-bold text-ink-500">Histórico</h1>
        <p className="mt-0.5 text-[14px] font-semibold text-[#A08E7E]">
          Histórico cronológico de prospecções
        </p>
      </div>

      {/* ── Barra de filtros — fundo laranja, dropdowns em linha ───── */}
      <div className="mb-4 rounded-[20px] px-4 py-3" style={{ background: "#F68D3D" }}>
        <div
          className="flex items-center gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <FilterDropdown
            label="Ano"
            value={ano}
            onChange={setAno}
            options={anosDisponiveis.map((a) => ({ label: a, value: a }))}
          />

          <div className="h-4 w-px shrink-0" style={{ background: "rgba(35,32,31,0.18)" }} />

          <FilterDropdown
            label="Mês"
            value={mes}
            onChange={setMes}
            options={MONTHS.map((m, idx) => ({ label: m, value: String(idx) }))}
          />

          <div className="h-4 w-px shrink-0" style={{ background: "rgba(35,32,31,0.18)" }} />

          <FilterDropdown
            label="Canal"
            value={canal}
            onChange={setCanal}
            options={CANAIS.map((c) => ({ label: c, value: c }))}
          />

          <div className="h-4 w-px shrink-0" style={{ background: "rgba(35,32,31,0.18)" }} />

          <FilterDropdown
            label="Analista"
            value={analista}
            onChange={setAnalista}
            options={ANALISTAS.map((a) => ({ label: a, value: a }))}
          />

          <div className="h-4 w-px shrink-0" style={{ background: "rgba(35,32,31,0.18)" }} />

          <FilterDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_LIST.map((s) => ({ label: s, value: s }))}
          />

          {/* Limpar filtros — visível no fundo laranja */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                type="button"
                onClick={clearAll}
                whileHover={{ backgroundColor: "rgba(35,32,31,0.12)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="ml-auto flex shrink-0 items-center gap-1 rounded-[20px] px-3 py-2 text-[12px] font-bold"
                style={{ color: "#23201F" }}
              >
                <X size={11} />
                Limpar
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Contador quando filtrado — sobre fundo laranja */}
        <AnimatePresence>
          {hasFilters && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-2 pt-2 text-[12px] font-semibold"
              style={{
                borderTop: "1px solid rgba(35,32,31,0.15)",
                color: "rgba(35,32,31,0.65)",
              }}
            >
              <span className="font-bold" style={{ color: "#23201F" }}>{filtered.length}</span>
              {" "}de {creators.length} registros
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Feed cronológico ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-[20px] bg-white py-20"
        >
          <Clock size={32} className="mb-3 text-[#A08E7E]" />
          <p className="text-[15px] font-semibold text-[#A08E7E]">
            {hasFilters ? "Nenhum resultado com esses filtros." : "Nenhum registro ainda."}
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-5">
          {grouped.map(({ key, label, items }, gi) => (
            <div key={key}>
              {/* Separador de data */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, ease: [0, 0, 0.2, 1], delay: gi * 0.05 }}
                className="mb-3 flex items-center gap-3"
              >
                <div className="h-px flex-1" style={{ background: "rgba(35,32,31,0.08)" }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#A08E7E]">
                  {label}
                </span>
                <div className="h-px flex-1" style={{ background: "rgba(35,32,31,0.08)" }} />
              </motion.div>

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {items.map((c, i) => {
                  const ss = STATUS_STYLE[c.status];
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.22,
                        ease: [0, 0, 0.2, 1],
                        delay: gi * 0.05 + Math.min(i * 0.03, 0.18),
                      }}
                      className="flex items-center gap-4 rounded-[16px] bg-white px-5 py-3.5"
                    >
                      {/* Dot semântico */}
                      <div className="h-2 w-2 shrink-0 rounded-pill" style={{ backgroundColor: ss.dot }} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-ink-500 truncate">
                            {c.perfil_handle || c.nome || "Creator sem @"}
                          </span>
                          {c.nome && c.perfil_handle && (
                            <>
                              <ArrowRight size={11} className="text-[#A08E7E] shrink-0" />
                              <span className="text-[13px] font-semibold text-[#A08E7E] truncate">{c.nome}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0 text-[12px] font-semibold text-[#A08E7E]">
                          <span>{c.canal}</span>
                          {c.analista && <><span>·</span><span>{c.analista}</span></>}
                          {c.segmento !== "—" && <><span>·</span><span>{c.segmento}</span></>}
                          {c.tier !== "—" && <><span>·</span><span>{c.tier}</span></>}
                        </div>
                      </div>

                      {/* Status badge — cores semânticas */}
                      <div
                        className="shrink-0 flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-[12px] font-bold"
                        style={{ backgroundColor: ss.bg, color: ss.color }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: ss.dot }} />
                        {c.status}
                      </div>

                      {/* Tempo */}
                      <span className="shrink-0 text-[12px] font-semibold text-[#A08E7E]">
                        {timeAgo(c.created_at)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
