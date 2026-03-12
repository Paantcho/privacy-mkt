"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { type Creator } from "@/types/creator";

interface Props {
  creators: Creator[];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "agora mesmo";
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffH < 24) return `há ${diffH}h`;
  if (diffD === 1) return "ontem";
  if (diffD < 7) return `há ${diffD} dias`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function TimelineClient({ creators }: Props) {
  const grouped = useMemo(() => {
    const sorted = [...creators].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const groups: Record<string, Creator[]> = {};
    sorted.forEach((c) => {
      const dateKey = new Date(c.created_at).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(c);
    });

    return Object.entries(groups).map(([dateKey, items]) => ({
      dateKey,
      label: formatDate(items[0].created_at),
      items,
    }));
  }, [creators]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-ink-500">Timeline</h1>
        <p className="mt-0.5 text-[14px] font-semibold text-[#A08E7E]">
          Histórico cronológico de prospecções
        </p>
      </div>

      {creators.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-white py-20">
          <Clock size={32} className="mb-3 text-[#A08E7E]" />
          <p className="text-[15px] font-semibold text-[#A08E7E]">
            Nenhum registro ainda. Comece prospectando!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ dateKey, label, items }, gi) => (
            <div key={dateKey}>
              {/* Separador de data */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: [0, 0, 0.2, 1], delay: gi * 0.06 }}
                className="mb-3 flex items-center gap-3"
              >
                <div
                  className="h-px flex-1"
                  style={{ background: "rgba(35,32,31,0.08)" }}
                />
                <span className="text-[12px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]">
                  {label}
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: "rgba(35,32,31,0.08)" }}
                />
              </motion.div>

              {/* Cards do dia */}
              <div className="flex flex-col gap-2">
                {items.map((creator, i) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      ease: [0, 0, 0.2, 1],
                      delay: gi * 0.06 + Math.min(i * 0.04, 0.24),
                    }}
                    className="flex items-center gap-4 rounded-[16px] bg-white px-5 py-4"
                  >
                    {/* Dot */}
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-pill"
                      style={{
                        backgroundColor:
                          creator.status === "Ativou"
                            ? "#16A34A"
                            : creator.status === "Interessa" || creator.status === "Negociando"
                            ? "#F68D3D"
                            : "#D3C4B0",
                      }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-ink-500 truncate">
                          {creator.perfil_handle || creator.nome || "Creator sem @"}
                        </span>
                        {creator.nome && creator.perfil_handle && (
                          <>
                            <ArrowRight size={12} className="text-[#A08E7E] shrink-0" />
                            <span className="text-[13px] font-semibold text-[#A08E7E] truncate">
                              {creator.nome}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[12px] font-semibold text-[#A08E7E]">
                        <span>{creator.canal}</span>
                        <span>·</span>
                        <span>{creator.analista ?? "—"}</span>
                        {creator.segmento !== "—" && (
                          <>
                            <span>·</span>
                            <span>{creator.segmento}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className="shrink-0 rounded-[8px] px-2.5 py-1 text-[12px] font-bold"
                      style={{
                        background:
                          creator.status === "Ativou"
                            ? "rgba(22,163,74,0.1)"
                            : creator.status === "Interessa" || creator.status === "Negociando"
                            ? "rgba(246,141,61,0.12)"
                            : "rgba(211,196,176,0.4)",
                        color:
                          creator.status === "Ativou"
                            ? "#16A34A"
                            : creator.status === "Interessa" || creator.status === "Negociando"
                            ? "#D97A33"
                            : "#A08E7E",
                      }}
                    >
                      {creator.status}
                    </div>

                    {/* Hora */}
                    <span className="shrink-0 text-[12px] font-semibold text-[#A08E7E]">
                      {timeAgo(creator.created_at)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
