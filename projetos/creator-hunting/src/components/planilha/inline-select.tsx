"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  colorMap?: Record<string, string>;
}

export function InlineSelect({
  value,
  options,
  onChange,
  placeholder = "—",
  className,
  colorMap,
}: InlineSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const displayValue = value || placeholder;
  const colorClass = colorMap?.[value] ?? "";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ backgroundColor: "rgba(213,203,192,0.3)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[13px] font-semibold transition-colors",
          colorClass || "text-ink-500"
        )}
      >
        <span>{displayValue}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown size={12} className="opacity-50" />
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
            {options.map((opt) => (
              <motion.button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                whileHover={{ backgroundColor: "#F4EEE5" }}
                transition={{ duration: 0.1 }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] font-semibold text-ink-500"
              >
                <span className="w-3.5 shrink-0">
                  {opt === value && <Check size={12} className="text-primary-500" />}
                </span>
                <span>{opt}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
