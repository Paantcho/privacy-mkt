"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, X } from "lucide-react";
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

/* ── Chip de filtro com scroll ──────────────────────────────────── */
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{
        backgroundColor: active ? "#23201F" : "rgba(0,0,0,0)",
        color: active ? "#FFFFFF" : "#A08E7E",
      }}
      whileHover={!active ? { backgroundColor: "rgba(213,203,192,0.40)", color: "#23201F" } : undefined}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className="shrink-0 rounded-[20px] px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap"
    >
      {label}
    </motion.button>
  );
}

/* ── Grupo de filtros com scroll horizontal ─────────────────────── */
function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.5px] text-[#C9B9A8]">
        {label}
      </span>
      {/* Container com scroll horizontal e scrollbar invisível */}
      <div
        ref={ref}
        className="flex items-center gap-0.5 overflow-x-auto rounded-[16px] px-1.5 py-1"
        style={{
          background: "rgba(35,32,31,0.05)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>
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

      {/* ── Barra de filtros — scroll horizontal ─────────────────── */}
      <div className="mb-4 rounded-[20px] bg-white p-3">
        {/* Scroll container externo */}
        <div
          className="flex items-center gap-4 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Ano */}
          <FilterGroup label="Ano">
            {anosDisponiveis.map((a) => (
              <FilterChip key={a} label={a} active={ano === a} onClick={() => setAno(ano === a ? "" : a)} />
            ))}
          </FilterGroup>

          {/* Separador */}
          <div className="h-5 w-px shrink-0" style={{ background: "rgba(35,32,31,0.08)" }} />

          {/* Mês */}
          <FilterGroup label="Mês">
            {MONTHS.map((m, idx) => (
              <FilterChip
                key={idx}
                label={m.slice(0, 3)}
                active={mes === String(idx)}
                onClick={() => setMes(mes === String(idx) ? "" : String(idx))}
              />
            ))}
          </FilterGroup>

          <div className="h-5 w-px shrink-0" style={{ background: "rgba(35,32,31,0.08)" }} />

          {/* Canal */}
          <FilterGroup label="Canal">
            {CANAIS.map((c) => (
              <FilterChip key={c} label={c} active={canal === c} onClick={() => setCanal(canal === c ? "" : c)} />
            ))}
          </FilterGroup>

          <div className="h-5 w-px shrink-0" style={{ background: "rgba(35,32,31,0.08)" }} />

          {/* Analista */}
          <FilterGroup label="Analista">
            {ANALISTAS.map((a) => (
              <FilterChip key={a} label={a} active={analista === a} onClick={() => setAnalista(analista === a ? "" : a)} />
            ))}
          </FilterGroup>

          <div className="h-5 w-px shrink-0" style={{ background: "rgba(35,32,31,0.08)" }} />

          {/* Status */}
          <FilterGroup label="Status">
            {STATUS_LIST.map((s) => (
              <FilterChip key={s} label={s} active={status === s} onClick={() => setStatus(status === s ? "" : s)} />
            ))}
          </FilterGroup>

          {/* Limpar */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                type="button"
                onClick={clearAll}
                whileHover={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444" }}
                transition={{ duration: 0.15 }}
                className="ml-2 flex shrink-0 items-center gap-1 rounded-[20px] px-3 py-1.5 text-[12px] font-bold text-[#A08E7E]"
              >
                <X size={11} />
                Limpar
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Contador de resultados */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 pt-2"
              style={{ borderTop: "1px solid rgba(35,32,31,0.05)" }}
            >
              <p className="text-[12px] font-semibold text-[#A08E7E]">
                <span className="font-bold text-ink-500">{filtered.length}</span> de {creators.length} registros
              </p>
            </motion.div>
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
