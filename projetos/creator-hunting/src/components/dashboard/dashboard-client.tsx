"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Users, Flame, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { ANALISTAS, SEGMENTOS, CANAIS, type Creator, type Status } from "@/types/creator";

/* ── Tipos ─────────────────────────────────────────────────────── */

interface Props {
  creators: Creator[];
}

type Period = "hoje" | "7d" | "15d" | "30d" | "tudo" | "custom";

const STATUS_FUNNEL: Status[] = [
  "Prospectada", "Contatada", "Respondeu", "Interessa", "Negociando", "Ativou",
];

const CANAL_COLORS: Record<string, string> = {
  Instagram:    "#E1306C",
  TikTok:       "#010101",
  Kwai:         "#FF6A00",
  "X (Twitter)":"#1DA1F2",
  YouTube:      "#FF0000",
  Outro:        "#A08E7E",
};

/* ── Pill com sistema de cores correto ──────────────────────────
   Orange  = ação primária (salvar, confirmar)
   Charcoal = filtro ATIVO
   Branco/transparente = inativo
*/
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{
        backgroundColor: active ? "#23201F" : "rgba(0,0,0,0)",
        color: active ? "#FFFFFF" : "#A08E7E",
      }}
      whileHover={!active ? { backgroundColor: "rgba(213,203,192,0.4)", color: "#23201F" } : undefined}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-[20px] px-3.5 py-1.5 text-[13px] font-bold"
    >
      {label}
    </motion.button>
  );
}

/* ── Número animado ─────────────────────────────────────────────── */
function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    const controls = animate(motionValue, value, {
      duration: 0.6,
      ease: [0, 0, 0.2, 1],
    });
    rounded.on("change", (v) => setDisplay(v));
    prevValue.current = value;
    return controls.stop;
  }, [value, motionValue, rounded]);

  return (
    <span className="text-[40px] font-bold leading-none tabular-nums" style={{ color }}>
      {display}
    </span>
  );
}

