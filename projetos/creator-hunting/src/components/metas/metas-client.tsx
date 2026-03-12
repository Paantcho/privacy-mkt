"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronDown, Check, SlidersHorizontal, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ANALISTAS, type Creator } from "@/types/creator";

interface Props { creators: Creator[] }

/* ── Tipo de meta por analista ─────────────────────────────────── */
interface AnalistaMeta {
  contatosSemana: number;
  cadastrosSemana: number;
  txResposta: number;
  txAtivacao: number;
  focoTier: string;
  tipo: "Volume" | "Qualidade";
}

const DEFAULT_META: AnalistaMeta = {
  contatosSemana: 60,
  cadastrosSemana: 3,
  txResposta: 20,
  txAtivacao: 5,
  focoTier: "T3/T4",
  tipo: "Volume",
};

/* ── Cor do avatar por analista ─────────────────────────────────── */
const AVATAR_COLORS: Record<string, string> = {
  Vitória:  "#F68D3D",
  Stefanie: "#6D28D9",
  Bia:      "#2563EB",
  Mauricio: "#16A34A",
};

/* ── Helpers de data ───────────────────────────────────────────── */
function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(new Date().setDate(diff));
}
function getMonthStart() {
  const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1);
}

/* ── Número animado ─────────────────────────────────────────────── */
function AnimNum({ value, suffix = "", size = 40, color = "#23201F" }: {
  value: number; suffix?: string; size?: number; color?: string;
}) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    const ctrl = animate(mv, value, { duration: 0.55, ease: [0, 0, 0.2, 1] });
    rounded.on("change", setDisplay);
    prev.current = value;
    return ctrl.stop;
  }, [value, mv, rounded]);

  return (
    <span className="tabular-nums font-bold leading-none" style={{ fontSize: size, color }}>
      {display}{suffix}
    </span>
  );
}

/* ── Progress bar ───────────────────────────────────────────────── */
function ProgressBar({ pct, delay }: { pct: number; delay: number }) {
  const clamped = Math.min(pct, 100);
  const color = pct >= 100 ? "#16A34A" : pct >= 65 ? "#F68D3D" : "#D3C4B0";
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-pill" style={{ background: "rgba(35,32,31,0.07)" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay }}
        className="h-full rounded-pill"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

/* ── KPI Box ────────────────────────────────────────────────────── */
type KpiVariant = "neutral" | "orange" | "blue" | "green";

const KPI_VARIANT: Record<KpiVariant, { bg: string; numColor: string; dotColor: string }> = {
  neutral: { bg: "rgba(35,32,31,0.05)",   numColor: "#23201F", dotColor: "#23201F" },
  orange:  { bg: "rgba(246,141,61,0.10)", numColor: "#C96B1A", dotColor: "#F68D3D" },
  blue:    { bg: "rgba(37,99,235,0.07)",  numColor: "#1D4ED8", dotColor: "#3B82F6" },
  green:   { bg: "rgba(22,163,74,0.08)",  numColor: "#15803D", dotColor: "#16A34A" },
};

function KpiBox({ label, value, suffix = "", variant = "neutral" }: {
  label: string; value: number; suffix?: string; variant?: KpiVariant;
}) {
  const v = KPI_VARIANT[variant];
  return (
    <div
      className="flex flex-col rounded-[16px] p-4"
      style={{ background: v.bg }}
    >
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: v.dotColor }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#A08E7E]">{label}</span>
      </div>
      <AnimNum value={value} suffix={suffix} size={40} color={v.numColor} />
    </div>
  );
}

