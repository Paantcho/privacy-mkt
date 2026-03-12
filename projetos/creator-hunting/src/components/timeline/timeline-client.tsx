"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, Check, X } from "lucide-react";
import { ANALISTAS, CANAIS, STATUS_LIST, STATUS_STYLE, type Creator } from "@/types/creator";

interface Props { creators: Creator[] }

/* ── Helpers ────────────────────────────────────────────────────── */
function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diffMs / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1)   return "agora mesmo";
  if (m < 60)  return `há ${m}min`;
  if (h < 24)  return `há ${h}h`;
  if (d === 1) return "ontem";
  if (d < 7)   return `há ${d} dias`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatDayLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

/* ── Dropdown via Portal — evita corte por overflow do layout ────── */
function FilterDropdown({
  label, options, value, onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isActive = !!value;
  const displayLabel = isActive
    ? (options.find((o) => o.value === value)?.label ?? label)
    : label;

  function openMenu() {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setCoords({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onOut(e: MouseEvent) {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onScroll() { setOpen(false); }
    document.addEventListener("mousedown", onOut);
    document.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onOut);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.14, ease: [0, 0, 0.2, 1] }}
          style={{
            position: "absolute",
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
            minWidth: 180,
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid rgba(35,32,31,0.08)",
            padding: "6px 0",
          }}
        >
          <motion.button
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            whileHover={{ backgroundColor: "#F4EEE5" }}
            transition={{ duration: 0.1 }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold"
            style={{ color: !value ? "#F68D3D" : "#A08E7E" }}
          >
            <span className="w-4 shrink-0" style={{ color: "#F68D3D" }}>
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
  );

  return (
    <div className="relative shrink-0">
      <motion.button
        ref={btnRef}
        type="button"
        onClick={openMenu}
        initial={false}
        animate={{
          backgroundColor: isActive ? "#F68D3D" : "rgba(246,141,61,0.18)",
          color: isActive ? "#FFFFFF" : "#C96B1A",
        }}
        whileHover={!isActive ? { backgroundColor: "rgba(246,141,61,0.30)" } : { opacity: 0.9 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-1.5 rounded-[20px] px-4 py-2 text-[13px] font-bold whitespace-nowrap"
      >
        {displayLabel}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="opacity-70"
        >
          <ChevronDown size={12} />
        </motion.span>
      </motion.button>
      {typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────── */
export function TimelineClient({ creators }: Props) {
  const [ano, setAno]         = useState("");
  const [mes, setMes]         = useState("");
  const [canal, setCanal]     = useState("");
  const [analista, setAnalista] = useState("");
  const [status, setStatus]   = useState("");

  const anosDisponiveis = useMemo(() => {
    const set = new Set(creators.map((c) => String(new Date(c.created_at).getFullYear())));
    return [...set].sort((a, b) => Number(b) - Number(a));
  }, [creators]);

  const filtered = useMemo(() => creators.filter((c) => {
    const d = new Date(c.created_at);
    if (ano      && String(d.getFullYear()) !== ano)      return false;
    if (mes      && String(d.getMonth())    !== mes)      return false;
    if (canal    && c.canal                !== canal)     return false;
    if (analista && c.analista             !== analista)  return false;
    if (status   && c.status               !== status)   return false;
    return true;
  }), [creators, ano, mes, canal, analista, status]);

  /* Agrupa por dia */
  const grouped = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const map: Record<string, Creator[]> = {};
    sorted.forEach((c) => {
      const k = new Date(c.created_at).toDateString();
      if (!map[k]) map[k] = [];
      map[k].push(c);
    });
    return Object.entries(map).map(([k, items]) => ({
      k, dayLabel: formatDayLabel(items[0].created_at), items,
    }));
  }, [filtered]);

  const hasFilters = !!(ano || mes || canal || analista || status);
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

      {/* ── Barra de filtros — laranja muito claro (subtom) ─────────── */}
      <div
        className="mb-4 rounded-[20px] px-4 py-3"
        style={{ background: "rgba(246,141,61,0.10)" }}
      >
        <div
          className="flex items-center gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <FilterDropdown
            label="Ano" value={ano} onChange={setAno}
            options={anosDisponiveis.map((a) => ({ label: a, value: a }))}
          />
          <div className="h-4 w-px shrink-0" style={{ background: "rgba(246,141,61,0.30)" }} />
          <FilterDropdown
            label="Mês" value={mes} onChange={setMes}
            options={MONTHS.map((m, i) => ({ label: m, value: String(i) }))}
          />
          <div className="h-4 w-px shrink-0" style={{ background: "rgba(246,141,61,0.30)" }} />
          <FilterDropdown
            label="Canal" value={canal} onChange={setCanal}
            options={CANAIS.map((c) => ({ label: c, value: c }))}
          />
          <div className="h-4 w-px shrink-0" style={{ background: "rgba(246,141,61,0.30)" }} />
          <FilterDropdown
            label="Analista" value={analista} onChange={setAnalista}
            options={ANALISTAS.map((a) => ({ label: a, value: a }))}
          />
          <div className="h-4 w-px shrink-0" style={{ background: "rgba(246,141,61,0.30)" }} />
          <FilterDropdown
            label="Status" value={status} onChange={setStatus}
            options={STATUS_LIST.map((s) => ({ label: s, value: s }))}
          />

          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                type="button"
                onClick={clearAll}
                whileHover={{ backgroundColor: "rgba(246,141,61,0.20)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="ml-auto flex shrink-0 items-center gap-1 rounded-[20px] px-3 py-2 text-[12px] font-bold"
                style={{ color: "#C96B1A" }}
              >
                <X size={11} />
                Limpar
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {hasFilters && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-2 pt-2 text-[12px] font-semibold"
              style={{
                borderTop: "1px solid rgba(246,141,61,0.20)",
                color: "#C96B1A",
              }}
            >
              <span className="font-bold" style={{ color: "#D97A33" }}>{filtered.length}</span>
              {" "}de {creators.length} registros
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Feed ────────────────────────────────────────────────────── */}
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
        <div className="flex flex-col gap-3">
          {grouped.map(({ k, dayLabel, items }, gi) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: [0, 0, 0.2, 1], delay: gi * 0.05 }}
              className="overflow-hidden rounded-[20px] bg-white"
            >
              {/* Data dentro do bloco */}
              <div
                className="px-5 py-2.5"
                style={{ borderBottom: "1px solid rgba(35,32,31,0.05)" }}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#A08E7E]">
                  {dayLabel}
                </span>
              </div>

              {/* Entradas do dia */}
              {items.map((c, i) => {
                const ss = STATUS_STYLE[c.status];
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: [0, 0, 0.2, 1],
                      delay: gi * 0.05 + Math.min(i * 0.03, 0.15),
                    }}
                    className="flex items-center gap-3 px-5 py-3.5"
                    style={{
                      borderBottom: i < items.length - 1
                        ? "1px solid rgba(35,32,31,0.04)"
                        : undefined,
                    }}
                  >
                    {/* Dot de status */}
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: ss.dot }}
                    />

                    {/* Identidade */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0">
                        <span className="text-[14px] font-bold text-ink-500">
                          {c.perfil_handle || "sem @"}
                        </span>
                        {c.nome && (
                          <span className="text-[13px] font-semibold text-[#A08E7E]">
                            · {c.nome}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[12px] font-semibold text-[#BBA998]">
                        <span>{c.canal}</span>
                        {c.analista && <><span>·</span><span>{c.analista}</span></>}
                        {c.segmento !== "—" && <><span>·</span><span>{c.segmento}</span></>}
                        {c.tier !== "—" && <><span>·</span><span>{c.tier}</span></>}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      className="shrink-0 flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-[12px] font-bold"
                      style={{ backgroundColor: ss.bg, color: ss.color }}
                    >
                      {c.status}
                    </div>

                    {/* Tempo */}
                    <span className="shrink-0 text-[11px] font-semibold text-[#BBA998]">
                      {timeAgo(c.created_at)}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