/* ── StatCard ───────────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay }}
      className="rounded-[20px] bg-white p-6"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">
          {label}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: color + "15" }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <AnimatedNumber value={value} color={color} />
    </motion.div>
  );
}

/* ── Barra animada ──────────────────────────────────────────────── */
function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-pill" style={{ backgroundColor: "rgba(211,196,176,0.3)" }}>
      <motion.div
        animate={{ width: `${Math.min(pct, 100)}%` }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
        className="h-full rounded-pill"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

/* ── Cabeçalho com saudação ─────────────────────────────────────── */
function WelcomeHeader({ lastUpdate, refreshing }: { lastUpdate: Date; refreshing: boolean }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="mb-6 flex items-end justify-between">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      >
        <h1 className="text-[28px] font-bold text-ink-500">{greeting}, Privacy</h1>
        <p className="mt-0.5 text-[14px] font-semibold text-[#A08E7E] capitalize">{dateStr}</p>
      </motion.div>

      <div className="flex items-center gap-2 text-[12px] font-semibold text-[#A08E7E]">
        <motion.span
          animate={{ rotate: refreshing ? 360 : 0 }}
          transition={{ duration: 0.6, ease: "linear", repeat: refreshing ? Infinity : 0 }}
        >
          <RefreshCw size={12} />
        </motion.span>
        <span>
          Atualizado às {lastUpdate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

/* ── Helpers de período ─────────────────────────────────────────── */
function inPeriod(dateStr: string, period: Period, from?: string, to?: string): boolean {
  if (period === "tudo") return true;
  const date = new Date(dateStr);
  const now = new Date();

  if (period === "custom") {
    const start = from ? new Date(from) : null;
    const end = to ? new Date(to + "T23:59:59") : null;
    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  }

  const days = period === "hoje" ? 0 : period === "7d" ? 7 : period === "15d" ? 15 : 30;
  if (days === 0) return date.toDateString() === now.toDateString();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

/* ── Componente principal ───────────────────────────────────────── */
export function DashboardClient({ creators }: Props) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  /* Filtros */
  const [period, setPeriod] = useState<Period>("tudo");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [filterAnalista, setFilterAnalista] = useState("");
  const [filterCanal, setFilterCanal] = useState("");
  const [filterSegmento, setFilterSegmento] = useState("");

  /* Real-time: router.refresh() a cada 60s */
  useEffect(() => {
    const interval = setInterval(async () => {
      setRefreshing(true);
      router.refresh();
      setTimeout(() => {
        setRefreshing(false);
        setLastUpdate(new Date());
      }, 800);
    }, 60_000);
    return () => clearInterval(interval);
  }, [router]);

  /* Creators filtrados */
  const filtered = useMemo(() => {
    return creators.filter((c) => {
      if (!inPeriod(c.created_at, period, customFrom, customTo)) return false;
      if (filterAnalista && c.analista !== filterAnalista) return false;
      if (filterCanal && c.canal !== filterCanal) return false;
      if (filterSegmento && c.segmento !== filterSegmento) return false;
      return true;
    });
  }, [creators, period, customFrom, customTo, filterAnalista, filterCanal, filterSegmento]);

  const hasFilters = period !== "tudo" || filterAnalista || filterCanal || filterSegmento;

  /* Stats calculados sobre os filtrados */
  const stats = useMemo(() => {
    const total = filtered.length;
    const ativos = filtered.filter((c) => c.status === "Interessa" || c.status === "Negociando").length;
    const ativados = filtered.filter((c) => c.status === "Ativou").length;
    const perdidos = filtered.filter((c) => c.status === "Não quis" || c.status === "Já tem conta").length;

    const porStatus: Record<string, number> = {};
    STATUS_FUNNEL.forEach((s) => { porStatus[s] = filtered.filter((c) => c.status === s).length; });

    const porCanal: Record<string, number> = {};
    filtered.forEach((c) => { porCanal[c.canal] = (porCanal[c.canal] ?? 0) + 1; });

    const porAnalista: Record<string, { total: number; ativados: number }> = {};
    ANALISTAS.forEach((a) => {
      porAnalista[a] = {
        total: filtered.filter((c) => c.analista === a).length,
        ativados: filtered.filter((c) => c.analista === a && c.status === "Ativou").length,
      };
    });

    const porSegmento: Record<string, number> = {};
    filtered.forEach((c) => {
      if (c.segmento !== "—") porSegmento[c.segmento] = (porSegmento[c.segmento] ?? 0) + 1;
    });

    const taxaConversao = total > 0 ? Math.round((ativados / total) * 100) : 0;

    return { total, ativos, ativados, perdidos, porStatus, porCanal, porAnalista, porSegmento, taxaConversao };
  }, [filtered]);

  const maxCanal = Math.max(...Object.values(stats.porCanal), 1);
  const maxSegmento = Math.max(...Object.values(stats.porSegmento), 1);

  const PERIODS = [
    { label: "Hoje", value: "hoje" as Period },
    { label: "7 dias", value: "7d" as Period },
    { label: "15 dias", value: "15d" as Period },
    { label: "30 dias", value: "30d" as Period },
    { label: "Tudo", value: "tudo" as Period },
    { label: "Período", value: "custom" as Period },
  ];

  return (
    <div>
      <WelcomeHeader lastUpdate={lastUpdate} refreshing={refreshing} />

      {/* ── Barra de filtros ──────────────────────────────────────── */}
      <div className="mb-5 rounded-[20px] bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Período */}
          <div className="flex items-center gap-1 rounded-[16px] bg-base-200 px-2 py-1">
            {PERIODS.map(({ label, value }) => (
              <FilterPill
                key={value}
                label={label}
                active={period === value}
                onClick={() => setPeriod(value)}
              />
            ))}
          </div>

          {/* Separador */}
          <div className="h-6 w-px" style={{ background: "rgba(35,32,31,0.08)" }} />

          {/* Analista */}
          <div className="flex items-center gap-1 rounded-[16px] bg-base-200 px-2 py-1">
            <FilterPill label="Todas" active={!filterAnalista} onClick={() => setFilterAnalista("")} />
            {ANALISTAS.map((a) => (
              <FilterPill key={a} label={a} active={filterAnalista === a} onClick={() => setFilterAnalista(filterAnalista === a ? "" : a)} />
            ))}
          </div>

          {/* Canal dropdown simples */}
          <FilterDropdown
            label="Canal"
            value={filterCanal}
            options={CANAIS}
            onChange={setFilterCanal}
          />

          {/* Segmento dropdown simples */}
          <FilterDropdown
            label="Segmento"
            value={filterSegmento}
            options={SEGMENTOS.filter((s) => s !== "—")}
            onChange={setFilterSegmento}
          />

          {/* Limpar filtros */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                type="button"
                onClick={() => {
                  setPeriod("tudo");
                  setFilterAnalista("");
                  setFilterCanal("");
                  setFilterSegmento("");
                  setCustomFrom("");
                  setCustomTo("");
                }}
                className="ml-auto text-[12px] font-bold text-[#A08E7E] underline underline-offset-2"
                whileHover={{ color: "#23201F" }}
              >
                Limpar filtros
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Date range customizado */}
        <AnimatePresence>
          {period === "custom" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="mt-3 flex items-center gap-3 border-t pt-3" style={{ borderColor: "rgba(35,32,31,0.06)" }}>
                <span className="text-[12px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">De</span>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="h-9 rounded-[10px] border border-transparent bg-base-200 px-3 text-[13px] font-semibold text-ink-500 outline-none focus:border-[#23201F] transition-colors"
                />
                <span className="text-[12px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">Até</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="h-9 rounded-[10px] border border-transparent bg-base-200 px-3 text-[13px] font-semibold text-ink-500 outline-none focus:border-[#23201F] transition-colors"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Indicador de filtro ativo */}
      <AnimatePresence>
        {hasFilters && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mb-4 text-[12px] font-semibold text-[#A08E7E]"
          >
            Mostrando {filtered.length} de {creators.length} creators com os filtros aplicados
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Cards de métricas ─────────────────────────────────────── */}
      <div className="mb-5 grid grid-cols-4 gap-4">
        <StatCard label="Total prospectadas" value={stats.total}    icon={<Users size={16} />}        color="#23201F" delay={0} />
        <StatCard label="Ativas"              value={stats.ativos}  icon={<Flame size={16} />}        color="#F68D3D" delay={0.05} />
        <StatCard label="Ativadas"            value={stats.ativados} icon={<CheckCircle2 size={16} />} color="#16A34A" delay={0.1} />
        <StatCard label="Perdidas"            value={stats.perdidos} icon={<XCircle size={16} />}      color="#A08E7E" delay={0.15} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Funil */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: 0.2 }}
          className="rounded-[20px] bg-white p-6"
        >
          <h2 className="mb-4 text-[15px] font-bold text-ink-500">Funil de Status</h2>
          <div className="flex flex-col gap-3">
            {STATUS_FUNNEL.map((s) => {
              const count = stats.porStatus[s] ?? 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={s}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-ink-500">{s}</span>
                    <motion.span
                      key={count}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="text-[13px] font-bold text-[#A08E7E] tabular-nums"
                    >
                      {count}
                    </motion.span>
                  </div>
                  <Bar
                    pct={pct}
                    color={s === "Ativou" ? "#16A34A" : s === "Interessa" || s === "Negociando" ? "#F68D3D" : "#D3C4B0"}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-[12px] px-4 py-3" style={{ background: "rgba(246,141,61,0.08)" }}>
            <span className="text-[13px] font-bold text-ink-500">Taxa de conversão</span>
            <span className="text-[20px] font-bold" style={{ color: "#F68D3D" }}>{stats.taxaConversao}%</span>
          </div>
        </motion.div>

        {/* Por canal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: 0.25 }}
          className="rounded-[20px] bg-white p-6"
        >
          <h2 className="mb-4 text-[15px] font-bold text-ink-500">Por Canal</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(stats.porCanal).sort(([, a], [, b]) => b - a).map(([canal, count]) => (
              <div key={canal}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CANAL_COLORS[canal] ?? "#A08E7E" }} />
                    <span className="text-[13px] font-semibold text-ink-500">{canal}</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#A08E7E] tabular-nums">{count}</span>
                </div>
                <Bar pct={(count / maxCanal) * 100} color={CANAL_COLORS[canal] ?? "#A08E7E"} />
              </div>
            ))}
            {Object.keys(stats.porCanal).length === 0 && (
              <p className="text-[13px] font-semibold text-[#A08E7E]">Sem dados para o filtro atual.</p>
            )}
          </div>
        </motion.div>

        {/* Performance por analista */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: 0.3 }}
          className="rounded-[20px] bg-white p-6"
        >
          <h2 className="mb-4 text-[15px] font-bold text-ink-500">Performance por Analista</h2>
          <div className="flex flex-col gap-2">
            {ANALISTAS.map((analista, i) => {
              const data = stats.porAnalista[analista];
              const convRate = data.total > 0 ? Math.round((data.ativados / data.total) * 100) : 0;
              return (
                <motion.div
                  key={analista}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: [0, 0, 0.2, 1], delay: 0.35 + i * 0.05 }}
                  className="flex items-center gap-3 rounded-[12px] px-4 py-3"
                  style={{ background: "rgba(244,238,229,0.6)" }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: "#23201F" }}
                  >
                    {analista.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-ink-500">{analista}</p>
                    <p className="text-[12px] font-semibold text-[#A08E7E]">
                      {data.total} prospecções · {data.ativados} ativadas
                    </p>
                  </div>
                  <div
                    className="shrink-0 rounded-[8px] px-2.5 py-1 text-[13px] font-bold tabular-nums"
                    style={{
                      background: convRate > 0 ? "rgba(22,163,74,0.1)" : "rgba(160,142,126,0.1)",
                      color: convRate > 0 ? "#16A34A" : "#A08E7E",
                    }}
                  >
                    {convRate}%
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Por segmento */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: 0.35 }}
          className="rounded-[20px] bg-white p-6"
        >
          <h2 className="mb-4 text-[15px] font-bold text-ink-500">Por Segmento</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(stats.porSegmento).sort(([, a], [, b]) => b - a).map(([seg, count]) => (
              <div key={seg}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-ink-500">{seg}</span>
                  <span className="text-[13px] font-bold text-[#A08E7E] tabular-nums">{count}</span>
                </div>
                <Bar pct={(count / maxSegmento) * 100} color="#F68D3D" />
              </div>
            ))}
            {Object.keys(stats.porSegmento).length === 0 && (
              <p className="text-[13px] font-semibold text-[#A08E7E]">Sem dados para o filtro atual.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── FilterDropdown ──────────────────────────────────────────────── */
import { ChevronDown, Check } from "lucide-react";

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
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
        initial={false}
        animate={{
          backgroundColor: value ? "#23201F" : "rgba(0,0,0,0)",
          color: value ? "#FFFFFF" : "#A08E7E",
        }}
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
