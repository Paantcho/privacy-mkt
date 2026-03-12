"use client";

import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ExternalLink } from "lucide-react";
import {
  CANAIS, PAISES, TIERS, SEGMENTOS, STATUS_LIST, ANALISTAS, STATUS_COLORS,
  type Creator, type Canal, type Pais, type Tier, type Segmento, type Status, type Analista,
} from "@/types/creator";
import { updateCreator, deleteCreators } from "@/lib/actions/creators";
import { InlineSelect } from "./inline-select";
import { useToast } from "@/components/ui/toast";

interface Props {
  creators: Creator[];
}

const TH = "px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.4px] text-[#A08E7E] whitespace-nowrap";
const TD = "px-3 py-2";

function EditableText({
  value,
  onSave,
  placeholder,
}: {
  value: string | null;
  onSave: (v: string) => void;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(value ?? "");
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    setEditing(false);
    if (draft !== (value ?? "")) onSave(draft);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        className="w-full rounded-[6px] border border-[#F68D3D] bg-white px-2 py-1 text-[13px] font-semibold text-ink-500 outline-none"
        style={{ minWidth: 80 }}
      />
    );
  }

  return (
    <motion.button
      type="button"
      onClick={startEdit}
      whileHover={{ backgroundColor: "rgba(213,203,192,0.3)" }}
      transition={{ duration: 0.1 }}
      className="w-full rounded-[6px] px-2 py-1 text-left text-[13px] font-semibold text-ink-500 min-w-[60px]"
    >
      {value || <span className="text-[#A08E7E] italic">{placeholder ?? "—"}</span>}
    </motion.button>
  );
}

