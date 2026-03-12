"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface FormSelectProps {
  value: string;
  options: { label: string; value: string }[] | string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FormSelect({ value, options, onChange, placeholder }: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const normalized = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );
  const selected = normalized.find((o) => o.value === value);
  const displayLabel = selected?.label ?? placeholder ?? "Selecionar";

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
        whileHover={{ borderColor: "rgba(35,32,31,0.18)" }}
        whileFocus={{ borderColor: "#F68D3D" }}
        transition={{ duration: 0.12 }}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-[10px] border border-transparent bg-[#F4EEE5] px-3 text-left text-[14px] font-semibold text-ink-500 outline-none"
        style={{ borderColor: open ? "#F68D3D" : undefined, backgroundColor: open ? "#FFFFFF" : undefined }}
      >
        <span className={!selected && placeholder ? "text-[#A08E7E]" : "text-ink-500"}>
          {displayLabel}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0"
        >
          <ChevronDown size={14} className="text-[#A08E7E]" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: [0, 0, 0.2, 1] }}
            className="absolute left-0 top-full z-[100] mt-1 w-full min-w-[140px] overflow-hidden rounded-[12px] bg-white py-1.5"
            style={{ border: "1px solid rgba(35,32,31,0.08)" }}
          >
            {normalized.map((opt) => (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                whileHover={{ backgroundColor: "#F4EEE5" }}
                transition={{ duration: 0.1 }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold text-ink-500"
              >
                <span className="w-4 shrink-0 text-primary-500">
                  {opt.value === value && <Check size={13} />}
                </span>
                {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
