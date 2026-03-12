"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import { ANALISTAS, type Creator } from "@/types/creator";

interface Props {
  creators: Creator[];
}

const DEFAULT_META = 20;

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function ProgressBar({
  pct,
  delay,
  meta,
}: {
  pct: number;
  delay: number;
  meta: boolean;
}) {
  const clamped = Math.min(pct, 100);
  const color = pct >= 100 ? "#16A34A" : pct >= 60 ? "#F68D3D" : "#D3C4B0";

  return (
    <div className="relative h-3 w-full overflow-hidden rounded-pill bg-base-200">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.7, ease: [0, 0, 0.2, 1], delay }}
        className="h-full rounded-pill"
        style={{ backgroundColor: color }}
      />
      {meta && pct < 100 && (
        <div
          className="absolute top-0 h-full w-0.5 bg-primary-500/40"
          style={{ left: "100%" }}
        />
      )}
    </div>
  );
}

export function MetasClient({ creators }: Props) {
  const [metas, setMetas] = useState<Record<string, number>>(
    Object.fromEntries(ANALISTAS.map((a) => [a, DEFAULT_META]))
  );

  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  const stats = useMemo(() => {
    return ANALISTAS.map((analista) => {
      const all = creators.filter((c) => c.analista === analista);
      const thisWeek = all.filter((c) => new Date(c.created_at) >= weekStart);
      const thisMonth = all.filter((c) => new Date(c.created_at) >= monthStart);

      const meta = metas[analista] ?? DEFAULT_META;
      const pctMes = (thisMonth.length / meta) * 100;

      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const dayOfMonth = today.getDate();
      const pacePrevisto = Math.round((thisMonth.length / dayOfMonth) * daysInMonth);
      const vaiAcertar = pacePrevisto >= meta;

      return {
        analista,
        total: all.length,
        semana: thisWeek.length,
        mes: thisMonth.length,
        meta,
        pctMes,
        pacePrevisto,
        vaiAcertar,
      };
    });
  }, [creators, metas, weekStart, monthStart]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-ink-500">Metas & Pace</h1>
        <p className="mt-0.5 text-[14px] font-semibold text-[#A08E7E]">
          Acompanhe o ritmo da equipe
        </p>
      </div>

      {/* Cards por analista */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.analista}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: i * 0.08 }}
            className="rounded-[20px] bg-white p-6"
          >
            {/* Header do card */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-pill text-[16px] font-bold text-white"
                style={{ backgroundColor: "#F68D3D" }}
              >
                {s.analista.charAt(0)}
              </div>
              <div>
                <p className="text-[16px] font-bold text-ink-500">{s.analista}</p>
                <p className="text-[12px] font-semibold text-[#A08E7E]">
                  {s.total} total · {s.semana} esta semana
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-[12px] font-semibold text-[#A08E7E]">Meta/mês:</span>
                <input
                  type="number"
                  min={1}
                  value={s.meta}
                  onChange={(e) =>
                    setMetas((prev) => ({
                      ...prev,
                      [s.analista]: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-14 rounded-[8px] border border-transparent bg-base-200 px-2 py-1 text-center text-[14px] font-bold text-ink-500 outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Progresso do mês */}
            <div className="mb-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">
                  Prospecções este mês
                </span>
                <span className="text-[14px] font-bold text-ink-500">
                  {s.mes} / {s.meta}
                </span>
              </div>
              <ProgressBar pct={s.pctMes} delay={0.1 + i * 0.08} meta={false} />
            </div>

            {/* Pace */}
            <div
              className="flex items-center gap-2 rounded-[12px] px-4 py-3"
              style={{
                background: s.vaiAcertar
                  ? "rgba(22,163,74,0.08)"
                  : "rgba(246,141,61,0.08)",
              }}
            >
              <TrendingUp
                size={14}
                style={{ color: s.vaiAcertar ? "#16A34A" : "#F68D3D" }}
              />
              <span
                className="text-[13px] font-semibold"
                style={{ color: s.vaiAcertar ? "#16A34A" : "#F68D3D" }}
              >
                {s.vaiAcertar
                  ? `No ritmo certo — projeção: ${s.pacePrevisto}`
                  : `Pace abaixo — projeção: ${s.pacePrevisto}`}
              </span>
              <span className="ml-auto text-[13px] font-bold" style={{
                color: s.vaiAcertar ? "#16A34A" : "#F68D3D"
              }}>
                {Math.round(s.pctMes)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Aviso sobre metas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-4 flex items-center gap-2 rounded-[14px] px-4 py-3"
        style={{ background: "rgba(35,32,31,0.04)" }}
      >
        <Target size={14} className="text-[#A08E7E] shrink-0" />
        <p className="text-[13px] font-semibold text-[#A08E7E]">
          As metas são configuradas por sessão. Em breve serão salvas por analista no banco.
        </p>
      </motion.div>
    </div>
  );
}
