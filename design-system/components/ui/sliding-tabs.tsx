"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface SlideTab {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface SlidingTabsProps {
  tabs: SlideTab[];
  activeId: string;
  onChange: (id: string) => void;
  /** Cor do fundo do container. Padrão: #FFFFFF */
  containerBg?: string;
  /** Cor da pill ativa. Padrão: #F68D3D (laranja Privacy) */
  pillColor?: string;
}

const iconVariants = {
  rest:    { scale: 1 },
  hovered: { scale: 1.2 },
};

/**
 * Tabs com pill spring.
 * UMA motion.div absoluta se move — nunca muda bg dos botões.
 * Tokens Privacy: pill laranja #F68D3D, hover areia rgba(213,210,201,0.35).
 */
export function SlidingTabs({
  tabs,
  activeId,
  onChange,
  containerBg = "#FFFFFF",
  pillColor = "#F68D3D",
}: SlidingTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>(Array(tabs.length).fill(null));
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);

  useEffect(() => {
    const idx = tabs.findIndex((t) => t.id === activeId);
    const btn = btnRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setPillLeft(bRect.left - cRect.left);
    setPillWidth(bRect.width);
  }, [activeId, tabs]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center rounded-[20px] p-1.5"
      style={{ background: containerBg }}
    >
      {/* Pill deslizante */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-[9999px]"
        animate={{ left: pillLeft, width: pillWidth }}
        transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.8 }}
        style={{ top: 6, bottom: 6, background: pillColor }}
      />

      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeId;
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            ref={(el) => { btnRefs.current[idx] = el; }}
            type="button"
            onClick={() => onChange(tab.id)}
            initial="rest"
            whileHover={!isActive ? "hovered" : "rest"}
            whileTap={{ scale: 0.97 }}
            animate="rest"
            className="relative z-10 flex items-center gap-2 rounded-[9999px]"
            style={{ fontSize: "13px", padding: "8px 18px", fontWeight: isActive ? 700 : 500 }}
            variants={{
              rest:    { color: isActive ? "#23201F" : "#A08E7E", backgroundColor: "rgba(0,0,0,0)" },
              hovered: { color: "#23201F", backgroundColor: "rgba(213,210,201,0.35)" },
            }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            {Icon && (
              <motion.span
                className="shrink-0 flex items-center"
                variants={!isActive ? iconVariants : undefined}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <Icon size={14} />
              </motion.span>
            )}
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
}
