"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Dropdown totalmente customizado — zero <select> nativo.
 * Tokens Privacy: bg #F4EEE5, texto #23201F, check laranja #F68D3D.
 * AnimatePresence obrigatório — nunca {open && <div>} sem animação.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Selecionar...",
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? null;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-[12px] border border-transparent py-2.5 pl-3.5 pr-3 text-[14px] font-semibold outline-none transition-[border-color,box-shadow] duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "#F4EEE5",
          color: selectedLabel ? "#23201F" : "#A08E7E",
        }}
        whileHover={!disabled ? { borderColor: "rgba(35,32,31,0.15)" } : {}}
        animate={
          open
            ? { boxShadow: "0 0 0 3px rgba(246,141,61,0.18)", borderColor: "#F68D3D" }
            : { boxShadow: "none", borderColor: "transparent" }
        }
        transition={{ duration: 0.15 }}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0"
        >
          <ChevronDown size={14} color="#A08E7E" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[12px] bg-white py-1.5"
            style={{
              boxShadow: "0 8px 32px rgba(35,32,31,0.14), 0 2px 8px rgba(35,32,31,0.06)",
            }}
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value;
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[13px] font-semibold"
                  style={{ color: isSelected ? "#23201F" : "#7A7370" }}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.12, delay: idx * 0.025, ease: [0, 0, 0.2, 1] }}
                  whileHover={{ backgroundColor: "#F4EEE5", color: "#23201F" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    >
                      <Check size={13} strokeWidth={3} color="#F68D3D" />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