/* ── Card por analista ──────────────────────────────────────────── */
function AnalistaCard({
  analista, stats, meta, onMetaChange, delay,
}: {
  analista: string;
  stats: ReturnType<typeof calcStats>[0];
  meta: AnalistaMeta;
  onMetaChange: (m: AnalistaMeta) => void;
  delay: number;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState<AnalistaMeta>(meta);

  function save() {
    onMetaChange(draft);
    setEditOpen(false);
  }

  const paceGood = stats.vaiAcertar;
  const paceMid  = !paceGood && stats.pctMes >= 50;
  const PaceIcon = paceGood ? TrendingUp : paceMid ? Minus : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0, 0, 0.2, 1], delay }}
      className="overflow-hidden rounded-[24px] bg-white"
    >
      {/* ── Header laranja ────────────────────────────────────────── */}
      {/*
        Regra de contraste sobre laranja saturado:
        - Texto primário   → #23201F carvão puro (contraste ~5:1)
        - Texto secundário → #FFFFFF branco puro (contraste ~3.5:1) — não carvão diluído
        - Nunca rgba(35,32,31,0.x) sobre laranja — vira marrom ilegível
      */}
      <div className="px-6 pt-6 pb-5" style={{ background: "#F68D3D" }}>

        {/* Linha 1 — Avatar + Nome + Badge */}
        <div className="flex items-center gap-3">
          {/* Avatar: carvão sólido para máximo contraste */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[18px] font-bold text-white"
            style={{ backgroundColor: "#23201F" }}
          >
            {analista.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Nome: carvão puro — nível 1 de hierarquia */}
            <p className="text-[24px] font-bold leading-tight" style={{ color: "#23201F" }}>
              {analista}
            </p>
            {/* Foco: branco puro — nível 2, não carvão diluído */}
            <p className="mt-0.5 text-[12px] font-semibold text-white">
              {meta.focoTier || "Foco não definido"}
            </p>
          </div>

          {/* Badge: branco sólido com carvão — destaca sobre o laranja */}
          <div
            className="shrink-0 rounded-[8px] bg-white px-3 py-1.5 text-[12px] font-bold"
            style={{ color: "#23201F" }}
          >
            {meta.tipo}
          </div>
        </div>

        {/* Linha 2 — Pace */}
        <div className="mt-3 flex items-center gap-1.5">
          <PaceIcon
            size={13}
            style={{ color: paceGood ? "#23201F" : "rgba(35,32,31,0.5)" }}
          />
          <span
            className="text-[13px] font-bold"
            style={{ color: paceGood ? "#23201F" : "rgba(35,32,31,0.55)" }}
          >
            {paceGood ? "No ritmo" : paceMid ? "Pace médio" : "Pace abaixo"} —{" "}
          </span>
          <span className="text-[13px] font-semibold" style={{ color: "#23201F" }}>
            {Math.round(stats.pctMes)}% da meta do mês
          </span>
        </div>

        {/* Linha 3 — Barra de progresso */}
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            {/* Label: branco puro, maiúsculo */}
            <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-white opacity-75">
              Prospecções este mês
            </span>
            {/* Números: carvão para o atual (destaque), branco 75% para o limite */}
            <span className="text-[13px] font-bold" style={{ color: "#23201F" }}>
              {stats.mes}
              <span className="font-semibold text-white opacity-70"> / {meta.contatosSemana * 4}</span>
            </span>
          </div>
          {/* Track branco 25%; fill carvão — máximo contraste */}
          <div
            className="relative h-2 w-full overflow-hidden rounded-pill"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.pctMes, 100)}%` }}
              transition={{ duration: 0.85, ease: [0, 0, 0.2, 1], delay: delay + 0.2 }}
              className="h-full rounded-pill"
              style={{ backgroundColor: "#23201F" }}
            />
          </div>
        </div>
      </div>

      {/* ── 4 KPI boxes — metas configuradas ───────────────────────── */}
      <div className="grid grid-cols-4 gap-2 p-4 pb-2">
        <KpiBox label="Contatos / sem" value={meta.contatosSemana} variant="neutral" />
        <KpiBox label="Cadastros / sem" value={meta.cadastrosSemana} variant="orange" />
        <KpiBox label="Tx. resposta" value={meta.txResposta} suffix="%" variant="blue" />
        <KpiBox label="Tx. ativação" value={meta.txAtivacao} suffix="%" variant="green" />
      </div>

      {/* ── Stats reais do banco ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 px-4 pb-4 pt-2">
        {[
          { label: "Esta semana", value: stats.semana },
          { label: "Pace previsto", value: stats.pacePrevisto },
          { label: "Total geral",  value: stats.total },
        ].map(({ label, value }, idx) => (
          <div
            key={label}
            className="flex flex-col items-center py-4"
            style={{
              borderLeft:  idx > 0 ? "1px solid rgba(35,32,31,0.06)" : undefined,
              borderRight: idx < 2 ? "1px solid rgba(35,32,31,0.06)" : undefined,
            }}
          >
            <span className="text-[32px] font-bold leading-none text-ink-500">{value}</span>
            <span className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#A08E7E]">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Toggle edição ───────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => { setDraft(meta); setEditOpen((v) => !v); }}
        whileHover={{ backgroundColor: "rgba(244,238,229,0.6)" }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.12 }}
        className="flex w-full items-center gap-2 px-5 py-3.5"
        style={{ borderTop: "1px solid rgba(35,32,31,0.05)" }}
      >
        <SlidersHorizontal size={13} className="text-[#A08E7E]" />
        <span className="flex-1 text-left text-[12px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">
          Configurar metas
        </span>
        <motion.span animate={{ rotate: editOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-[#A08E7E]" />
        </motion.span>
      </motion.button>

      {/* ── Painel de edição ────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {editOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0, 0, 0.2, 1] }}
            style={{ overflow: "clip" }}
          >
            <div className="px-5 pb-5 pt-1">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <EditField label="Contatos / semana" value={draft.contatosSemana} onChange={(v) => setDraft((d) => ({ ...d, contatosSemana: v }))} />
                <EditField label="Cadastros / semana" value={draft.cadastrosSemana} onChange={(v) => setDraft((d) => ({ ...d, cadastrosSemana: v }))} />
                <EditField label="Meta tx. resposta" value={draft.txResposta} suffix="%" onChange={(v) => setDraft((d) => ({ ...d, txResposta: v }))} />
                <EditField label="Meta tx. ativação" value={draft.txAtivacao} suffix="%" onChange={(v) => setDraft((d) => ({ ...d, txAtivacao: v }))} />
              </div>

              <div className="mb-3 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#A08E7E]">Foco / Tier</label>
                <input
                  value={draft.focoTier}
                  onChange={(e) => setDraft((d) => ({ ...d, focoTier: e.target.value }))}
                  placeholder="Ex: T3/T4/Maternidade"
                  className="h-10 rounded-[10px] border border-transparent bg-[#F4EEE5] px-3 text-[14px] font-semibold text-ink-500 placeholder:text-[#A08E7E] outline-none focus:border-[#F68D3D] focus:bg-white transition-colors"
                />
              </div>

              <div className="mb-4 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#A08E7E]">Tipo de estratégia</label>
                <div className="flex gap-2">
                  {(["Volume", "Qualidade"] as const).map((tipo) => (
                    <motion.button
                      key={tipo}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, tipo }))}
                      initial={false}
                      animate={{
                        backgroundColor: draft.tipo === tipo ? "#23201F" : "rgba(0,0,0,0)",
                        color: draft.tipo === tipo ? "#FFFFFF" : "#A08E7E",
                      }}
                      whileHover={draft.tipo !== tipo ? { backgroundColor: "rgba(213,203,192,0.4)", color: "#23201F" } : undefined}
                      transition={{ duration: 0.15 }}
                      className="flex-1 rounded-[10px] py-2.5 text-[13px] font-bold"
                      style={{ border: "1px solid rgba(35,32,31,0.08)" }}
                    >
                      {tipo}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Benchmark */}
              <p className="mb-4 text-[11px] font-semibold italic text-[#A08E7E]">
                Benchmark {draft.tipo === "Volume"
                  ? "Volume: tx. resposta 15–25% · tx. ativação 3–8%"
                  : "Qualidade: tx. resposta 25–40% · tx. ativação 8–15%"}
              </p>

              <motion.button
                type="button"
                onClick={save}
                initial="rest"
                whileHover="hovered"
                whileTap={{ scale: 0.96 }}
                animate="rest"
                variants={{
                  rest:    { scale: 1,    backgroundColor: "#F68D3D" },
                  hovered: { scale: 1.02, backgroundColor: "#F79E55" },
                }}
                transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex w-full items-center justify-center gap-2 rounded-[14px] py-3 text-[14px] font-bold text-white"
              >
                <Check size={15} />
                Salvar metas
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Campo de edição numérico ───────────────────────────────────── */
function EditField({ label, value, onChange, suffix }: {
  label: string; value: number; onChange: (v: number) => void; suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#A08E7E]">{label}</label>
      <div className="relative flex items-center">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="h-10 w-full rounded-[10px] border border-transparent bg-[#F4EEE5] px-3 pr-7 text-[14px] font-bold text-ink-500 outline-none focus:border-[#F68D3D] focus:bg-white transition-colors"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 text-[13px] font-semibold text-[#A08E7E]">{suffix}</span>
        )}
      </div>
    </div>
  );
}

/* ── Cálculo de stats ───────────────────────────────────────────── */
function calcStats(creators: Creator[], metas: Record<string, AnalistaMeta>) {
  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  return ANALISTAS.map((analista) => {
    const all = creators.filter((c) => c.analista === analista);
    const thisWeek = all.filter((c) => new Date(c.created_at) >= weekStart);
    const thisMonth = all.filter((c) => new Date(c.created_at) >= monthStart);

    const meta = metas[analista] ?? DEFAULT_META;
    const metaMes = meta.contatosSemana * 4;
    const pctMes = metaMes > 0 ? (thisMonth.length / metaMes) * 100 : 0;

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const dayOfMonth = today.getDate();
    const pacePrevisto = dayOfMonth > 0 ? Math.round((thisMonth.length / dayOfMonth) * daysInMonth) : 0;

    return {
      analista,
      total: all.length,
      semana: thisWeek.length,
      mes: thisMonth.length,
      pctMes,
      pacePrevisto,
      vaiAcertar: pacePrevisto >= metaMes,
    };
  });
}

/* ── Componente principal ───────────────────────────────────────── */
export function MetasClient({ creators }: Props) {
  const [metas, setMetas] = useState<Record<string, AnalistaMeta>>(
    Object.fromEntries(ANALISTAS.map((a) => [a, { ...DEFAULT_META }]))
  );

  const stats = useMemo(() => calcStats(creators, metas), [creators, metas]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-ink-500">Metas & Pace</h1>
        <p className="mt-0.5 text-[14px] font-semibold text-[#A08E7E]">Acompanhe o ritmo da equipe</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <AnalistaCard
            key={s.analista}
            analista={s.analista}
            stats={s}
            meta={metas[s.analista] ?? DEFAULT_META}
            onMetaChange={(m) => setMetas((prev) => ({ ...prev, [s.analista]: m }))}
            delay={i * 0.07}
          />
        ))}
      </div>
    </div>
  );
}