export function CreatorsTable({ creators }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const toast = useToast();

  const allSelected = creators.length > 0 && selected.size === creators.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(creators.map((c) => c.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function update(id: string, patch: Partial<Creator>) {
    startTransition(async () => {
      const res = await updateCreator(id, patch);
      if (!res.ok) toast.error(res.error ?? "Erro ao atualizar");
    });
  }

  function deleteSelected() {
    if (selected.size === 0) return;
    startTransition(async () => {
      const res = await deleteCreators([...selected]);
      if (res.ok) {
        toast.success(`${selected.size} creator(s) removido(s)`);
        setSelected(new Set());
      } else {
        toast.error(res.error ?? "Erro ao remover");
      }
    });
  }

  return (
    <div>
      {/* Barra de seleção múltipla */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="mb-3 flex items-center gap-3 rounded-[12px] bg-white px-4 py-2.5"
          >
            <span className="text-[13px] font-semibold text-ink-500">
              {selected.size} selecionado(s)
            </span>
            <motion.button
              type="button"
              onClick={deleteSelected}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              className="ml-auto flex items-center gap-1.5 rounded-[10px] bg-red-50 px-3 py-1.5 text-[13px] font-semibold text-red-600"
            >
              <Trash2 size={13} />
              Remover
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-hidden rounded-[20px] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(35,32,31,0.06)" }}>
                <th className="w-10 px-3 py-2.5">
                  <motion.button
                    type="button"
                    onClick={toggleAll}
                    className={`flex h-4 w-4 items-center justify-center rounded-[4px] border-2 transition-colors ${
                      allSelected
                        ? "border-primary-500 bg-primary-500"
                        : "border-[#D3C4B0] bg-transparent"
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    {allSelected && (
                      <svg viewBox="0 0 10 8" width="10" height="8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </motion.button>
                </th>
                <th className={TH}>Canal</th>
                <th className={TH}>País</th>
                <th className={TH}>Analista</th>
                <th className={TH}>Nome</th>
                <th className={TH}>Tier</th>
                <th className={TH}>Segmento</th>
                <th className={TH}>Perfil / Link</th>
                <th className={TH}>Contato</th>
                <th className={TH}>Respondido</th>
                <th className={TH}>Status</th>
                <th className={TH}>OBS</th>
              </tr>
            </thead>
            <tbody>
              {creators.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-[14px] font-semibold text-[#A08E7E]">
                    Nenhum registro. Comece adicionando uma prospecção acima.
                  </td>
                </tr>
              ) : (
                creators.map((creator, i) => (
                  <motion.tr
                    key={creator.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: [0, 0, 0.2, 1], delay: Math.min(i * 0.04, 0.28) }}
                    className={`group transition-colors ${
                      selected.has(creator.id) ? "bg-primary-50" : "hover:bg-[#FDFCFA]"
                    }`}
                    style={{ borderBottom: "1px solid rgba(35,32,31,0.04)" }}
                  >
                    {/* Checkbox */}
                    <td className="w-10 px-3 py-2">
                      <motion.button
                        type="button"
                        onClick={() => toggleOne(creator.id)}
                        className={`flex h-4 w-4 items-center justify-center rounded-[4px] border-2 transition-colors ${
                          selected.has(creator.id)
                            ? "border-primary-500 bg-primary-500"
                            : "border-[#D3C4B0] bg-transparent"
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        {selected.has(creator.id) && (
                          <svg viewBox="0 0 10 8" width="10" height="8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </motion.button>
                    </td>

                    {/* Canal */}
                    <td className={TD}>
                      <InlineSelect
                        value={creator.canal}
                        options={CANAIS}
                        onChange={(v) => update(creator.id, { canal: v as Canal })}
                      />
                    </td>

                    {/* País */}
                    <td className={TD}>
                      <InlineSelect
                        value={creator.pais}
                        options={PAISES}
                        onChange={(v) => update(creator.id, { pais: v as Pais })}
                      />
                    </td>

                    {/* Analista */}
                    <td className={TD}>
                      <InlineSelect
                        value={creator.analista ?? "—"}
                        options={["—", ...ANALISTAS]}
                        onChange={(v) => update(creator.id, { analista: v === "—" ? null : v as Analista })}
                      />
                    </td>

                    {/* Nome */}
                    <td className={TD}>
                      <EditableText
                        value={creator.nome}
                        placeholder="nome..."
                        onSave={(v) => update(creator.id, { nome: v || null })}
                      />
                    </td>

                    {/* Tier */}
                    <td className={TD}>
                      <InlineSelect
                        value={creator.tier}
                        options={TIERS}
                        onChange={(v) => update(creator.id, { tier: v as Tier })}
                      />
                    </td>

                    {/* Segmento */}
                    <td className={TD}>
                      <InlineSelect
                        value={creator.segmento}
                        options={SEGMENTOS}
                        onChange={(v) => update(creator.id, { segmento: v as Segmento })}
                      />
                    </td>

                    {/* Perfil */}
                    <td className={TD}>
                      <div className="flex items-center gap-1.5">
                        <EditableText
                          value={creator.perfil_handle}
                          placeholder="@..."
                          onSave={(v) => update(creator.id, { perfil_handle: v })}
                        />
                        {creator.perfil_handle && (
                          <motion.a
                            href={
                              creator.perfil_handle.startsWith("http")
                                ? creator.perfil_handle
                                : `https://instagram.com/${creator.perfil_handle.replace("@", "")}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="shrink-0 text-[#A08E7E] opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <ExternalLink size={12} />
                          </motion.a>
                        )}
                      </div>
                    </td>

                    {/* Contato */}
                    <td className={TD}>
                      <InlineSelect
                        value={creator.contato ? "SIM" : "NÃO"}
                        options={["SIM", "NÃO"]}
                        onChange={(v) => update(creator.id, { contato: v === "SIM" })}
                      />
                    </td>

                    {/* Respondido */}
                    <td className={TD}>
                      <InlineSelect
                        value={creator.respondido ? "SIM" : "NÃO"}
                        options={["SIM", "NÃO"]}
                        onChange={(v) => update(creator.id, { respondido: v === "SIM" })}
                      />
                    </td>

                    {/* Status */}
                    <td className={TD}>
                      <InlineSelect
                        value={creator.status}
                        options={STATUS_LIST}
                        onChange={(v) => update(creator.id, { status: v as Status })}
                        colorMap={STATUS_COLORS}
                        className={STATUS_COLORS[creator.status] + " rounded-[8px]"}
                      />
                    </td>

                    {/* OBS */}
                    <td className={TD}>
                      <EditableText
                        value={creator.obs}
                        placeholder="obs..."
                        onSave={(v) => update(creator.id, { obs: v || null })}
                      />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
