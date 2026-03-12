"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import {
  CANAIS, PAISES, TIERS, SEGMENTOS, STATUS_LIST, ANALISTAS,
  type Canal, type Pais, type Tier, type Segmento, type Status, type Analista,
} from "@/types/creator";
import { createCreator } from "@/lib/actions/creators";
import { useToast } from "@/components/ui/toast";
import { FormSelect } from "@/components/ui/form-select";

const FIELD_STYLE =
  "h-10 w-full rounded-[10px] border border-transparent bg-[#F4EEE5] px-3 text-[14px] font-semibold text-ink-500 placeholder:text-[#A08E7E] outline-none focus:border-[#F68D3D] focus:bg-white transition-colors duration-150";

const LABEL_STYLE = "text-[11px] font-bold uppercase tracking-[0.4px] text-[#A08E7E]";

interface FormState {
  canal: Canal;
  pais: Pais;
  analista: Analista | "";
  nome: string;
  tier: Tier;
  segmento: Segmento;
  perfil_handle: string;
  contato: boolean;
  respondido: boolean;
  status: Status;
  obs: string;
}

const INITIAL: FormState = {
  canal: "Instagram",
  pais: "Brasil",
  analista: "",
  nome: "",
  tier: "—",
  segmento: "—",
  perfil_handle: "",
  contato: true,
  respondido: false,
  status: "Contatada",
  obs: "",
};

function BoolToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex h-10 items-center gap-1 rounded-[10px] bg-[#F4EEE5] p-1">
      {["SIM", "NÃO"].map((opt) => {
        const isActive = opt === "SIM" ? value : !value;
        return (
          <motion.button
            key={opt}
            type="button"
            onClick={() => onChange(opt === "SIM")}
            initial={false}
            animate={{
              backgroundColor: isActive ? "#F68D3D" : "rgba(0,0,0,0)",
              color: isActive ? "#FFFFFF" : "#A08E7E",
            }}
            whileHover={!isActive ? { backgroundColor: "rgba(213,203,192,0.4)", color: "#23201F" } : undefined}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 rounded-[7px] text-[13px] font-bold py-1"
          >
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

export function NovaProspeccaoForm() {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.perfil_handle.trim()) {
      toast.error("Perfil / @ é obrigatório");
      return;
    }
    startTransition(async () => {
      const res = await createCreator({
        ...form,
        analista: form.analista || null,
        nome: form.nome || null,
        obs: form.obs || null,
      });
      if (res.ok) {
        toast.success("Creator adicionado!");
        setForm(INITIAL);
      } else {
        toast.error(res.error ?? "Erro ao salvar");
      }
    });
  }

  return (
    <div className="rounded-[20px] bg-white overflow-hidden">
      {/* Header colapsável */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-6 py-4 text-left"
        whileHover={{ backgroundColor: "rgba(244,238,229,0.5)" }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.12 }}
      >
        <Plus size={16} className="text-primary-500 shrink-0" />
        <span className="flex-1 text-[14px] font-bold text-ink-500 uppercase tracking-[0.4px]">
          Nova Prospecção
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown size={16} className="text-[#A08E7E]" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <form onSubmit={handleSubmit} className="px-6 pb-6">
              <div className="mb-4 h-px" style={{ background: "rgba(35,32,31,0.06)" }} />

              {/* Linha 1 */}
              <div className="mb-3 grid grid-cols-6 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Canal</label>
                  <FormSelect
                    value={form.canal}
                    options={CANAIS}
                    onChange={(v) => set("canal", v as Canal)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL_STYLE}>País</label>
                  <FormSelect
                    value={form.pais}
                    options={PAISES}
                    onChange={(v) => set("pais", v as Pais)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Analista *</label>
                  <FormSelect
                    value={form.analista}
                    options={[{ label: "Quem?", value: "" }, ...ANALISTAS.map((a) => ({ label: a, value: a }))]}
                    onChange={(v) => set("analista", v as Analista | "")}
                    placeholder="Quem?"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Nome</label>
                  <input
                    className={FIELD_STYLE}
                    placeholder="Nome da creator"
                    value={form.nome}
                    onChange={(e) => set("nome", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Tier</label>
                  <FormSelect
                    value={form.tier}
                    options={TIERS}
                    onChange={(v) => set("tier", v as Tier)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Status</label>
                  <FormSelect
                    value={form.status}
                    options={STATUS_LIST}
                    onChange={(v) => set("status", v as Status)}
                  />
                </div>
              </div>

              {/* Linha 2 */}
              <div className="mb-4 grid grid-cols-6 gap-3">
                <div className="col-span-1 flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Segmento/Nicho</label>
                  <FormSelect
                    value={form.segmento}
                    options={SEGMENTOS}
                    onChange={(v) => set("segmento", v as Segmento)}
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Perfil / @*</label>
                  <input
                    className={FIELD_STYLE}
                    placeholder="@perfil ou cole o link"
                    value={form.perfil_handle}
                    onChange={(e) => set("perfil_handle", e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Contato</label>
                  <BoolToggle value={form.contato} onChange={(v) => set("contato", v)} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={LABEL_STYLE}>Respondido</label>
                  <BoolToggle value={form.respondido} onChange={(v) => set("respondido", v)} />
                </div>

                <div className="flex items-end">
                  <motion.button
                    type="submit"
                    disabled={pending}
                    initial="rest"
                    whileHover="hovered"
                    whileTap={{ scale: 0.96 }}
                    animate="rest"
                    variants={{
                      rest:    { scale: 1,    backgroundColor: "#F68D3D" },
                      hovered: { scale: 1.03, backgroundColor: "#F79E55" },
                    }}
                    transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                    className="h-10 w-full rounded-[18px] text-[14px] font-bold text-white disabled:opacity-60"
                  >
                    {pending ? "Salvando..." : "+ Salvar"}
                  </motion.button>
                </div>
              </div>

              {/* OBS */}
              <div className="flex flex-col gap-1">
                <label className={LABEL_STYLE}>OBS</label>
                <input
                  className={FIELD_STYLE}
                  placeholder="contexto rápido..."
                  value={form.obs}
                  onChange={(e) => set("obs", e.target.value)}
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
