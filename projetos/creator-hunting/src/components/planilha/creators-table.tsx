"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, ExternalLink, Check } from "lucide-react";
import {
  CANAIS, PAISES, TIERS, SEGMENTOS, STATUS_LIST, ANALISTAS, STATUS_STYLE,
  type Creator, type Canal, type Pais, type Tier, type Segmento, type Status, type Analista,
} from "@/types/creator";
import { updateCreator, archiveCreators } from "@/lib/actions/creators";
import { InlineSelect } from "./inline-select";
import { useToast } from "@/components/ui/toast";

const TH = "px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.4px] text-[#A08E7E] whitespace-nowrap";
const TD = "px-3 py-2";

/* ── Status Badge com dropdown via Portal (evita overflow clip da tabela) ── */
function StatusDropdown({ status, onChange }: { status: Status; onChange: (v: Status) => void }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const s = STATUS_STYLE[status];

  function openMenu() {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onOut(e: MouseEvent) {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || menuRef.current?.contains(target)) return;
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
            borderRadius: 12,
            border: "1px solid rgba(35,32,31,0.08)",
            padding: "6px 0",
            pointerEvents: "auto",
          }}
        >
          {STATUS_LIST.map((opt) => {
            const os = STATUS_STYLE[opt];
            return (
              <motion.button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                whileHover={{ backgroundColor: "#F4EEE5" }}
                transition={{ duration: 0.1 }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] font-semibold text-ink-500"
              >
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: os.dot }} />
                <span className="flex-1">{opt}</span>
                {opt === status && <Check size={11} className="text-primary-500 shrink-0" />}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.button
        ref={btnRef}
        type="button"
        onClick={openMenu}
        whileHover={{ opacity: 0.85 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-[12px] font-bold whitespace-nowrap"
        style={{ backgroundColor: s.bg, color: s.color }}
      >
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
        {status}
      </motion.button>
      {typeof document !== "undefined" && createPortal(menu, document.body)}
    </>
  );
}

/* ── Texto editável ─────────────────────────────────────────────── */
function EditableText({
  value, onSave, placeholder,
}: { value: string | null; onSave: (v: string) => void; placeholder?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() { setDraft(value ?? ""); setEditing(true); setTimeout(() => inputRef.current?.focus(), 0); }
  function commit() { setEditing(false); if (draft !== (value ?? "")) onSave(draft); }

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
      whileHover={{ backgroundColor: "rgba(213,203,192,0.25)" }}
      transition={{ duration: 0.1 }}
      className="w-full rounded-[6px] px-2 py-1 text-left text-[13px] font-semibold text-ink-500 min-w-[60px]"
    >
      {value || <span className="text-[#A08E7E] italic font-normal">{placeholder ?? "—"}</span>}
    </motion.button>
  );
}

/* ── Bool toggle inline ─────────────────────────────────────────── */
function BoolCell({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!value)}
      whileHover={{ opacity: 0.8 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-[6px] px-2 py-1 text-[12px] font-bold"
      style={{
        backgroundColor: value ? "rgba(22,163,74,0.1)" : "rgba(211,196,176,0.3)",
        color: value ? "#15803D" : "#A08E7E",
      }}
    >
      {value ? "SIM" : "NÃO"}
    </motion.button>
  );
}

/* ── Checkbox ───────────────────────────────────────────────────── */
function Checkbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      initial={false}
      animate={{
        backgroundColor: checked ? "#23201F" : "transparent",
        borderColor: checked ? "#23201F" : "#D3C4B0",
      }}
      transition={{ duration: 0.15 }}
      className="flex h-4 w-4 items-center justify-center rounded-[4px] border-2"
    >
      {checked && (
        <svg viewBox="0 0 10 8" width="10" height="8" fill="none">
          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </motion.button>
  );
}

/* ── Tabela principal ───────────────────────────────────────────── */
export function CreatorsTable({ creators }: { creators: Creator[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const toast = useToast();

  const allSelected = creators.length > 0 && selected.size === creators.length;

  function toggleAll() { setSelected(allSelected ? new Set() : new Set(creators.map((c) => c.id))); }
  function toggleOne(id: string) {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function update(id: string, patch: Partial<Creator>) {
    startTransition(async () => {
      const res = await updateCreator(id, patch);
      if (!res.ok) toast.error(res.error ?? "Erro ao atualizar");
    });
  }

  function archiveSelected() {
    startTransition(async () => {
      const count = selected.size;
      const res = await archiveCreators([...selected]);
      if (res.ok) {
        toast.success(`${count} creator(s) arquivado(s) — dados preservados no banco`);
        setSelected(new Set());
      } else {
        toast.error(res.error ?? "Erro ao arquivar");
      }
    });
  }

  return (
    <div>
      {/* Barra de seleção */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="mb-3 flex items-center gap-3 rounded-[14px] bg-white px-4 py-2.5"
          >
            <span className="text-[13px] font-semibold text-ink-500">{selected.size} selecionado(s)</span>
            <motion.button
              type="button"
              onClick={archiveSelected}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              className="ml-auto flex items-center gap-1.5 rounded-[10px] bg-[#F4EEE5] px-3 py-1.5 text-[13px] font-semibold text-[#A08E7E]"
            >
              <Archive size={13} /> Arquivar selecionados
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-hidden rounded-[20px] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(35,32,31,0.06)" }}>
                <th className="w-10 px-3 py-3">
                  <Checkbox checked={allSelected} onToggle={toggleAll} />
                </th>
                <th className={TH}>Canal</th>
                <th className={TH}>País</th>
                <th className={TH}>Analista</th>
                <th className={TH}>Nome</th>
                <th className={TH}>Tier</th>
                <th className={TH}>Segmento</th>
                <th className={TH}>Perfil / Link</th>
                <th className={TH}>Contato</th>
                <th className={TH}>Respondeu</th>
                <th className={TH}>Status</th>
                <th className={TH}>OBS</th>
              </tr>
            </thead>
            <tbody>
              {creators.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-20 text-center">
                    <p className="text-[15px] font-bold text-[#A08E7E]">Nenhum registro encontrado</p>
                    <p className="mt-1 text-[13px] font-semibold text-[#BBA998]">
                      Ajuste os filtros ou adicione uma nova prospecção acima
                    </p>
                  </td>
                </tr>
              ) : (
                creators.map((creator, i) => (
                  <motion.tr
                    key={creator.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: [0, 0, 0.2, 1],
                      delay: Math.min(i * 0.03, 0.24),
                    }}
                    className="group"
                    style={{
                      borderBottom: "1px solid rgba(35,32,31,0.04)",
                      backgroundColor: selected.has(creator.id)
                        ? "rgba(246,141,61,0.05)"
                        : undefined,
                    }}
                  >
                    <td className="w-10 px-3 py-2">
                      <Checkbox checked={selected.has(creator.id)} onToggle={() => toggleOne(creator.id)} />
                    </td>

                    <td className={TD}>
                      <InlineSelect value={creator.canal} options={CANAIS} onChange={(v) => update(creator.id, { canal: v as Canal })} />
                    </td>
                    <td className={TD}>
                      <InlineSelect value={creator.pais} options={PAISES} onChange={(v) => update(creator.id, { pais: v as Pais })} />
                    </td>
                    <td className={TD}>
                      <InlineSelect
                        value={creator.analista ?? "—"}
                        options={["—", ...ANALISTAS]}
                        onChange={(v) => update(creator.id, { analista: v === "—" ? null : v as Analista })}
                      />
                    </td>

                    <td className={TD}>
                      <EditableText value={creator.nome} placeholder="nome..." onSave={(v) => update(creator.id, { nome: v || null })} />
                    </td>

                    <td className={TD}>
                      <InlineSelect value={creator.tier} options={TIERS} onChange={(v) => update(creator.id, { tier: v as Tier })} />
                    </td>
                    <td className={TD}>
                      <InlineSelect value={creator.segmento} options={SEGMENTOS} onChange={(v) => update(creator.id, { segmento: v as Segmento })} />
                    </td>

                    {/* Perfil — handle à esquerda, ícone de link fixo à direita */}
                    <td className={TD}>
                      <div className="flex min-w-[130px] items-center gap-1">
                        <div className="flex-1 min-w-0">
                          <EditableText
                            value={creator.perfil_handle}
                            placeholder="@..."
                            onSave={(v) => update(creator.id, { perfil_handle: v })}
                          />
                        </div>
                        <motion.a
                          href={
                            creator.perfil_handle
                              ? creator.perfil_handle.startsWith("http")
                                ? creator.perfil_handle
                                : `https://instagram.com/${creator.perfil_handle.replace("@", "")}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { if (!creator.perfil_handle) e.preventDefault(); }}
                          whileHover={{ scale: 1.2, color: "#F68D3D" }}
                          whileTap={{ scale: 0.9 }}
                          className="shrink-0 text-[#C9B9A8] opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <ExternalLink size={12} />
                        </motion.a>
                      </div>
                    </td>

                    <td className={TD}>
                      <BoolCell value={creator.contato} onChange={(v) => update(creator.id, { contato: v })} />
                    </td>
                    <td className={TD}>
                      <BoolCell value={creator.respondido} onChange={(v) => update(creator.id, { respondido: v })} />
                    </td>

                    {/* Status com badge colorida */}
                    <td className={TD}>
                      <StatusDropdown
                        status={creator.status}
                        onChange={(v) => update(creator.id, { status: v as Status })}
                      />
                    </td>

                    <td className={TD}>
                      <EditableText value={creator.obs} placeholder="obs..." onSave={(v) => update(creator.id, { obs: v || null })} />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé com total */}
        {creators.length > 0 && (
          <div
            className="px-4 py-3 text-[12px] font-semibold text-[#A08E7E]"
            style={{ borderTop: "1px solid rgba(35,32,31,0.04)" }}
          >
            {creators.length} creator{creators.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
