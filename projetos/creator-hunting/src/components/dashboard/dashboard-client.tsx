"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Flame, CheckCircle2, XCircle } from "lucide-react";
import { STATUS_LIST, ANALISTAS, type Creator, type Status } from "@/types/creator";

function WelcomeHeader() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="mb-6"
    >
      <h1 className="text-[28px] font-bold text-ink-500">
        {greeting}, Privacy
      </h1>
      <p className="mt-0.5 text-[14px] font-semibold text-[#A08E7E] capitalize">
        {dateStr}
      </p>
    </motion.div>
  );
}

interface Props {
  creators: Creator[];
}

const STATUS_FUNNEL: Status[] = [
  "Prospectada",
  "Contatada",
  "Respondeu",
  "Interessa",
  "Negociando",
  "Ativou",
];

const CANAL_COLORS: Record<string, string> = {
  Instagram:   "#E1306C",
  TikTok:      "#000000",
  Kwai:        "#FF6A00",
  "X (Twitter)":"#1DA1F2",
  YouTube:     "#FF0000",
  Outro:       "#A08E7E",
};

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
          style={{ backgroundColor: color + "18" }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <p className="text-[40px] font-bold leading-none" style={{ color }}>
        {value}
      </p>
    </motion.div>
  );
}

function Bar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-pill bg-base-200">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay }}
        className="h-full rounded-pill"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function DashboardClient({ creators }: Props) {
  const stats = useMemo(() => {
    const total = creators.length;
    const ativos = creators.filter((c) => c.status === "Interessa" || c.status === "Negociando").length;
    const ativados = creators.filter((c) => c.status === "Ativou").length;
    const perdidos = creators.filter((c) => c.status === "Não quis" || c.status === "Já tem conta").length;

    const porStatus: Record<string, number> = {};
    STATUS_LIST.forEach((s) => {
      porStatus[s] = creators.filter((c) => c.status === s).length;
    });

    const porCanal: Record<string, number> = {};
    creators.forEach((c) => { porCanal[c.canal] = (porCanal[c.canal] ?? 0) + 1; });

    const porAnalista: Record<string, { total: number; ativados: number }> = {};
    ANALISTAS.forEach((a) => {
      porAnalista[a] = {
        total: creators.filter((c) => c.analista === a).length,
        ativados: creators.filter((c) => c.analista === a && c.status === "Ativou").length,
      };
    });

    const porSegmento: Record<string, number> = {};
    creators.forEach((c) => {
      if (c.segmento !== "—") porSegmento[c.segmento] = (porSegmento[c.segmento] ?? 0) + 1;
    });

    const taxaConversao = total > 0 ? Math.round((ativados / total) * 100) : 0;

    return { total, ativos, ativados, perdidos, porStatus, porCanal, porAnalista, porSegmento, taxaConversao };
  }, [creators]);

  const maxCanal = Math.max(...Object.values(stats.porCanal), 1);
  const maxSegmento = Math.max(...Object.values(stats.porSegmento), 1);

  return (
    <div>
      <WelcomeHeader />

      {/* Cards de métricas */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard label="Total prospectadas" value={stats.total}    icon={<Users size={16} />}        color="#23201F" delay={0} />
        <StatCard label="Ativas"              value={stats.ativos}  icon={<Flame size={16} />}        color="#F68D3D" delay={0.06} />
        <StatCard label="Ativadas"            value={stats.ativados} icon={<CheckCircle2 size={16} />} color="#16A34A" delay={0.12} />
        <StatCard label="Perdidas"            value={stats.perdidos} icon={<XCircle size={16} />}      color="#A08E7E" delay={0.18} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Funil de conversão */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: 0.24 }}
          className="rounded-[20px] bg-white p-6"
        >
          <h2 className="mb-4 text-[15px] font-bold text-ink-500">Funil de Status</h2>
          <div className="flex flex-col gap-3">
            {STATUS_FUNNEL.map((s, i) => {
              const count = stats.porStatus[s] ?? 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={s}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-ink-500">{s}</span>
                    <span className="text-[13px] font-bold text-[#A08E7E]">{count}</span>
                  </div>
                  <Bar
                    pct={pct}
                    color={s === "Ativou" ? "#16A34A" : s === "Interessa" || s === "Negociando" ? "#F68D3D" : "#D3C4B0"}
                    delay={0.3 + i * 0.05}
                  />
                </div>
              );
            })}
          </div>

          <div
            className="mt-4 flex items-center justify-between rounded-[12px] px-4 py-3"
            style={{ background: "rgba(246,141,61,0.08)" }}
          >
            <span className="text-[13px] font-bold text-ink-500">Taxa de conversão</span>
            <span className="text-[20px] font-bold text-primary-500">{stats.taxaConversao}%</span>
          </div>
        </motion.div>

        {/* Distribuição por canal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: 0.3 }}
          className="rounded-[20px] bg-white p-6"
        >
          <h2 className="mb-4 text-[15px] font-bold text-ink-500">Por Canal</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(stats.porCanal)
              .sort(([, a], [, b]) => b - a)
              .map(([canal, count], i) => {
                const pct = (count / maxCanal) * 100;
                const color = CANAL_COLORS[canal] ?? "#A08E7E";
                return (
                  <div key={canal}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-ink-500">{canal}</span>
                      <span className="text-[13px] font-bold text-[#A08E7E]">{count}</span>
                    </div>
                    <Bar pct={pct} color={color} delay={0.35 + i * 0.04} />
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Performance por analista */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: 0.36 }}
          className="rounded-[20px] bg-white p-6"
        >
          <h2 className="mb-4 text-[15px] font-bold text-ink-500">Performance por Analista</h2>
          <div className="flex flex-col gap-3">
            {ANALISTAS.map((analista, i) => {
              const data = stats.porAnalista[analista];
              const convRate = data.total > 0 ? Math.round((data.ativados / data.total) * 100) : 0;
              return (
                <motion.div
                  key={analista}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: [0, 0, 0.2, 1], delay: 0.4 + i * 0.06 }}
                  className="flex items-center gap-3 rounded-[12px] px-4 py-3"
                  style={{ background: "rgba(244,238,229,0.6)" }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-pill text-[12px] font-bold text-white"
                    style={{ backgroundColor: "#F68D3D" }}
                  >
                    {analista.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-ink-500">{analista}</p>
                    <p className="text-[12px] font-semibold text-[#A08E7E]">
                      {data.total} prospecções · {data.ativados} ativadas
                    </p>
                  </div>
                  <div
                    className="rounded-[8px] px-2.5 py-1 text-[13px] font-bold"
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

        {/* Distribuição por segmento */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1], delay: 0.42 }}
          className="rounded-[20px] bg-white p-6"
        >
          <h2 className="mb-4 text-[15px] font-bold text-ink-500">Por Segmento</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(stats.porSegmento)
              .sort(([, a], [, b]) => b - a)
              .map(([seg, count], i) => {
                const pct = (count / maxSegmento) * 100;
                return (
                  <div key={seg}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-ink-500">{seg}</span>
                      <span className="text-[13px] font-bold text-[#A08E7E]">{count}</span>
                    </div>
                    <Bar pct={pct} color="#F68D3D" delay={0.45 + i * 0.04} />
                  </div>
                );
              })}
            {Object.keys(stats.porSegmento).length === 0 && (
              <p className="text-[13px] font-semibold text-[#A08E7E]">Nenhum segmento cadastrado ainda.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
