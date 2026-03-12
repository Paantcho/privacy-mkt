"use client";

import * as React from "react";
import { motion } from "framer-motion";

/**
 * Button Privacy — MotionButton com whileHover/whileTap.
 *
 * Variantes:
 *   primary   → laranja #F68D3D, texto carvão #23201F
 *   secondary → off-white #F4EEE5, texto carvão
 *   ghost     → transparente, texto carvão/cinza
 *   danger    → vermelho suave
 *
 * Com ícone: use variantes propagadas (initial="rest" whileHover="hovered" no pai,
 * variants={{ rest: {scale:1}, hovered: {scale:1.2} }} no motion.span filho).
 * NUNCA usar whileHover diretamente no filho.
 */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANT_STYLES: Record<ButtonVariant, {
  bg: string; bgHover: string; bgTap: string; text: string;
}> = {
  primary: {
    bg:      "#F68D3D",
    bgHover: "#F79E55",
    bgTap:   "#D97A33",
    text:    "#23201F",
  },
  secondary: {
    bg:      "#F4EEE5",
    bgHover: "#EDE5D9",
    bgTap:   "#E0D5C5",
    text:    "#23201F",
  },
  ghost: {
    bg:      "rgba(0,0,0,0)",
    bgHover: "rgba(35,32,31,0.06)",
    bgTap:   "rgba(35,32,31,0.10)",
    text:    "#7A7370",
  },
  danger: {
    bg:      "rgba(239,68,68,0.10)",
    bgHover: "rgba(239,68,68,0.18)",
    bgTap:   "rgba(239,68,68,0.24)",
    text:    "#DC2626",
  },
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm:   "px-3 py-1.5 text-[13px] rounded-[14px]",
  md:   "px-4 py-3 text-[16px] rounded-[18px]",
  lg:   "px-5 py-3.5 text-[18px] rounded-[18px]",
  icon: "h-9 w-9 rounded-[12px]",
};

interface ButtonProps extends Omit<React.ComponentProps<"button">, "style"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const MotionButton = motion.create("button");

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const v = VARIANT_STYLES[variant];

  return (
    <MotionButton
      initial="rest"
      whileHover="hovered"
      whileTap={{ scale: 0.96 }}
      animate="rest"
      variants={{
        rest:    { scale: 1, backgroundColor: v.bg },
        hovered: { scale: 1.03, backgroundColor: v.bgHover },
      }}
      transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      className={`inline-flex items-center justify-center gap-2 font-semibold tracking-[0.3px] outline-none disabled:opacity-50 disabled:pointer-events-none ${SIZE_STYLES[size]} ${className}`}
      style={{ color: v.text }}
      {...(props as React.ComponentProps<typeof MotionButton>)}
    >
      {children}
    </MotionButton>
  );
}
